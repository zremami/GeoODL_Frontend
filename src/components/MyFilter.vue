<template>

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
    datesFilter: [],
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