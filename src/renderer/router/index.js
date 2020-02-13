import Vue from 'vue'
import Router from 'vue-router'

import ProList from '../components/ProList'
import AddPro from '../components/AddPro'
import Log from '../components/Log'
import About from '../components/About'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'proList',
      component: ProList
    },
    {
      path: '/addpro',
      name: 'addpro',
      component: AddPro
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
