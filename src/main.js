import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  resetHtml
} from '@/assets/js/utils'

import VueLazyload from 'vue-lazyload'
import FastClick from 'fastclick'

import '@/assets/css/main.css'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('@/assets/img/default.jpg'),
  attempt: 1
})

FastClick.attach(document.body);

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue();
resetHtml(); // 重置html的fontsize
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
