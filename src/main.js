import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Checkbox, DatePicker, LocaleProvider, Tabs, Table, Button, Select, Radio, Spin, message } from 'ant-design-vue'

import moment from 'moment'

import './styles/index.less'
import './styles/ant-message.less'

Vue.prototype.moment = moment
Vue.prototype.$message = message

Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(LocaleProvider)
Vue.use(Tabs)
Vue.use(Table)
Vue.use(Button)
Vue.use(Select)
Vue.use(Radio)
Vue.use(Spin)

message.config({
  top: `80px`,
  duration: 1.5,
  maxCount: 3
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
