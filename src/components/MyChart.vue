<template>

  <v-card style="height:85vh;"><!--
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
      >-->
        <v-card flat>
          <v-card-text>
            
            <div class="figure">
              <e-chart
                :option="odlOptions"
                :init-options="initOptions"
                ref="odl"
                autoresize
              />
            </div>
            
          </v-card-text>
        </v-card>
        <!--
      </v-tab-item>

            <div class="figure">
              <e-chart
                :option="precipitationOptions"
                :init-options="initOptions"
                ref="precipitation"
                autoresize
              />
            </div>
      <v-tab-item
        :key="items[1].tab"
      >
      -->
        <v-card flat>
          <v-card-text>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
            
          </v-card-text>
        </v-card><!--
      </v-tab-item>
    </v-tabs-items> -->
  </v-card>

 

</template>

<script>

import EChart ,{ THEME_KEY } from 'vue-echarts'

import { CanvasRenderer } from "echarts/renderers";
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent 
} from "echarts/components";

import line from "./data/line";

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent 
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
        { tab: 'ODL Real', content: '' },
        { tab: 'ODL Perediction', content: '' },
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
      deep: true
    },
    odlFeature: {
      handler: function () {
        this.fillOdl();
      },
      deep: true
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

      if (!odl)
        return;

      // Make data for chart
      let features = this.odlFeature;

      if(features && features !== undefined)
      {
        ////////////////////////////////////////////////////odl//////////////////////////////////////////////////////
        // Erase old data from odl
        odl.option.legend.data = [];
        odl.option.xAxis.forEach(e => e.data = []);
        odl.option.series = [];
        odl.setOption(this.odlOptions, true);
        //precipitation.option.legend.data = [];
        //precipitation.option.xAxis.forEach(e => e.data = []);
        //precipitation.option.series = [];
        //precipitation.setOption(this.precipitationOptions, true);

        // Make new data from odl
        odl.option.title.text = features[0].Locality_code;
        //odl.option.yAxis[0].name = 'Gamma-ODL-Brutto';
        //precipitation.option.title.text = features[0].Locality_code;
        //precipitation.option.yAxis[0].name = 'Precipiation';

        /* Get uniq dates */
        var uniqueDates = features.map(e => e.Start_measure).filter(this.onlyUnique);

        let serieName1 = 'y_ODL_prediction';
        let serieName2 = 'y_ODL_real';
        let serieName3 = 'precipitation';

        odl.option.yAxis = [];
        odl.option.yAxis.push(
          {
            type: 'value',
            name: 'Gamma-ODL-Brutto',
            position: 'left',
            axisLabel: {
              formatter: '{value} \u00b5Sv/h'
            }
        });

        odl.option.yAxis.push(
          {
            type: 'value',
            name: 'Precipiation',
            position: 'right',
            axisLabel: {
              formatter: '{value}'
            }
        });

        // Add Nuclids as series
        let newSerie1 = {
          name: serieName1,
          type: 'line',
          data: features.map(e => e[serieName1]),
        }

        let newSerie2 = {
          name: serieName2,
          type: 'line',
          data: features.map(e => e[serieName2]),
        }

        let newSerie3 = {
          name: serieName3,
          type: 'line',
          yAxisIndex: 1,
          data: features.map(e => e[serieName3]),
        }

        odl.option.legend.data.push(serieName1);
        odl.option.legend.data.push(serieName2);
        odl.option.series.push(newSerie1);
        odl.option.series.push(newSerie2);
        odl.option.legend.data.push(serieName3);
        odl.option.series.push(newSerie3);


        //precipitation.option.legend.data.push(serieName3);
        //precipitation.option.series.push(newSerie3);

        // Create XAxis labels
        uniqueDates.forEach(timestamp => {

          var d = new Date(timestamp);

          let ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(d);
          let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
          let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
          //let h = new Intl.DateTimeFormat('en', { hour: '2-digit' }).format(d);

          var xAxisTitle = `${da}${mo}${ye}`;

          // Add labels of xAxis
          odl.option.xAxis[0].data.push(xAxisTitle);
          //odl.option.xAxis[0].axisLabel.formatter = '\u00b5Sv/h';

          //precipitation.option.xAxis[0].data.push(xAxisTitle);
          //precipitation.option.xAxis[0].axisLabel.formatter = '\u00b5Sv/h';
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