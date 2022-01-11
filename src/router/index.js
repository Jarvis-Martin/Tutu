import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/indexs'
  },
  {
    path: '/indexs',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/home/Home.vue')
  },
  {
    path: '/nearbys',
    name: 'Nearby',
    component: () => import('../views/nearby/Nearby')
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../views/message/Message')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/profile/Profile')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/search/Search')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/register/Register')
  },
  {
    path: '/share',
    name: 'Share',
    component: () => import('../views/sharepage/SharePage')
  },
  {
    path: '/user/edit/:id',
    name: 'EditPage',
    component: () => import('../views/editpage/Edit')
  },
  {
    path: '/moment/:id',
    name: 'Moment',
    component: () => import(/* webpackChunkName: "about" */ '../views/momentpage/MomentPage')
  },
  {
    path: '/user/detail/:id',
    name: 'PublisherDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/publisherdetail/PublisherDetail')
  },

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  base: '/pictures-share/',
  // base: '/Tutu/',
  routes
})

export default router
