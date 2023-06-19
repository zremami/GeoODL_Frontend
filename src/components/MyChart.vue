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

          <v-card-subtitle style="text-align: justify" v-if="odlFeature">
          <h2 class="my-2">Interpretation of the diagram</h2>

            <v-divider class="mb-2"></v-divider>

            <span>This is a chart showing the 
              <b :style="`color:${odlOptions.color[6]}`" @mouseover="hoverLegend(realTitle)">{{ realTitle }}</b> and 
              <b :style="`color:${odlOptions.color[5]}`" @mouseover="hoverLegend(predictionTitle)">{{ predictionTitle }}</b>
               value of Ambient Gamma Dose Rates(AGDR) and 
               Precipitation
               <b :style="`color:${odlOptions.color[4]}`" @mouseover="hoverLegend(precipitationTitle)">{{ precipitationTitle }}</b>
                in 7 days from
              <u>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <strong
                      class="d-inline-block"
                      v-bind="attrs"
                      v-on="on"
                      @mouseover="hoverOver([Math.min(...odlFeature.result.map(e => e.end_measure))])"
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
                      @mouseover="hoverOver([Math.max(...odlFeature.result.map(e => e.end_measure))])"
                    >{{ moment(Math.max(...odlFeature.result.map(e => e.end_measure)) * 1000).format("y-MM-DD HH:mm:ss") }}</strong>
                  </template>
                  <span>{{ moment(Math.max(...odlFeature.result.map(e => e.end_measure)) * 1000).fromNow() }}</span>
                </v-tooltip>
              </u>
              in
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <strong
                    class="d-inline-block text-uppercase"
                    v-bind="attrs"
                    v-on="on"
                  >{{ odlFeature.localityName }}</strong>
                </template>
                <span>{{ odlFeature.localityCode }}</span>
              </v-tooltip>
              .
            </span>
            To identify deviations from the normal range of AGDR (Ambient Gamma Dose Rate), a yellow boundary is displayed around the predicted value. This boundary serves as an indicator where the AGDR exceeds the expected value, suggesting a potential anomaly. Additionally, there are red and green lines representing the 
            upper
            <b :style="`color:${odlOptions.color[3]}`" @mouseover="hoverLegend(maxTitle)">{{ maxTitle }}</b>
             and 
            <b :style="`color:${odlOptions.color[2]}`" @mouseover="hoverLegend(minTitle)">{{ minTitle }}</b> 
             limits of the AGDR range. These lines provide an approximate range for the natural ambient dose rate. If the real AGDR surpasses or falls below these limits, it indicates an abnormal reading.
             Furthermore, we can evaluate the hypothesis regarding the relationship between increased precipitation and AGDR by comparing the gradients of the predicted values with those of the actual values.
             <span v-if="(odlFeature.falsePoints && odlFeature.falsePoints.length) || (odlFeature.truePoints && odlFeature.truePoints.length)"> For instance, </span>
            <span v-if="odlFeature.falsePoints && odlFeature.falsePoints.length">at the given timestamps of
              <span v-for="(badPoint, index) in odlFeature.falsePoints" :key="badPoint">
                <span v-if="!index"></span>
                <span v-else-if="index+1 != odlFeature.falsePoints.length">, </span>
                <span v-else> and </span>
                  <u>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <strong
                          class="d-inline-block"
                          v-bind="attrs"
                          v-on="on"
                          @mouseover="hoverOver([badPoint])"
                        >{{ moment(badPoint * 1000).format("y-MM-DD HH:mm:ss") }}</strong>
                      </template>
                      <span>{{ moment(badPoint * 1000).fromNow() }}</span>
                    </v-tooltip>
                  </u>
              </span>
            </span>
            <span v-if="odlFeature.truePoints && odlFeature.truePoints.length && odlFeature.falsePoints && odlFeature.falsePoints.length">, depicted by</span>
            <span v-if="odlFeature.truePoints && odlFeature.truePoints.length">
              the 
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <strong
                    class="d-inline-block red--text"
                    v-bind="attrs"
                    v-on="on"
                  >red dotted lines</strong>
                </template>
                <span>{{ odlFeature.falsePoints.map(gp => moment(gp * 1000).format("y-MM-DD HH:mm:ss")).join(', ') }}</span>
              </v-tooltip>
                , it is evident that while the predicted values are rising, the actual values are moving in the opposite direction indicating there might be effect of other external elemt rather than precipitation. Conversely, when we observe the 
                <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <strong
                    class="d-inline-block green--text"
                    v-bind="attrs"
                    v-on="on"
                  >green dotted lines</strong>
                </template>
                <span>{{ odlFeature.truePoints.map(gp => moment(gp * 1000).format("y-MM-DD HH:mm:ss")).join(', ') }}</span>
              </v-tooltip>
                 at 
              <span v-for="(goodPoint, index) in odlFeature.truePoints" :key="goodPoint">
                <span v-if="!index"></span>
                <span v-else-if="index+1 != odlFeature.truePoints.length">, </span>
                <span v-else> and </span>
                <u>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <strong
                        class="d-inline-block"
                        v-bind="attrs"
                        v-on="on"
                        @mouseover="hoverOver([goodPoint])"
                      >{{ moment(goodPoint * 1000).format("y-MM-DD HH:mm:ss") }}</strong>
                    </template>
                    <span>{{ moment(goodPoint * 1000).fromNow() }}</span>
                  </v-tooltip>
                </u>
              </span>
            </span>
            <span v-if="odlFeature.truePoints && odlFeature.truePoints.length">, as the predicted and actual values exhibit a similar increasing pattern in their slopes.</span>
            This observation is further supported by the presence of precipitation, indicated by the evidence of increased AGDR, thereby strengthening the hypothesis that the rise in AGDR is attributed to heightened precipitation.
          </v-card-subtitle>
          <v-card-title v-else>
            <v-row>
              <v-col cols="10" class="ma-auto">
                Is the level of Ambient Gamma Dose Rate (AGDR) dangerously elevated in Germany?
                <v-divider class="mb-5"></v-divider>
                <v-card-text>
                  <p>

                    This project involves the development of a web-based spatial decision support system designed to assist doctors and policymakers in assessing the risk level of gamma ambient dose rate in Germany. The purpose of this application, developed as a master's thesis project titled "Designing and Evaluating a Web Spatial Decision Support System for Spatial Problem Solving," is to provide a comprehensive tool for analyzing and visualizing the gamma ambient dose rate data. The system is evaluated using this application, which has been specifically commissioned by BfS (Federal Office for Radiation Protection) 
                  </p><p>
                    for this purpose. Its primary aim is to empower medical professionals and policymakers with valuable insights into the risk levels associated with gamma ambient dose rates across different regions in Germany.
                  </p><p>
                    It is worth noting that, according to a BfS report considering local conditions, the usual range for natural ambient radiation dose rate in Germany is between 0.05 and 0.18 μSv/h. Typically, external radiation exposure remains fairly constant; however, certain external factors, such as rain, can cause minor and temporary fluctuations in the local dose rate, resulting in slight increases or decreases.
                  </p><p>
                    In order to determine if the elevated AGDR levels pose a danger, one solution is to demonstrate that the increase in AGDR is attributed to precipitation and falls within a safe range. To accomplish this, we utilize advanced data mining techniques and machine learning algorithms to establish a definitive relationship between AGDR and precipitation. The outcomes reveal encouraging correlations. This application leverages these data mining discoveries as a predictive and simulation model, presented through an interactive and user-friendly platform. This empowers doctors and policymakers to make well-informed decisions by analyzing these results.
                  </p><p>
                    Upon selecting each station, target users will be presented with advanced data visualization featuring interpretations, as well as prediction and simulation tools. It should be noted that 
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

          <v-card-actions>
            <v-row
              no-gutters
              align="center"
            >
              <v-col cols="6" class="d-flex justify-start">
                <v-switch
                  v-model="negativePointActive"
                  label="red"
                  color="red"
                  value="red"
                  hide-details
                  flat
                  inset
                >
                </v-switch>
              </v-col>

            </v-row>
          </v-card-actions>
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
      // define legent titles
      predictionTitle: 'Predicted AGDR',
      realTitle: 'Real AGDR',
      precipitationTitle: 'Precipitation',
      //meanRealValueTitle: 'mean line',
      stdUpperBoundTitle: 'Standard deviation upper',
      stdLowerBoundTitle: 'Standard deviation lower',
      maxTitle: 'High AGDR limit',
      minTitle: 'Low AGDR limit',
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

      let falsePoints = this.odlFeature.falsePoints;
      let truePoints = this.odlFeature.truePoints;
      //let localityCode = this.odlFeature.localityCode;
      let localityName = this.odlFeature.localityName;
      let meanPredictValue = this.odlFeature.meanPredictValue;
      let stdPredictValue = this.odlFeature.stdPredictValue;
      //let mape = this.odlFeature.mape;

      if(features && features.length)
      {
        ////////////////////////////////////////////////////odl//////////////////////////////////////////////////////
        // Erase old data from odl
        odl.option.legend.data = [];
        odl.option.xAxis.forEach(e => e.data = []);
        odl.option.series = [];
        odl.setOption(odlOptions, true);

        /* Get uniq dates */
        var uniqueDates = features.map(e => e.end_measure).filter(this.onlyUnique);

        // Make new data from odl
        odl.option.title.text = `${localityName}`;
        //odl.option.yAxis[0].name = 'Gamma-ODL-Brutto';
        //precipitation.option.title.text = features[0].Locality_code;
        //precipitation.option.yAxis[0].name = 'precipitation';

        let predictionKey = 'odl_prediction';
        let realKey = 'odl_real';
        let precipitationKey = 'precipitation';
        //let stdUpperBoundKey = 'mae_upper_bound';
        //let stdLowerBoundKey = 'mae_lower_bound';

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
          name: this.realTitle,
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
            data: falsePoints.map(timestamp => ({ xAxis: moment(new Date(timestamp * 1000)).format("y-MM-DD HH:mm:ss") }) ),
          },
        }

        let predictionSerie = {
          name: this.predictionTitle,
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
            data: truePoints.map(timestamp => ({ xAxis: moment(new Date(timestamp * 1000)).format("y-MM-DD HH:mm:ss") }) ),
          },
        }

        let precipitationSerie = {
          name: this.precipitationTitle,
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
          name: this.stdLowerBoundTitle,
          type: 'line',
          data: features.map(() => (meanPredictValue - stdPredictValue).toPrecision(3) ),
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
          name: this.stdUpperBoundTitle,
          type: 'line',
          data: features.map(() => (meanPredictValue + stdPredictValue).toPrecision(3)),
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
          name: this.maxTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(() => this.maxRealValue),
          showSymbol: false,
        }
        let minSerie = {
          name: this.minTitle,
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
          this.realTitle, 
          this.predictionTitle, 
          this.precipitationTitle, 
          this.stdLowerBoundTitle, 
          this.stdUpperBoundTitle, 
          //this.meanRealValueTitle, 
          this.maxTitle, 
          this.minTitle
        ]

        // Create XAxis labels
        uniqueDates.forEach(timestamp => {

          var date = new Date(timestamp * 1000) //.substr(0, 10)

          var dateString = moment(date).format("y-MM-DD HH:mm:ss")

          odl.option.xAxis[0].data.push(dateString);
        });
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
    hoverOver:function (timestamps){
      // Access the chart instance and trigger the hover effect on the x-axis
      const chart = this.echartInstance;

      /* Get uniq dates */
      var uniqueDates = this.odlFeature.result.map(e => e.end_measure).filter(this.onlyUnique);

      /* Find index of hovering timestamps */
      let indexOfTimestamps = uniqueDates
        .map((ud, index) => timestamps.includes(ud) ? index : null)
        .filter(elements => elements !== null)

      indexOfTimestamps.forEach(function(index) {
        // 显示 tooltip 
        chart.dispatchAction({ 
          type: indexOfTimestamps.length > 1 ? 'showTip': 'showTip', 
          seriesIndex: 0, 
          dataIndex: index 
        }) 
      })
    },
    hoverLegend:function (legendTitle){
      // Access the chart instance and trigger the hover effect on the x-axis
      const chart = this.echartInstance;

      console.log(legendTitle)

      // 显示 legend 
      chart.dispatchAction({
          type: 'legendUnSelect',
          // legend name
          name: legendTitle
      })
       // 显示 legend 
       chart.dispatchAction({
          type: 'legendSelect',
          // legend name
          name: legendTitle
      })
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

  .animated-span {
    animation: fadeAnimation 0.5s;
  }

  @keyframes fadeAnimation {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
