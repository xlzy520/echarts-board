import Vue from 'vue'
import Router from 'vue-router'
import Console from './views/Console.vue'

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
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Dashboard.vue')
    }
  ]
})
