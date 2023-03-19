import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router';

Vue.config.productionTip = false

new Vue({
  vuetify,
  router: VueRouter,
  render: h => h(App)
}).$mount('#app')
