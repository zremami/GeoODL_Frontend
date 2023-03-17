<template>
<v-app>
  <header>
    <v-toolbar>
      <v-toolbar-items>
        <v-btn to="/">Home</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </header>
  <v-main>
  <div id="app" >
    <v-container fluid>
      <v-row>
          <v-col class="pa-0">
            <map-container 
              :geojson="geojson"
              @precipitationFeature="precipitationFeatureCallback"
              @odlFeature="odlFeatureCallback"
              @stationResponse="stationResponseMethod">
            </map-container>
          </v-col>    
          <v-col>
            <my-chart 
              :precipitationFeature="precipitationFeature"
              :odlFeature="odlFeature"
              >
            </my-chart>
          </v-col>
      </v-row>
    </v-container>
  </div>
  </v-main>
  <v-footer>
  <v-row>
    <v-col><v-btn to="/about-us">About Us</v-btn></v-col>
  </v-row>
  </v-footer>
</v-app>
</template>

<script>
  import MapContainer from './components/MapContainer'
  import MyChart from './components/MyChart'

  export default {
    name: 'App',
    components: {
      MapContainer,
      MyChart,
    },
    data: () => ({
      geojson: undefined,
      precipitationFeature: undefined,
      odlFeature: undefined,
    }),
    methods:
    {
      stationResponseMethod: function(value){
        this.geojson = value;
      },
      precipitationFeatureCallback: function(value){
        this.precipitationFeature = value;
      },
      odlFeatureCallback: function(value){
        this.odlFeature = value;
      }
    }
  }
</script>

<style>
  *{
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    margin: 0;
    background-color: #f0f0f0;
  }

  /*#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    height: 100%;
    display: grid;
    grid-auto-rows: 1fr;
    grid-gap: 1rem;
    padding: 1rem;
  }

  .cell {
    border-radius: 4px;
    background-color: white;
  }

  .cell-map {
    grid-column: 1 / 7;
    grid-row: 1 / 9;
  }

  .cell-url {
    grid-column: 6 / 9;
    grid-row: 1 / 4;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 20px;
    justify-self: right;
  }

  .cell-chart {
    grid-column:  6 / 9;
    grid-row: 4 / 9;
    justify-self: right;
  }*/
/*:baseLayerSelected="baseLayerPreview"*/

</style>
