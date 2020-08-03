import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { errorHandler } from '@/utils'
import vuelidate from '@/plugins/vuelidate'
import vuetify from '@/plugins/vuetify'
import '@/plugins/moment' // Essa é outra forma de importar o plugin. Perca que nem precisa instanciar junto ao Vue
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false
Vue.config.errorHandler = errorHandler

new Vue({
  router,
  store,
  vuelidate,
  vuetify,
  render: h => h(App)
}).$mount('#app')
