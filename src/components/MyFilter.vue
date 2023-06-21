<template>

  <v-expansion-panels class="mb-4">
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
              <span v-if="open" key="0">Please choose the desired timeframe for the prediction. (Available duration is 7 days)</span>
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
              @change="$emit('datesUpdated', datesFilter.sort())"
            ></v-date-picker>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header v-slot="{ open }">
        <v-row no-gutters>
          <v-col cols="4">
            Simulating Impact of Precipitation By Ratio
          </v-col>
          <v-col
            cols="4"
            class="text--secondary"
          >
            <v-fade-transition leave-absolute>
              <span
                v-if="open"
                key="0"
              >
                Select the Effect in the Moment
              </span>
              <span
                v-else
                key="0"
              >
                <strong>Effect at the Moment of Rain: {{ precipitation1Filter }}</strong>
              </span>
            </v-fade-transition>
          </v-col>
          <v-col
            cols="4"
            class="text--secondary"
          >
            <v-fade-transition leave-absolute>
              <span
                v-if="open"
                key="1"
              >
                Select the Effect 2 Hours Later
              </span>
              <span
                v-else
                key="1"
              >
                <strong>Effect 2 Hours Later of Rain: {{ precipitation2Filter }}</strong>
              </span>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row no-gutters>
          <v-spacer></v-spacer>
          <v-col cols="4">
            <v-select
              v-model="precipitation1Filter"
              :items="effects"
              chips
              flat
              solo
              hint="Enhance the impact of precipitation by incorporating a multiplication factor in the regression model."
              @change="$emit('effect1Updated', precipitation1Filter)"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="precipitation2Filter"
              :items="effects"
              chips
              flat
              solo
              hint="Enhance the impact of precipitation(+2H) by incorporating a multiplication factor in the regression model."
              @change="$emit('effect2Updated', precipitation2Filter)"
            ></v-select>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>

import moment from 'moment';

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
    },
  },
  data: () => ({
    moment,
    precipitation1Filter: 1.0,
    precipitation2Filter: 1.0,
    datesFilter: [],
    minDate: "2023-01-01",
    maxDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    effects: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0],
    }),
  computed: {
    dateRangeText () {
      return this.datesFilter.map(e => moment(e).format('y-MM-DD HH:mm')).join(' ~ ')
    },
  },
  created() {
    this.datesFilter = this.dates;
  },
  methods: {
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