<template>
<v-app>
  <header>
    <v-toolbar

      dark
      class="primary"
    >
      <v-toolbar-title>A Web-Based Decision Support System for Spatial Problem Solving</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

        <v-img
          lazy-src="./assets/logo copy.png"
          max-height="70"
          max-width="70"
          src="./assets/logo copy.png"
        ></v-img>
      
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
              :effect1="effect1"
              :effect2="effect2"
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
              @effect1Updated="effect1Callback"
              @effect2Updated="effect2Callback"
              >
            </my-filter>
            <my-chart 
              :dates="dates"
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
            width="800"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
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
                <v-row>
                  <v-col class="mt-5 ma-auto">
                    <p>
                      This project involves the development of a web-based spatial decision support system designed to assist doctors and policymakers in assessing the risk level of Ambient Gamma Dose Rate (AGDR) in Germany. The purpose of this application, developed as a master's thesis project titled "Designing and Evaluating a Web Spatial Decision Support System for Spatial Problem Solving," provides a comprehensive tool for analyzing and visualizing gamma ambient dose rate data. The system is evaluated using this application, which has been specifically commissioned by the Bundesamt für Strahlenschutz (BfS).
                    </p><p>
                      In order to assess the potential risk posed by elevated AGDR levels, one approach is to demonstrate that the increase in AGDR is caused by external factors and remains within a safe range. According to a report from BfS, under natural circumstances, AGDR can experience a temporary increase of up to twice its normal level when radioactive decay products of radon are washed out of the atmosphere by precipitation and subsequently deposited on the ground.
                    </p><p>
                      The objective of this project is to provide medical professionals and policymakers with valuable insights regarding AGDR risk levels. This is accomplished by employing advanced data mining techniques to establish a definitive relationship between AGDR and precipitation.
                    </p><p>
                      AGDR data was collected by BfS measurement stations. Collaboratively with Germany's National Meteorological Service, precipitation data has been obtained from weather radar technology provided by BfS. Both datasets are time series. We have assessed the relationship between AGDP and precipitation, as well as precipitation occurring two hours prior (considering the time series nature of the data and the possibility of a 2-hour delay on AGDR) and seasonal effects. The findings demonstrate promising correlations. Utilizing these data mining discoveries, an interactive and user-friendly platform has been developed as a predictive and simulation model. This platform empowers doctors and policymakers to make well-informed decisions by examining these results.
                    </p><p>
                      Once a station is chosen, the intended users will have access to sophisticated data visualizations that include interpretations, prediction capabilities, and simulation tools. With respect to the prediction and simulation tools, users can select their desired time of year to view the prediction model. Furthermore, there are two dropdown menus available that enable users to simulate rainfall impact by adjusting a multiplier ranging from 0 to 2. Additionally, using the same tool and format, users can examine the effects of precipitation occurring two hours prior.
                    </p>
                  </v-col>
                </v-row>

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
      odlFeature: undefined,
      dialog: false,
      filter: {
        //dates: ['01-01-2023','01-07-2023']
      },
      dates: [
        (new Date(new Date().setDate(new Date().getDate() - 7) - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      ],
      effect1: 1.0,
      effect2: 1.0,
    }),
    methods:
    {
      stationResponseMethod: function(value){
        this.geojson = value;
      },
      odlFeatureCallback: function(value){
        this.odlFeature = value;
      },
      datesCallback: function(value){
        this.dates = value;
      },
      effect1Callback: function(value){
        this.effect1 = value;
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
