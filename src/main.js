import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {resetHtml} from '@/assets/js/utils'

import '@/assets/css/main.css'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue();
resetHtml();  // 重置html的fontsize
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
