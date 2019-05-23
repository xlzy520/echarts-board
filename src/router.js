import Vue from 'vue'
import Router from 'vue-router'
import Console from './views/Console.vue'
import Dashboard from './views/Dashboard.vue'
import TingJiCiShu from './views/TingJiCiShu.vue'
import KeSuLv from './views/KeSuLv.vue'
import YuanZhiLiYongLv from './views/YuanZhiLiYongLv.vue'
import MenFuXiuBian from './views/MenFuXiuBian.vue'
import QianShuLv from './views/QianShuLv.vue'
import Cost from './views/Cost.vue'
import home from './views/home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/console',
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
      component: YuanZhiLiYongLv
    },
    {
      path: '/mengfu',
      name: 'mengfu',
      component: MenFuXiuBian
    } ,
    {
      path: '/qiansulv',
      name: 'qiansulv',
      component: QianShuLv
    },
    {
      path: '/cost',
      name: 'cost',
      component: Cost
    }
  ]
})
