import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Checkbox, DatePicker, LocaleProvider, Tabs, Table, Button, Select, Radio, Spin, message, Input } from 'ant-design-vue'

import moment from 'moment'
import echarts from 'echarts'

import './styles/index.less'
import './styles/ant-message.less'

require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/gauge')
require('echarts/lib/chart/line')
require('echarts/lib/component/title')
require('echarts/lib/component/markLine')
require('echarts/lib/component/legend')
require('echarts/lib/component/grid')

Vue.prototype.moment = moment
Vue.prototype.$message = message
Vue.prototype.$echarts = echarts

Vue.use(Checkbox)
Vue.use(DatePicker)
Vue.use(LocaleProvider)
Vue.use(Tabs)
Vue.use(Table)
Vue.use(Button)
Vue.use(Select)
Vue.use(Radio)
Vue.use(Spin)
Vue.use(Input)

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
