<template>

  <v-card style="height:85vh;">
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
              {{ odlFeature.message }}
              <!--.replace('{0}', odlFeature.localityName).replace('{1}', odlFeature.badPoints).replace('{2}', odlFeature.goodPoints) -->
          </v-card-subtitle>
          <v-card-title class="my-8 py-9 text-h2 my-auto justify-center" style="padding-top: 40vh !important;" v-else>
              Do I have to be affraid of ODL?
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
    }
  },
  mounted() {
    //this.fillprecipitation();
    this.fillOdl();
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
      let localityCode = this.odlFeature.localityCode;
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
        odl.option.title.text = `${localityName} - ${localityCode}`;
        //odl.option.yAxis[0].name = 'Gamma-ODL-Brutto';
        //precipitation.option.title.text = features[0].Locality_code;
        //precipitation.option.yAxis[0].name = 'Precipiation';

        let predictionKey = 'odl_prediction';
        let predictionTitle = 'predicted odl';
        let realKey = 'odl_real';
        let realTitle = 'real odl';
        let precipitationKey = 'precipitation';
        let precipitationTitle = 'precipitation';
        let meanRealValueTitle = 'mean line';
        //let stdUpperBoundKey = 'mae_upper_bound';
        let stdUpperBoundTitle = 'sd upper bound';
        //let stdLowerBoundKey = 'mae_lower_bound';
        let stdLowerBoundTitle = 'sd lower bound';

        odl.option.yAxis = [];
        odl.option.yAxis.push(
          {
            type: 'value',
            name: 'Gamma-ODL-Brutto',
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
            scale:false
            //min: Math.min(features.map(e => e[realKey])) * 1.25,
            //max: Math.max(features.map(e => e[realKey])) * 0.75,
        });

        odl.option.yAxis.push(
          {
            type: 'value',
            name: 'Precipiation',
            position: 'right',
            alignTicks: false,
            axisLine: {
              show: true,
              lineStyle: {
                //color: odlOptions.color[2]
              }
            },
            axisLabel: {
              formatter: '{value}'
            },
            boundaryGap: ['0', '90%']
        });

        // Add Nuclids as series
        let newSerie1 = {
          name: predictionTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(e => e[predictionKey]),
          showSymbol: false,
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            lineStyle: { color: 'green'},
            data: goodPoints.map(time => ({ xAxis: new Date(time * 1000).toLocaleString() }) ),
          },
        }

        let newSerie2 = {
          name: realTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(e => e[realKey]),
          showSymbol: false,
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            lineStyle: { color: 'red'},
            data: badPoints.map(time => ({xAxis: new Date(time * 1000).toLocaleString() }) ),
          },
        }

        let newSerie3 = {
          name: precipitationTitle,
          type: 'bar',
          yAxisIndex: 1,
          data: features.map(e => e[precipitationKey]),
        }

        let newSerie6 = {
          name: meanRealValueTitle,
          type: 'line',
          yAxisIndex: 0,
          data: features.map(() => meanRealValue),
          symbol: 'none',
          label: { show:false},
        }

        let newSerie4 = {
          name: stdLowerBoundTitle,
          type: 'line',
          data: features.map(() => meanRealValue - stdRealValue),
          lineStyle: {
            opacity: 0
          },
          stack: 'std-band',
          symbol: 'none',
          label: { show:false},
        }

        let newSerie5 = {
          name: stdUpperBoundTitle,
          type: 'line',
          data: features.map(() => stdRealValue * 2),
          lineStyle: {
            opacity: 0
          },
          areaStyle: {
            color: '#ccc'
          },
          stack: 'std-band',
          symbol: 'none'
        }

        odl.option.legend.data.push(realTitle);
        odl.option.series.push(newSerie2);

        odl.option.legend.data.push(predictionTitle);
        odl.option.series.push(newSerie1);

        odl.option.legend.data.push(precipitationTitle);
        odl.option.series.push(newSerie3);

        odl.option.legend.data.push(stdUpperBoundTitle);
        odl.option.series.push(newSerie4);

        odl.option.legend.data.push(stdLowerBoundTitle);
        odl.option.series.push(newSerie5);

        odl.option.legend.data.push(meanRealValueTitle);
        odl.option.series.push(newSerie6);

        odl.option.legend.selected = {
          predictionTitle:true
        };

        //precipitation.option.legend.data.push(precipitationKey);
        //precipitation.option.series.push(newSerie3);

        // Create XAxis labels
        uniqueDates.forEach(timestamp => {

          var date = new Date(timestamp * 1000);

          //let ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
          //let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
          //let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
          //let h = new Intl.DateTimeFormat('en', { hour: '2-digit' }).format(d);

          //var xAxisTitle = `${da}${mo}${ye}`;
          //var xAxisTitle = timestamp;

          // Add labels of xAxis
          odl.option.xAxis[0].data.push(date.toLocaleString());
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