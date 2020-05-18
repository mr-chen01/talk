import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import("../views/Register")
  },
  {
    path: '/find',
    name: 'Find',
    component: () => import("../views/Find")
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import("../views/Index"),
    children:[
      {
        path: '/',
        name: 'Talk',
        component: () => import("../views/Talk")
      },
      {
        path: 'setmsg',
        name: 'SetMsg',
        component: () => import("../views/SetMsg")
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
