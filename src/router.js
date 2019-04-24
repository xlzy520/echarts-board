import Vue from 'vue'
import Router from 'vue-router'
import Console from './views/Console.vue'
import Dashboard from './views/Dashboard.vue'
import TingJiCiShu from './views/TingJiCiShu.vue'
import KeSuLv from './views/KeSuLv.vue'
import YuanZhiLiYongLi from './views/YuanZhiLiYongLi.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'console',
      component: Console
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
      // component: () => import(/* webpackChunkName: "about" */ './views/Dashboard.vue')
    },
    {
      path: '/tingji',
      name: 'tingji',
      component: TingJiCiShu
    },
    {
      path: '/kesulv',
      name: 'kesulv',
      component: KeSuLv
    },
    {
      path: '/yuanzhi',
      name: 'yuanzhi',
      component: YuanZhiLiYongLi
    }
  ]
})
