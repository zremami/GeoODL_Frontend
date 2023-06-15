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
          <v-col cols="12" md="4" class="pa-0">
            <map-container 
              :geojson="geojson"
              :dates="dates"
              :effect="effect"
              :effect2="effect2"
              @precipitationFeature="precipitationFeatureCallback"
              @odlFeature="odlFeatureCallback"
              @stationResponse="stationResponseMethod">
            </map-container>
          </v-col>    
          <v-col cols="12" md="8">
            <my-filter
              v-if="odlFeature"
              :filter="filter"
              :dates="dates"
              @datesUpdated="datesCallback"
              @effectUpdated="effectCallback"
              @effect2Updated="effect2Callback"
              >
            </my-filter>
            <my-chart 
              :dates="dates"
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
      <v-col>
        <div class="text-center">
          <v-dialog
            v-model="dialog"
            width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red lighten-2"
                dark
                v-bind="attrs"
                v-on="on"
              >
                About Us
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                About us
              </v-card-title>

              <v-card-text>
                  <p>
                    The aim of this project is to develop a web-based Spatial Decision Support System (SDSS) that addresses a range of spatial problems by leveraging previous research and relevant aspects related to this study. The primary goal of the system is to provide decision-makers with a robust tool for solving spatial problems, with a specific focus on overcoming the challenges discussed in detail earlier. To evaluate the effectiveness and practicality of the proposed system, a comprehensive case study will be conducted in collaboration with Bundesamt für Strahlenschutz (BfS), a prominent organization in Germany.
                  </p><p>
                    In recent years, there has been significant attention devoted to investigating the relationship between ambient gamma dose rate on the ground and precipitation, particularly within the context of BfS's research. As part of their extensive measurement activities, the BfS has diligently tracked environmental radioactivity levels throughout Germany, leading to the observation that the ambient gamma dose rate is correlated with precipitation levels.
                  </p><p>
                    It is well-known that ionizing radiation, such as gamma radiation, can pose risks to human health and the environment, especially when the exposure levels are high. The BfS has reported that external factors such as rain can influence the intensity of the local dose rate. This phenomenon occasionally leads to a temporary doubling of the normal dose rate.
                  </p><p>
                    This information holds critical importance for public safety, as it enables individuals to comprehend the variations in radiation levels across different regions and under diverse weather conditions. Understanding these differences is crucial for ensuring appropriate measures are taken to protect public health.
                  </p><p>
                    By developing a web-based SDSS that integrates and analyzes relevant data on ambient gamma dose rate and precipitation, this project aims to provide an effective solution to support decision-making processes, enhance public safety, and enable informed actions related to radiation protection.
                  </p>

                  <v-carousel class="my-6">
                    <v-carousel-item
                      src="assets/1.jpeg"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                    ></v-carousel-item>
                    <v-carousel-item
                      src="assets/2.jpeg"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                    ></v-carousel-item>
                  </v-carousel>

                </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="dialog = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-col>
    </v-row>
  </v-footer>
</v-app>
</template>

<script>
import MapContainer from './components/MapContainer'
  import MyChart from './components/MyChart'
  import MyFilter from './components/MyFilter'

  export default {
    name: 'App',
    components: {
      MapContainer,
      MyChart,
      MyFilter
    },
    data: () => ({
      geojson: undefined,
      precipitationFeature: undefined,
      odlFeature: undefined,
      dialog: false,
      filter: {
        //dates: ['01-01-2023','01-07-2023']
      },
      dates: [
        (new Date(new Date().setDate(new Date().getDate() - 7) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      ],
      effect: 1.0,
      effect2: 1.0,
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
      },
      datesCallback: function(value){
        this.dates = value;
      },
      effectCallback: function(value){
        this.effect = value;
      },
      effect2Callback: function(value){
        this.effect2 = value;
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
