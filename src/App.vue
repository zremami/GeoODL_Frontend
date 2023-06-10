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
              :dates="dates"
              @precipitationFeature="precipitationFeatureCallback"
              @odlFeature="odlFeatureCallback"
              @stationResponse="stationResponseMethod">
            </map-container>
          </v-col>    
          <v-col>
            <my-filter
              v-if="odlFeature"
              :filter="filter"
              :dates="dates"
              @datesUpdated="datesCallback"
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
              Privacy Policy
            </v-card-title>

            <v-card-text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="dialog = false"
              >
                I accept
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
