<template>
  <v-container 
    ref="map-root"
    :geojsonBaseLayer="geojsonBaseLayer"
    fluid
    class="pa-0"
    style="height:115vh;width: 100%;position: relative;"
  >
    <v-dialog
      v-model="loading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div id="popup"></div>
    <v-btn style="position: absolute;top:10px;right:10px;z-index: 1000" id="current-location-button">My Location {{ userLocation }}</v-btn>
  </v-container>
</template>

<script>
  import View from 'ol/View'
  import Map from 'ol/Map'
  import Overlay from 'ol/Overlay';
  import TileLayer from 'ol/layer/Tile'
  import OSM from 'ol/source/OSM'
  import VectorLayer from 'ol/layer/Vector'
  import VectorSource from 'ol/source/Vector'
  import GeoJSON from 'ol/format/GeoJSON'
  import { fromLonLat } from 'ol/proj';
  import Feature from 'ol/Feature';
  import Point from 'ol/geom/Point';
  import 'ol/ol.css'
  
  // Default Data
  import DEU from '../assets/DEU.json'

  //Hovering
  import Fill from 'ol/style/Fill'
  import Stroke from 'ol/style/Stroke'
  import Style from 'ol/style/Style'
  //import Circle from 'ol/geom/Circle';

  export default {
    name: 'MapContainer',
    emits: ['precipitationFeature', 'odlFeature', 'stationResponse'],
    components: {},
    props: {
      geojson: { type: Object, require: false},
      baseLayerSelected: { type: Boolean, require: true, default: true},
      dates: {
        type: Array,
        require: true,
      },
      effect: {
        type: Number,
        require: false,
      },
    },
    data: () => ({
      vectorLayer: null,
      geojsonBaseLayer: DEU,
      localityCode: null,
      odl_7days_Url: 'http://127.0.0.1:5000/odls/{locality_code}/7-days/{started}/{ended}',
      stationUrl: 'http://127.0.0.1:5000/stations',
      odlUrl: 'http://127.0.0.1:5000/prediction/{locality_code}/{started}/{ended}/{effect}',
      loading: false,
      userLocation: null,
    }),
    mounted() {

      const vectorSource = new VectorSource()
      this.vectorLayer = new VectorLayer({
        source: vectorSource
      });

      this.olMap = new Map({
        target: this.$refs['map-root'],
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          this.vectorLayer
        ],
        view: new View({
          zoom: 0,
          center: [0, 0],
          constrainResolution: true
        }),
      });

      // Add the "current location" button event listener
      const getCurrentLocationButton = document.getElementById('current-location-button');
      getCurrentLocationButton.addEventListener('click', this.getCurrentLocation.bind(this, this.olMap, vectorSource));

      this.setFeatures();

      this.updateSource(this.geojson, this.baseLayerSelected);

      setTimeout(() => {
        this.getStations();
      }, 1000);

    },
    watch: {
      geojson: {
        handler: function (value) {
          this.updateSource(value, this.baseLayerSelected)
        },
        deep: true
      },
      baseLayerSelected: {
        handler: function (value) {
          this.updateSource(this.geojson, value)
        },
        deep: true
      },
      dates: {
        handler: function () {
          if(this.localityCode)
            this.getOdlFeatures(this.localityCode);
        },
        deep: true
      },
      effect: {
        handler: function () {
          if(this.localityCode)
            this.getOdlFeatures(this.localityCode);
        },
        deep: true
      },
    },
    methods: {
      //basemap
      updateSource: function(geojson, baseLayerPreview) {

        try
        {
          const view = this.olMap.getView();
          const source = this.vectorLayer.getSource();
          var features = [];

          if(baseLayerPreview !== null && baseLayerPreview)
            features = features.concat(new GeoJSON({featureProjection: 'EPSG:3857'}).readFeatures(this.geojsonBaseLayer));

          if(geojson !== null && geojson)
            features = features.concat(new GeoJSON({featureProjection: 'EPSG:3857'}).readFeatures(geojson));

          source.clear();
          if(features && features.length > 0)
          {
            source.addFeatures(features);
            view.fit(source.getExtent());
          }
          
        }
        catch (error)
        {
          console.log(error);
        }
        
      },
      // add pop up
      setFeatures: function() {
        try 
        {
          const self = this;

          // Popup layer
          const popupContainer = document.getElementById('popup');

          const popupOverlay = new Overlay({
            element: popupContainer,
            offset: [10, 10],
          });

          this.olMap.addOverlay(popupOverlay);
          
          let selected = null;

          this.olMap.on('pointermove', function (e) {
            if (selected !== null) {
              selected.setStyle(undefined);
              selected = null;
            }
            
            // set pop up
            this.forEachFeatureAtPixel(e.pixel, function (feature) {
              selected = feature;

              /* Set Style
              const highlightStyle = new Style({
                fill: new Fill({
                  color: 'rgba(0,0,255,0.7)',
                }),
                stroke: new Stroke({
                  color: 'rgba(0,0,0,1.0)',
                  width: 2,
                }),
              });
              feature.setStyle(highlightStyle);*/

              
              // Add popup
              //let localityCode = feature.get('Locality_code');
              let localityName = feature.get('Locality_name');
              //let geometry = feature.get('Geometry');
              var content = localityName ? 
              '<b>' + localityName + '</b>'
              /*
                '<ul class="popup-ul">' +
                  '<li><b>Name:</b> ' + localityName + '</li>' +
                  '<li><b>Code:</b> ' + localityCode + '</li>' +
                  '<li><b>Geometry:</b> [' + geometry + ']</li>' +
                '</ul>'
                */: null;

              if(content)
              {
                popupContainer.innerHTML = content;
                popupOverlay.setPosition(e.coordinate);
              }

              return true;
            });

            // Hide the popup
            if (selected === null) {
              document.getElementById('popup').innerHTML = '';
              popupOverlay.setPosition(null);
            }
            
          });

          //select and sending data
          this.olMap.on('click', function (e) {

            this.forEachFeatureAtPixel(e.pixel, function (feature) {
              selected = feature;

              //let local_authority = feature.get('local_authority');

              self.localityCode = feature.get('Locality_code');

              //let features = self.geojson.features.filter((n) => {
                  //return n.properties.local_authority === local_authority;
              //});

              if(self.localityCode)
                self.getOdlFeatures(self.localityCode);
              //self.getprecipitationFeatures(localityCode);

              //self.$emit('odlFeature', features);

              return true;
            });

          });

          
        }catch (error) 
        {
          console.log(error);
        }

      },
      // Get uniq items
      onlyUnique: function (value, index, self) {
        return self.indexOf(value) === index;
      },
      getCurrentLocation: function (map, vectorSource) {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            const { longitude, latitude } = position.coords;

            this.userLocation = [longitude, latitude]

            //const features = vectorSource.getFeatures();

            // Clear previous features
            //vectorSource.clear();

            let locationStyle = new Style({
              fill: new Fill({ color: 'rgba(255, 0, 0, 1)' }),
              stroke: new Stroke({ color: 'rgba(255, 255, 255, 1)', width: 2 }),
            });

            // Add a new feature representing the current location
            const currentLocationFeature = new Feature({
              geometry: new Point(fromLonLat(this.userLocation)),
              labelPoint: new Point(this.userLocation),
              style: locationStyle,
              name: 'My Polygon',
            });

            //currentLocationFeature.setStyle(locationStyle);
            vectorSource.addFeature(currentLocationFeature);

            //console.log(features);

            // Center the map on the current location
            map.getView().setCenter(fromLonLat([longitude, latitude]));
            map.getView().setZoom(12);
          });
        } else {
          alert('Geolocation is not supported by your browser.');
        }
      },

      // get odl latest 7 days for selected locality_code
      getOdlFeatures: async function(locality_code){

        let result = null;

        const localityCodeRegex = /{locality_code}/i;
        let getFeatureUrl = this.odlUrl.replace(localityCodeRegex, locality_code)

        if(this.dates[0])
        {
          const startedRegex = /{started}/i;
          getFeatureUrl = getFeatureUrl.replace(startedRegex, this.dates[0])
        }

        if(this.dates[1])
        {
          const endedRegex = /{ended}/i;
          getFeatureUrl = getFeatureUrl.replace(endedRegex, this.dates[1])
        }

        const effectRegex = /{effect}/i;
        getFeatureUrl = getFeatureUrl.replace(effectRegex, this.effect)

        this.loading = true;
        await fetch(getFeatureUrl)
          .then(response => response.json())
          .then(data => {
            result = JSON.stringify(data);
            result = JSON.parse(result);

            this.$emit('odlFeature', result);
          } )

        this.loading = false;

        //this.$emit('wfsResponse', JSON.parse(this.jsondata));
        

        //return JSON.parse(result);
      },
      // get odl latest 7 days for selected locality_code
      getprecipitationFeatures: async function(locality_code){

        let result = null;

        const regex = /{locality_code}/i;
        let getFeatureUrl = this.odl_7days_Url.replace(regex, locality_code);

        this.loading = true;
        await fetch(getFeatureUrl)
          .then(response => response.json())
          .then(data => {
            result = JSON.stringify(data);
            result = JSON.parse(result);

            this.$emit('precipitationFeature', result.features);
          } )
        this.loading = false;

      },
      getStations: async function(){
        this.loading = true;

        let jsondata = null;

        await fetch(this.stationUrl)
          .then(response => response.json())
          .then(data => { jsondata = JSON.stringify(data); } )

        this.loading = false;

        this.$emit('stationResponse', JSON.parse(jsondata));
      },
    }
  }
</script>

<style scoped>
  #popup {
    border-radius: 5px;
    border: 1px solid grey;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 8px;
    list-style: none;
  }

  #popup .popup-ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }


/* loader */
.loader {
  border: 16px solid #888888;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 100px;
  height: 100px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  position: absolute;
  top: 45%;
  left: 45%;
  z-index: 100;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>