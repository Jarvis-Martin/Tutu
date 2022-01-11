import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import 'amfe-flexible'
import VueBus from '../src/eventbus/vue-eventbus'

Vue.config.productionTip = false
Vue.use(VueBus)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')