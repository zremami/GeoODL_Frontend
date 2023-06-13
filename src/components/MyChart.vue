<template>

  <v-card class="mt-4">
    <!--
    <v-tabs
      v-model="tab"
      background-color="primary"
      dark
    >
      <v-tab
        v-for="item in items"
        :key="item.tab"
      >
        {{ item.tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        :key="items[0].tab"
      >
      -->
        <v-card flat>
          <v-card-text>
            
            <div class="figure" :style="`display:${odlFeature && odlFeature.result ? 'block' : 'none'}`">
              <e-chart
                :option="odlOptions"
                :init-options="initOptions"
                ref="odl"
                autoresize
              />
            </div>
          </v-card-text>

          <v-card-subtitle style="text-align: justify" v-if="odlFeature && odlFeature.message">
          <h2 class="my-2">Interpretation of the diagram</h2>

            <v-divider class="mb-2"></v-divider>

            <span>This is a chart showing the real and predicted value of Ambient Gamma Dose Rates(AGDR) and Precipitation in 7 days from
              <u>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <strong
                      class="d-inline-block"
                      v-bind="attrs"
                      v-on="on"
                      @mouseover="hoverOver(Math.min(...odlFeature.result.map(e => e.end_measure)))"
                      @mouseout="hoverOut"
                    >{{ moment(Math.min(...odlFeature.result.map(e => e.end_measure)) * 1000).format("y-MM-DD HH:mm:ss") }}</strong>
                  </template>
                  <span>{{ moment(Math.min(...odlFeature.result.map(e => e.end_measure)) * 1000).fromNow() }}</span>
                </v-tooltip>
              </u>
              to 
              <u>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <strong
                      class="d-inline-block"
                      v-bind="attrs"
                      v-on="on"
                      @mouseover="hoverOver(Math.max(...odlFeature.result.map(e => e.end_measure)))"
                      @mouseout="hoverOut"
                    >{{ moment(Math.max(...odlFeature.result.map(e => e.end_measure)) * 1000).format("y-MM-DD HH:mm:ss") }}</strong>
                  </template>
                  <span>{{ moment(Math.max(...odlFeature.result.map(e => e.end_measure)) * 1000).fromNow() }}</span>
                </v-tooltip>
              </u>
              in
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <strong
                    class="d-inline-block"
                    v-bind="attrs"
                    v-on="on"
                  >{{ odlFeature.localityName }}</strong>
                </template>
                <span>{{ odlFeature.localityCode }}</span>
              </v-tooltip>
              .
            </span>

            To identify deviations from the normal range of AGDR (Ambient Gamma Dose Rate), a yellow boundary is displayed around the predicted value. This boundary serves as an indicator where the AGDR exceeds the expected value, suggesting a potential anomaly. Additionally, there are red and green lines representing the upper and lower limits of the AGDR range. These lines provide an approximate range for the natural ambient dose rate. If the real AGDR surpasses or falls below these limits, it indicates an abnormal reading.

            Additionally, we can assess the model's performance by comparing the gradient of the predicted values with that of the actual values. For instance, at the given timestamps of
            <span v-for="(goodPoint, index) in odlFeature.goodPoints" :key="goodPoint">
              <span v-if="!index"></span>
              <span v-else-if="index+1 != odlFeature.goodPoints.length">, </span>
              <span v-else> and </span>
              <u>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <strong
                      class="d-inline-block"
                      v-bind="attrs"
                      v-on="on"
                      @mouseover="hoverOver(goodPoint)"
                      @mouseout="hoverOut"
                    >{{ moment(goodPoint * 1000).format("y-MM-DD HH:mm:ss") }}</strong>
                  </template>
                  <span>{{ moment(goodPoint * 1000).fromNow() }}</span>
                </v-tooltip>
              </u>
            </span>
            , depicted by the red dotted lines, it is evident that while the predicted values are rising, the actual values are moving in the opposite direction. Conversely, when we observe the green dotted lines at 
            <span v-for="(badPoint, index) in odlFeature.badPoints" :key="badPoint">
              <span v-if="!index"></span>
              <span v-else-if="index+1 != odlFeature.badPoints.length">, </span>
              <span v-else> and </span>
              <u>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <strong
                      class="d-inline-block"
                      v-bind="attrs"
                      v-on="on"
                      @mouseover="hoverOver(badPoint)"
                      @mouseout="hoverOut"
                    >{{ moment(badPoint * 1000).format("y-MM-DD HH:mm:ss") }}</strong>
                  </template>
                  <span>{{ moment(badPoint * 1000).fromNow() }}</span>
                </v-tooltip>
              </u>
            </span>
            , the model demonstrates good performance as the predicted and actual values exhibit a similar increasing pattern in their slopes.
            This observation is further supported by the presence of precipitation, indicated by the evidence of increased AGDR, thereby strengthening the hypothesis that the rise in AGDR is attributed to heightened precipitation.
          </v-card-subtitle>
          <v-card-title v-else>
            <v-row>
              <v-col cols="10" class="ma-auto">
                Does the Ambient Gamma Dose Rate (AGDR) pose a significant risk in the vicinity of Germany?
                <v-divide class="mb-5"></v-divide>
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
                      src="../assets/1.jpeg"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                    ></v-carousel-item>
                    <v-carousel-item
                      src="../assets/2.jpeg"
                      reverse-transition="fade-transition"
                      transition="fade-transition"
                    ></v-carousel-item>
                  </v-carousel>

                </v-card-text>
                
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>

        <!--
      </v-tab-item>

      
      <v-tab-item
        :key="items[1].tab"
      >

        <v-table height="200px">
          <thead>
            <tr>
              <th class="text-left">
                Timestamp
              </th>
              <th class="text-left">
                Actual
              </th>
              <th class="text-left">
                Forecasted
              </th>
              <th class="text-left">
                Absolute Percent Error
              </th>
            </tr>
          </thead>
          <tbody v-if="odlFeature && odlFeature.result">
            <tr
              v-for="item in odlFeature.result"
              :key="item.end_measure"
            >
              <td>{{ new Date(item.end_measure * 1000).toLocaleString() }}</td>
              <td>{{ (Math.round(item.odl_real * 1000) / 1000).toFixed(3) }}</td>
              <td>{{ (Math.round(item.odl_prediction * 1000) / 1000).toFixed(3) }}</td>
              <td>{{ item.absolute_percent_error.toFixed(1) }}%</td>
            </tr>
          </tbody>
        </v-table>
      

      </v-tab-item>
    
    </v-tabs-items>-->
  </v-card>

</template>

<script>

//import * as echarts from 'echarts'
import EChart ,{ THEME_KEY } from 'vue-echarts'

import { CanvasRenderer } from "echarts/renderers";
import { use } from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  MarkLineComponent
} from "echarts/components";

import line from "./data/line";
import moment from 'moment';

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  MarkLineComponent
]);

export default {
  name: 'MyChart',
  components: {
    EChart
  },
  provide: {
    [THEME_KEY]: "light"
  },
  props: {
    precipitationFeature: [],
    odlFeature: [],
    dates: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      odlOptions: { ...line},
      precipitationOptions: { ...line},
      initOptions: {
        renderer: "canvas"
      },
      tab: null,
      items: [
        { tab: 'Chart View', content: '' },
        { tab: 'List View', content: '' },
      ],
      maxRealValue: 0.18,
      minRealValue: 0.05,
      moment,
      echartInstance: null,
    }
  },
  mounted() {
    //this.fillprecipitation();
    this.fillOdl();

    this.$nextTick(() => {
      const chartInstance = this.$refs.odl.chart;
      // Use the chartInstance as needed
      this.echartInstance = chartInstance;
    });
  },
  watch: {
    precipitationFeature: {
      handler: function () {
        //this.fillprecipitation();
      },
      deep: true,
    },
    odlFeature: {
      handler: function () {
        this.fillOdl();
      },
      deep: true,
    },
  },
  methods:
  {
    fillprecipitation() {
      
      //let dataIndex = -1;
      let precipitation = this.$refs.precipitation;

      //let uniqueNuclide;

      if (!precipitation)
        return;

      // Make data for chart
      let features = this.precipitationFeature;

      if(features && features !== undefined)
      {
        ////////////////////////////////////////////////////precipitation//////////////////////////////////////////////////////
        // Erase old data from precipitation
        precipitation.option.legend.data = [];
        precipitation.option.xAxis.forEach(e => e.data = []);
        precipitation.option.series = [];
        precipitation.setOption(this.precipitationOptions, true);

        // Make new data from precipitation
        precipitation.option.title.text = features[0].properties.name + " : " + features[0].properties.id;
        precipitation.option.yAxis[0].name = features[0].properties.unit;

        /* Get uniq dates */
        var uniqueDates = features.map(e => e.properties.start_measure).filter(this.onlyUnique);

        let serieName = features[0].properties.nuclide;

        // Add Nuclids as series
        let newSerie = {
          name: serieName,
          type: 'line',
          data: features.map(e => e.properties.value),
        }

        precipitation.option.legend.data.push(serieName);
        precipitation.option.series.push(newSerie);

        // Create XAxis labels
        uniqueDates.forEach(date => {
          
          let d = new Date(date);
          let ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
          let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
          let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

          var xAxisTitle = `${da}${mo}${ye}`;

          // Add labels of xAxis
          precipitation.option.xAxis[0].data.push(xAxisTitle);
        });
      }
    },
    fillOdl() {

      //let precipitation = this.$refs.precipitation;
      let odl = this.$refs.odl;
      let odlOptions = this.odlOptions;

      if (!odl || !this.odlFeature)
        return;

      // Make data for chart
      let features = this.odlFeature.result;

      //console.log(features)

      let badPoints = this.odlFeature.badPoints;
      let goodPoints = this.odlFeature.goodPoints;
      //let localityCode = this.odlFeature.localityCode;
      let localityName = this.odlFeature.localityName;
      let meanRealValue = this.odlFeature.meanRealValue;
      let stdRealValue = this.odlFeature.stdRealValue;
      //let mape = this.odlFeature.mape;

      if(features && features.length)
      {
        ////////////////////////////////////////////////////odl//////////////////////////////////////////////////////
        // Erase old data from odl
        odl.option.legend.data = [];
        odl.option.xAxis.forEach(e => e.data = []);
        odl.option.series = [];
        odl.setOption(odlOptions, true);
        //precipitation.option.legend.data = [];
        //precipitation.option.xAxis.forEach(e => e.data = []);
        //precipitation.option.series = [];
        //precipitation.setOption(this.precipitationOptions, true);


        /* Get uniq dates */
        var uniqueDates = features.map(e => e.end_measure).filter(this.onlyUnique);

        // Make new data from odl
        odl.option.title.text = `${localityName}`;
        //odl.option.yAxis[0].name = 'Gamma-ODL-Brutto';
        //precipitation.option.title.text = features[0].Locality_code;
        //precipitation.option.yAxis[0].name = 'precipitation';

        let predictionKey = 'odl_prediction';
        let predictionTitle = 'Predicted AGDR';
        let realKey = 'odl_real';
        let realTitle = 'Real AGDR';
        let precipitationKey = 'precipitation';
        let precipitationTitle = 'Precipitation';
        //let meanRealValueTitle = 'mean line';
        //let stdUpperBoundKey = 'mae_upper_bound';
        let stdUpperBoundTitle = 'Standard deviation upper';
        //let stdLowerBoundKey = 'mae_lower_bound';
        let stdLowerBoundTitle = 'Standard deviation lower';
        let maxTitle = 'High AGDR limit';
        let minTitle = 'Low AGDR limit';

        odl.option.yAxis = [];
        odl.option.yAxis.push(
          {
            type: 'value',
            name: 'Ambient Gamma Dose Rate (AGDR)',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                //color: odlOptions.color[1]
              }
            },
            axisLabel: {
              formatter: '{value} \u00b5Sv/h'
            },
            scale:true,
            //boundaryGap: ['0', '20%']
            //min: Math.min(features.map(e => e[realKey])) * 1.25,
            //max: Math.max(features.map(e => e[realKey])) * 0.75,
        });

        odl.option.yAxis.push(
          {
            type: 'value',
            name: 'Precipitation',
            position: 'right',
            alignTicks: false,
            axisLine: {
              show: true,
              lineStyle: {
                //color: odlOptions.color[2]
              }
            },
            axisLabel: {
              formatter: '{value} mm/h'
            },
            scale:false,
            boundaryGap: ['0', '200%']
        });

        let realSerie = {
          name: realTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(e => e[realKey]),
          showSymbol: false,
          lineStyle: {
            width: 3
          },
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            lineStyle: { color: 'red'},
            data: badPoints.map(timestamp => ({ xAxis: moment(new Date(timestamp * 1000)).format("y-MM-DD HH:mm:ss") }) ),
          },
        }

        let predictionSerie = {
          name: predictionTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(e => e[predictionKey]),
          showSymbol: false,
          lineStyle: {
            width: 3
          },
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            lineStyle: { color: 'green'},
            data: goodPoints.map(timestamp => ({ xAxis: moment(new Date(timestamp * 1000)).format("y-MM-DD HH:mm:ss") }) ),
          },
        }

        let precipitationSerie = {
          name: precipitationTitle,
          type: 'bar',
          yAxisIndex: 1,
          data: features.map(e => e[precipitationKey]),
        }

        /*
        let meanRealValueSerie = {
          name: meanRealValueTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(() => meanRealValue),
          symbol: 'none',
          label: { show:false},
        }
        */

        let stdLowerBoundSerie = {
          name: stdLowerBoundTitle,
          type: 'line',
          data: features.map(() => (meanRealValue - stdRealValue).toPrecision(3) ),
          lineStyle: {
            //opacity: 0
          },
          areaStyle: {
            opacity: 0
            //color: '#f5f5f5'
          },
          //stack: 'std-band',
          symbol: 'none',
          label: { show:false},
        }

        let stdUpperBoundSerie = {
          name: stdUpperBoundTitle,
          type: 'line',
          data: features.map(() => (meanRealValue + stdRealValue).toPrecision(3)),
          lineStyle: {
            //opacity: 0
          },
          areaStyle: {
            opacity: 0
            //color: '#ccc'
          },
          //stack: 'std-band',
          symbol: 'none'
        }

        let maxSerie = {
          name: maxTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(() => this.maxRealValue),
          showSymbol: false,
        }
        let minSerie = {
          name: minTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(() => this.minRealValue),
          showSymbol: false,
        }

        odl.option.series = [
          stdUpperBoundSerie, 
          stdLowerBoundSerie, 
          //meanRealValueSerie,
          minSerie, 
          maxSerie, 
          precipitationSerie, 
          predictionSerie, 
          realSerie
        ]
        odl.option.legend.data = [
          realTitle, 
          predictionTitle, 
          precipitationTitle, 
          stdLowerBoundTitle, 
          stdUpperBoundTitle, 
          //meanRealValueTitle, 
          maxTitle, 
          minTitle
        ]

        /*
        odl.option.legend.data.push(stdLowerBoundTitle);
        odl.option.series.push(stdUpperBoundSerie);
        
        odl.option.legend.data.push(stdUpperBoundTitle);
        odl.option.series.push(stdLowerBoundSerie);
        
        odl.option.legend.data.push(realTitle);
        odl.option.series.push(realSerie);

        odl.option.legend.data.push(predictionTitle);
        odl.option.series.push(predictionSerie);

        odl.option.legend.data.push(precipitationTitle);
        odl.option.series.push(precipitationSerie);



        odl.option.legend.data.push(meanRealValueTitle);
        odl.option.series.push(meanRealValueSerie);

        odl.option.legend.data.push(maxTitle);
        odl.option.series.push(maxSerie);

        odl.option.legend.data.push(minTitle);
        odl.option.series.push(minSerie);
        */

        /*
        odl.option.dataZoom = [
          {
            type: 'slider', // Set the type of dataZoom
            start: 0,      // Set the initial start percentage
            end: 100       // Set the initial end percentage
          }
        ];
        *

        odl.option.setOption(odl.option, true);


        /*
        odl.option.series.push(minSerie);
        odl.option.series.push(maxSerie);
        odl.option.series.push(meanRealValueSerie);
        odl.option.series.push(stdLowerBoundSerie);
        odl.option.series.push(stdUpperBoundSerie);
        odl.option.series.push(precipitationSerie);
        odl.option.series.push(predictionSerie);
        odl.option.series.push(realSerie);

        odl.option.legend.data.push(realTitle);
        odl.option.legend.data.push(predictionTitle);
        odl.option.legend.data.push(precipitationTitle);
        odl.option.legend.data.push(stdUpperBoundTitle);
        odl.option.legend.data.push(stdLowerBoundTitle);
        odl.option.legend.data.push(meanRealValueTitle);
        odl.option.legend.data.push(maxTitle);
        odl.option.legend.data.push(minTitle);
        */

        //odl.option.legend.selected = {
          //predictionTitle:true
        //};

        //precipitation.option.legend.data.push(precipitationKey);
        //precipitation.option.series.push(precipitationSerie);

        // Create XAxis labels
        uniqueDates.forEach(timestamp => {

          var date = new Date(timestamp * 1000) //.substr(0, 10)

          var dateString = moment(date).format("y-MM-DD HH:mm:ss")

          //let ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
          //let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
          //let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
          //let h = new Intl.DateTimeFormat('en', { hour: '2-digit' }).format(d);

          //var xAxisTitle = `${da}${mo}${ye}`;
          //var xAxisTitle = timestamp;

          // Add labels of xAxis
          odl.option.xAxis[0].data.push(dateString);
          //odl.option.xAxis[0].axisLabel.formatter = '\u00b5Sv/h';

          //precipitation.option.xAxis[0].data.push(xAxisTitle);
          //precipitation.option.xAxis[0].axisLabel.formatter = '\u00b5Sv/h';
        });


        //odl.option.xAxis[0].data = uniqueDates

        //console.log(features.map(e => e.Start_measure), odl.option.xAxis[0])
      }
    },
    // Get uniq items
    onlyUnique: function (value, index, self) {
      return self.indexOf(value) === index;
    },
    // Get mean from input array
    getMean: function (values){
      if(values.length === 0) throw new Error("No inputs");

      const average = values.reduce((a,b) => a + b, 0) / values.length;
      return average;
    },
    hoverOver:function (timestamp){
      // Access the chart instance and trigger the hover effect on the x-axis
      //const chartContainer = this.$refs.odl;
      //const chart2 = echarts.init(chartContainer);

      const chart = this.echartInstance;

      /* Get uniq dates */
      var uniqueDates = this.odlFeature.result.map(e => e.end_measure).filter(this.onlyUnique);

      let indexOfTimestamp = uniqueDates.indexOf(timestamp)

      //setInterval(() => { 
       //indexOfTimestamp = (indexOfTimestamp + 1) % this.odlFeature.result.length 

       // 显示 tooltip 
       chart.dispatchAction({ 
         type: 'showTip', 
         seriesIndex: 0, 
         dataIndex: indexOfTimestamp 
       }) 
     //}, 1000) 


     /*
      // Trigger the hover event on the x-axis
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: [0, 1], // Series index to highlight (modify as needed)
        dataIndex: 20, // Data index to highlight (modify as needed)
        xAxisIndex: 0, // x-axis index to highlight
      })
      */
    },
    hoverOut:function (){
      //this.$refs.odl.option.tooltip = {
        //show: false
      //};
    },
  }
}
</script>

<style scoped>

  .figure {
    margin: 0;
    padding: 0;
    min-width: 100%;
    min-height: 100%;

    display: block;
    width: 582px;
    height: 60vh;
  }
</style>