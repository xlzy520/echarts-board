import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Radio, DatePicker, LocaleProvider } from 'ant-design-vue'

import moment from 'moment'
import 'moment/locale/zh-cn'

import './styles/index.less'
moment.locale('zh-cn')

Vue.prototype.moment = moment

Vue.use(Radio)
Vue.use(DatePicker)
Vue.use(LocaleProvider)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
