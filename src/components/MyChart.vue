<template>

  <div>
    <v-card class="mb-4" v-if="odlFeature && odlFeature.result">
      <v-toolbar
      flat
      >
        <v-spacer>Toolbox</v-spacer>
          <v-card-actions class="w-auto">

            <v-switch
              v-if="odlFeature && odlFeature.falsePoints && odlFeature.falsePoints.length"
              v-model="negativePointsActive"
              label="Negative Real AGDR Slop"
              color="red"
              hide-details
              flat
              class="me-4"
              @change="(value) => toggelMarkline(value, 'red')"
            >
            </v-switch>
            <v-switch
              v-if="odlFeature && odlFeature.truePoints && odlFeature.truePoints.length"
              v-model="posetivePointsActive"
              label="Posetive Real AGDR Slop"
              color="green"
              hide-details
              flat
              class="me-2"
              @change="(value) => toggelMarkline(value, 'green')"
            >
            </v-switch>

          </v-card-actions>
        <v-btn icon @click="generateReport">
          <v-icon>mdi-printer</v-icon>
        </v-btn>

        <v-app-bar-nav-icon v-if="odlFeature && odlFeature.result" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-toolbar>

    </v-card>


    <vue-html2pdf
      :show-layout="true"
      :float-layout="false"
      :enable-download="false"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      :filename="`${odlFeature ? odlFeature.localityName : null} ${ odlFeature && odlFeature.result ? moment(Math.min(...odlFeature.result.map(e => e.end_measure)) * 1000).format('y-MM-DD HH:mm') : 'started'}-${odlFeature && odlFeature.result ? moment(Math.max(...odlFeature.result.map(e => e.end_measure)) * 1000).format('y-MM-DD HH:mm') : 'ended'}`"
      :pdf-quality="2"
      :manual-pagination="true"
      pdf-format="a3"
      pdf-orientation="portrait"
      pdf-content-width="auto"
      ref="html2Pdf"
    >
      <section slot="pdf-content" style="display:block" class="d-block">
          <v-card>
            <v-card flat>
              <v-card-text :style="`display:${odlFeature && odlFeature.result ? 'block' : 'none'}`">
                <div class="figure">
                  <e-chart
                    :option="odlOptions"
                    :init-options="initOptions"
                    ref="odl"
                    autoresize
                  />
                </div>
              </v-card-text>

              <v-card-subtitle style="text-align: justify" v-if="odlFeature && odlFeature.result">
                <h2 class="my-2">Interpretation of the diagram</h2>

                <v-divider class="mb-2"></v-divider>

                <p>
                  This is a chart showing the 
                  <b :style="`color:${odlOptions.color[6]}`" @mouseover="hoverLegend(realTitle)">{{ realTitle }}</b>, 
                  <b :style="`color:${odlOptions.color[5]}`" @mouseover="hoverLegend(predictionTitle)">{{ predictionTitle }}</b>
                  and 
                  <b :style="`color:${odlOptions.color[4]}`" @mouseover="hoverLegend(precipitationTitle)">{{ precipitationTitle }}</b>
                    in 7 days from
                  <u>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <strong
                          class="d-inline-block"
                          v-bind="attrs"
                          v-on="on"
                          @mouseover="hoverTimestamp(odlFeature && odlFeature.result ? [Math.min(...odlFeature.result.map(e => e.end_measure))] : [])"
                        >{{ moment(Math.min(...odlFeature.result.map(e => e.end_measure)) * 1000).format("y-MM-DD HH:mm") }}</strong>
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
                          @mouseover="hoverTimestamp([Math.max(...odlFeature.result.map(e => e.end_measure))])"
                        >{{ moment(Math.max(...odlFeature.result.map(e => e.end_measure)) * 1000).format("y-MM-DD HH:mm") }}</strong>
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
                  </v-tooltip>.
                </p>
                <p>
                  In order to detect deviations of the {{ realTitle }} caused by rainfall, a yellow boundary
                  (<b :style="`color:${odlOptions.color[1]}`" @mouseover="hoverLegend(stdLowerBoundTitle)">{{ stdLowerBoundTitle }}</b>
                    -
                    <b :style="`color:${odlOptions.color[0]}`" @mouseover="hoverLegend(stdUpperBoundTitle)">{{ stdUpperBoundTitle }}</b>)
                  is presented around the {{ predictionTitle }}. This boundary acts as an indicator when the {{ realTitle }} surpasses the anticipated value, indicating the potential impact of external factors.
                </p>
                <p>Additionally, there are red and green lines representing the 
                  <b :style="`color:${odlOptions.color[3]}`" @mouseover="hoverLegend(maxTitle)">{{ maxTitle }}</b>
                  and 
                  <b :style="`color:${odlOptions.color[2]}`" @mouseover="hoverLegend(minTitle)">{{ minTitle }}</b> 
                  of the AGDR range. These lines provide an approximate range for the natural AGDR. If the AGDR surpasses or falls below these limits, it indicates an abnormal reading.
                </p>
                <p v-if="(odlFeature.truePoints && odlFeature.truePoints.length) || (odlFeature.falsePoints && odlFeature.falsePoints.length)">
                  Furthermore, we can evaluate the hypothesis regarding the relationship between increased precipitation and {{ predictionTitle }} with {{ realTitle }}.
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
                                class="d-inline-block red--text"
                                v-bind="attrs"
                                v-on="on"
                                @mouseover="hoverTimestamp([badPoint])"
                              >{{ moment(badPoint * 1000).format("y-MM-DD HH:mm") }}</strong>
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
                      <span>{{ odlFeature.falsePoints.map(gp => moment(gp * 1000).format("y-MM-DD HH:mm")).join(', ') }}</span>
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
                      <span>{{ odlFeature.truePoints.map(gp => moment(gp * 1000).format("y-MM-DD HH:mm")).join(', ') }}</span>
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
                              class="d-inline-block green--text"
                              v-bind="attrs"
                              v-on="on"
                              @mouseover="hoverTimestamp([goodPoint])"
                            >{{ moment(goodPoint * 1000).format("y-MM-DD HH:mm") }}</strong>
                          </template>
                          <span>{{ moment(goodPoint * 1000).fromNow() }}</span>
                        </v-tooltip>
                      </u>
                    </span>
                  </span>
                  <span v-if="odlFeature.truePoints && odlFeature.truePoints.length">, it is shown the predicted and actual values exhibit a similar increasing pattern in their slopes, Strengthening the hypothesis that the rise in {{ realTitle }} is attributed to heightened precipitation.</span>
                </p>
              </v-card-subtitle>

              <v-card-text v-else>
                <v-row>
                  <v-col cols="12" class="ma-auto">
                    <v-card-title>Is the level of Ambient Gamma Dose Rate (AGDR) dangerously elevated in Germany?</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <p>
                        This project involves the development of a web-based spatial decision support system designed to assist doctors and policymakers in assessing the risk level of Ambient Gamma Dose Rate (AGDR) in Germany. The purpose of this application, developed as a master's thesis project titled "Designing and Evaluating a Web Spatial Decision Support System for Spatial Problem Solving," provides a comprehensive tool for analyzing and visualizing gamma ambient dose rate data. The system is evaluated using this application, which has been specifically commissioned by the Bundesamt für Strahlenschutz (BfS).
                      </p><p>
                        In order to assess the potential risk posed by elevated AGDR levels, one approach is to demonstrate that the increase in AGDR is caused by external factors and remains within a safe range. According to a report from BfS, under natural circumstances, AGDR can experience a temporary increase of up to twice its normal level when radioactive decay products of radon are washed out of the atmosphere by precipitation and subsequently deposited on the ground.
                      </p><p>
                        The objective of this project is to provide medical professionals and policymakers with valuable insights regarding AGDR risk levels. This is accomplished by employing advanced data mining techniques to establish a definitive relationship between AGDR and precipitation.
                      </p><p>
                        AGDR data was collected by BfS measurement stations. Collaboratively with Germany's National Meteorological Service, precipitation data has been obtained from weather radar technology provided by BfS. Both datasets are time series. We have assessed the relationship between AGDP and precipitation, as well as precipitation occurring two hours prior (considering the time series nature of the data and the possibility of a 2-hour delay on AGDR) and seasonal effects. The findings demonstrate promising correlations. Utilizing these data mining discoveries, an interactive and user-friendly platform has been developed. This platform empowers doctors and policymakers to make well-informed decisions by examining these results.
                      </p><p>
                        Once a station is chosen, the intended users will have access to sophisticated data visualizations that include interpretations, prediction capabilities, and simulation tools. With respect to the prediction and simulation tools, users can select their desired time of year to view the prediction model. Furthermore, there are two dropdown menus available that enable users to simulate rainfall impact by adjusting a multiplier ranging from 0 to 2. Additionally, using the same tool and format, users can examine the effects of precipitation occurring two hours prior.
                      </p>

                      <v-carousel
                        cycle
                        height="500"
                        show-arrows-on-hover
                        progress
                        :dark="true"
                        class="mt-4">
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

                        <v-carousel-item
                          src="../assets/7.jpg"
                          reverse-transition="fade-transition"
                          transition="fade-transition"
                        ></v-carousel-item>
                      </v-carousel>

                    </v-card-text>
                    
                  </v-col>
                </v-row>
              </v-card-text>

              <v-navigation-drawer
      v-if="odlFeature && odlFeature.result"
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-toolbar
        flat
        >
        <v-toolbar-title>Statistic Information</v-toolbar-title>
      </v-toolbar>
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-primary--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title>{{ realTitle }} Mean: {{ getMean(odlFeature.result.map(e => e[realKey])).toPrecision(3) }} {{ agdrUnit }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>{{ predictionTitle }} Mean: {{ getMean(odlFeature.result.map(e => e[predictionKey])).toPrecision(3) }} {{ agdrUnit }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>{{ precipitationTitle }} Mean: {{ getMean(odlFeature.result.map(e => e[precipitationKey])).toPrecision(3) }} {{ precipitationUnit }}</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

            </v-card>


          </v-card>



        <!-- PDF Content Here -->
      </section>
    </vue-html2pdf>

  </div>

</template>

<script>

import VueHtml2pdf from 'vue-html2pdf'
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
    EChart,
    VueHtml2pdf
  },
  provide: {
    [THEME_KEY]: "light"
  },
  props: {
    odlFeature: [],
    dates: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      odlOptions: { ...line},
      initOptions: {
        renderer: "canvas"
      },
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
      predictionKey: 'odl_prediction',
      realKey: 'odl_real',
      precipitationKey: 'precipitation',
      //stdUpperBoundKey: 'mae_upper_bound'
      //stdLowerBoundKey: 'mae_lower_bound'
      agdrUnit: '\u00b5Sv/h',
      precipitationUnit: 'mm/h',
      negativePointsActive: true,
      posetivePointsActive: true,
      posetiveMarklines: null, 
      negativeMarklines: null,
      drawer: false,
      group: null,
    }
  },
  watch: {
    odlFeature: {
      handler: function () {
        this.fillOdl();
      },
      deep: false,
    },
    group () {
      this.drawer = false
    },
  },
  methods:
  {
    generateReport () {
      this.$refs.html2Pdf.generatePdf()
    },
    fillOdl() {
      const chartInstance = this.$refs.odl.chart

      // Use the chartInstance as needed
      this.echartInstance = chartInstance

      let odl = this.$refs.odl
      let odlOptions = this.odlOptions

      if (!odl || !this.odlFeature)
        return;

      // Make data for chart
      let features = this.odlFeature.result

      //console.log(features)

      let falsePoints = this.odlFeature.falsePoints
      let truePoints = this.odlFeature.truePoints
      //let localityCode = this.odlFeature.localityCode;
      let localityName = this.odlFeature.localityName
      let meanPredictValue = this.odlFeature.meanPredictValue
      let stdPredictValue = this.odlFeature.stdPredictValue
      //let mape = this.odlFeature.mape;

      if(features && features.length)
      {
        // Erase old data from odl
        odl.option.legend.data = []
        odl.option.xAxis.forEach(e => e.data = [])
        odl.option.series = []
        odl.setOption(odlOptions, true)

        /* Get uniq dates */
        var uniqueDates = features.map(e => e.end_measure).filter(this.onlyUnique)

        // Make new data from odl
        odl.option.title.text = `${localityName}`
        //odl.option.yAxis[0].name = 'Gamma-ODL-Brutto';
        //precipitation.option.title.text = features[0].Locality_code;
        //precipitation.option.yAxis[0].name = 'precipitation';

        this.posetiveMarklines = {
            name: 'green',
            symbol: ['none', 'none'],
            label: { show: false },
            lineStyle: { color: 'green'},
            data: truePoints.map(timestamp => ({ xAxis: moment(new Date(timestamp * 1000)).format("y-MM-DD HH:mm") }) ),
          }

        this.negativeMarklines = {
            name: 'red',
            symbol: ['none', 'none'],
            label: { show: false },
            lineStyle: { color: 'red'},
            data: falsePoints.map(timestamp => ({ xAxis: moment(new Date(timestamp * 1000)).format("y-MM-DD HH:mm") }) ),
          }

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
              formatter: `'{value} ${this.agdrUnit}'`
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
              formatter: `'{value} ${this.precipitationUnit}'`
            },
            scale:false,
            boundaryGap: ['0', '200%']
        });

        let realSerie = {
          name: this.realTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(e => e[this.realKey]),
          showSymbol: false,
          lineStyle: {
            width: 3
          },
          markLine: {...this.negativeMarklines} , //red dotted lines
        }

        let predictionSerie = {
          name: this.predictionTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(e => e[this.predictionKey]),
          showSymbol: false,
          lineStyle: {
            width: 3
          },
          markLine: {...this.posetiveMarklines}, //green dotted lines
        }

        let precipitationSerie = {
          name: this.precipitationTitle,
          type: 'bar',
          yAxisIndex: 1,
          data: features.map(e => e[this.precipitationKey]),
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
          //lineStyle: {
            //opacity: 0
          //},
          //areaStyle: {
            //opacity: 0
            //color: '#f5f5f5'
          //},
          //stack: 'std-band',
          symbol: 'pin',
          //label: { show:false},
          showSymbol: false,
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
          symbol: 'pin',
          showSymbol: false,
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

          var dateString = moment(date).format("y-MM-DD HH:mm")

          odl.option.xAxis[0].data.push(dateString);
        });
      }

      this.negativePointsActive = true
      this.posetivePointsActive = true
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
    // Writing Code to Trigger Serie's xAxis Items Of Component Action Manually
    hoverTimestamp:function (timestamps){
      // Access the chart instance and trigger the hover effect on the x-axis
      const chart = this.echartInstance;

      /* Get uniq dates */
      var uniqueDates = this.odlFeature && this.odlFeature.result ? this.odlFeature.result.map(e => e.end_measure).filter(this.onlyUnique) : [];

      /* Find index of hovering timestamps */
      let indexOfTimestamps = uniqueDates
        .map((ud, index) => timestamps.includes(ud) ? index : null)
        .filter(elements => elements !== null)

      indexOfTimestamps.forEach(function(index) {
        // do downplay 
        chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: index
        })
        // show highlight 
        chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: index
        })
        // show tooltip 
        chart.dispatchAction({ 
          type: 'showTip', 
          seriesIndex: 0, 
          dataIndex: index 
        })
      })
    },
    // Writing Code to Trigger Legend Of Component Action Manually
    hoverLegend:function (legendTitle){
      // Access the chart instance and trigger the legend select/unselect effect
      const chart = this.echartInstance;

      // Unselect legend 
      chart.dispatchAction({
          type: 'legendUnSelect',
          // legend name
          name: legendTitle
      })
       // Select legend 
       chart.dispatchAction({
          type: 'legendSelect',
          // legend name
          name: legendTitle
      })
    },
    // Writing Code to Add/Remove Marklines On The Series (Real (red)/Predicted AGDR (green)) Manually
    toggelMarkline:function (value, marklineName){
      // Access the chart instance and add/remove mark line items on the x-axis
      let odl = this.$refs.odl
      
      // Find the appropriate markline information by utilizing the given parameters, which include a value (true/false to indicate visibility) and the marklineName (the name of the marklines, either red or green).
      let serieName = ''
      if(marklineName == 'red')
        serieName = this.realTitle
      else
        serieName = this.predictionTitle

      let data = []
      if(value)
      {
        if(serieName == this.realTitle)
          data = [...this.negativeMarklines.data]
        else
          data = [...this.posetiveMarklines.data]
      }

      // Update new makline data items
      odl.option.series.find(e => e.name === serieName).markLine.data = data
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
    width: 100%;
    height: 60vh;
  }
</style>
