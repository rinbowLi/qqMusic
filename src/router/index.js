import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/list/:id',
    name: 'SongList',
    component: () => import('../views/songList/SongList')
  },
  {
    path: '/mv/:id',
    name: 'MvList',
    component: () => import('../views/mv/Mv')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search/Search')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
