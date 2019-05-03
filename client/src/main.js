import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import locale from 'element-ui/lib/locale/lang/fr'
import element from 'element-ui'
Vue.config.silent = true
Vue.use(element, { locale })

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

import VueSession from 'vue-session'
Vue.use(VueSession)

import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'
Vue.use(VueSocketio, io('http://localhost:4000'))

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')