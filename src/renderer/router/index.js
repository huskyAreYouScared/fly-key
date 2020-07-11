import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'lanuch-platform',
      component: require('@/views/main').default
    },
    {
      path: '/flyKey',
      name: 'fly-key',
      component: require('@/views/flyKey').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
