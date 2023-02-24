<script>
  export default {
    name: 'UrlLayer',
    emits: ['stationResponse'],
    mounted()
    {

      let staticUrl = 'http://127.0.0.1:5000/stations';

      setTimeout(() => {
        this.urlEdit(staticUrl);
      }, 1000);
    },
    methods:{

    }
  }
</script>

<style scoped>
.url-container{

  width: 581px;
}

.url__input {
  width: 100%;
  height: 100%;
  resize: none;
  display: block;
}

.url-container input {
  font-size: 13px;
}
.url-container label {
  margin-top: 5px;
  font-size: 13px;
}

</style>