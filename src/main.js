import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
//import { createRouter, createWebHistory } from 'vue-router'
import VueRouter from 'vue-router'
import moment from 'vue-moment'

Vue.use(moment);
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    // Define your routes here
  ],
});

Vue.config.productionTip = false

new Vue({
  vuetify,
  router: router,
  render: h => h(App)
}).$mount('#app')
