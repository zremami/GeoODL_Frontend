<template>

<v-expansion-panels>
  <v-expansion-panel>
      <v-expansion-panel-header v-slot="{ open }">
        <v-row no-gutters align="center">
          <v-col cols="4" class="d-flex justify-start">
            Duration
          </v-col>
          <v-col
            cols="8"
            class="text--secondary"
          >
            <v-fade-transition leave-absolute>
              <span v-if="open" key="0">When do you want to predicte? (The chart is showing 7 days)</span>
              <v-row
                v-else
                no-gutters
                key="1"
              >
                <v-col cols="12" class="d-flex justify-start">
                  <v-text-field
                    v-model="dateRangeText"
                    prepend-icon="mdi-calendar"
                    readonly
                    label="Range date"
                    hint="YYYY-MM-DD ISO format (8601)"
                    class="ma-0 pb-0"
                  ></v-text-field>
                </v-col>
                <v-col cols="0" class="d-flex justify-start">

                  <!--
                  End date: {{ datesFilter[1] || 'Not set' }}
                  -->
                </v-col>
              </v-row>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row
          justify="space-around"
          no-gutters
        >
          <v-col cols="12">
            <v-date-picker
              v-model="datesFilter"
              range
              full-width
              show-current
              show-week
              landscape
              :range-label="dateRangeText"
              :min="minDate"
              :max="maxDate"
              :allowed-dates="(val) => allowedDates(val)"
              @change="$emit('datesUpdated', datesFilter)"
            ></v-date-picker>
          </v-col>

          <v-col cols="12" sm="6">
            <!--
            <v-text-field
              v-model="datesFilter[1]"
              label="End date"
              type="date"
            ></v-text-field>
            -->
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>


    <v-expansion-panel>
      <v-expansion-panel-header v-slot="{ open }">
        <v-row no-gutters>
          <v-col cols="4">
            Precipitation Ratio
          </v-col>
          <v-col
            cols="8"
            class="text--secondary"
          >
            <v-fade-transition leave-absolute>
              <span
                v-if="open"
                key="0"
              >
                Select effection
              </span>
              <span
                v-else
                key="1"
              >
                <strong>{{ effectFilter }}</strong>
              </span>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row no-gutters>
          <v-spacer></v-spacer>
          <v-col cols="8">
            <v-select
              v-model="effectFilter"
              :items="effects"
              chips
              flat
              solo
              hint="Enhance the impact of precipitation by incorporating a multiplication factor in the regression model."
              @change="$emit('effectUpdated', effectFilter)"
            ></v-select>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>

<!--
  <v-card flat style="height:30vh;width: 100%;">

    <v-card-text>
      
      <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-date-picker
              v-model="datesFilter"
              range
              full-width
              show-current
              show-week
              landscape
              no-title
              active-picker="Date"
              flat
              min="2023-01-01"
              :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
              :allowed-dates="(val) => allowedDates(val)"
              @change="$emit('datesUpdated', datesFilter)"
            ></v-date-picker>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="dateRangeText"
              label="Date range"
              prepend-icon="mdi-calendar"
              readonly
              hint="YYYY-MM-DD ISO format"
            ></v-text-field>
          </v-col>
        </v-row>
    </v-card-text>

  </v-card>
  -->

</template>

<script>
export default {
  name: 'MyFilter',
  emits: ['datesUpdated'],
  props: {
    filter: {
      type: Object,
      require: true
    },
    dates: {
      type: Array,
      require: true,
      //default: () => ['2019-09-10', '2019-09-20']
    },
  },
  data: () => ({
    effectFilter: 1.0,
    datesFilter: [],
    minDate: "2023-01-01",
    maxDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    effects: [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0],
    }),
  computed: {
    dateRangeText () {
      return this.datesFilter.join(' ~ ')
    },
  },
  created() {
    //this.fillprecipitation();
    this.datesFilter = this.dates;
  },
  /*
  watch: {
    filter: {
      handler: function () {
        this.$emit('filterUpdated', this.filter);
      },
      deep: true,
    },
  },
  */
  methods:
  {
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

    // Get mean from input array
    allowedDates(val) {

      if(this.datesFilter.length == 1)
      {
        const date = new Date(this.datesFilter[0])

        return val === (new Date(date.setDate(date.getDate() - 7) - (new Date(this.datesFilter[0])).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
          || val === (new Date(date.setDate(date.getDate() + 14) - (new Date(this.datesFilter[0])).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
        }

        return true
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