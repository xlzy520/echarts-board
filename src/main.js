import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Checkbox, DatePicker, LocaleProvider, Tabs } from 'ant-design-vue'

import moment from 'moment'

import './styles/index.less'

Vue.prototype.moment = moment

Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(LocaleProvider)
Vue.use(Tabs)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
