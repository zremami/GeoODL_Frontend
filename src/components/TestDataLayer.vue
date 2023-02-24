<script>
  export default {
    name: 'TestDataLayer',
    emits: ['TestDataResponse'],
    mounted()
    {

      let odl_7days_Url= 'http://127.0.0.1:5000/odls/{locality_code}/7-days'

      setTimeout(() => {
        this.urlEdit(staticUrl);
      }, 1000);
    },
    methods:{
      // get odl latest 7 days for selected locality_code
      getFeatures: async function(locality_code){

      let result = null;

      const regex = /{locality_code}/i;
      let getFeatureUrl = this.odl_7days_Url.replace(regex, locality_code);

      //this.loaderClass = 'loader';
      await fetch(getFeatureUrl)
        .then(response => response.json())
        .then(data => { result = JSON.stringify(data); } )

      //this.loaderClass = '';

      //this.$emit('wfsResponse', JSON.parse(this.jsondata));
      this.$emit('TestDataResponse', JSON.parse(result).features);

      //return JSON.parse(result);
      },
    }
  }
</script>
