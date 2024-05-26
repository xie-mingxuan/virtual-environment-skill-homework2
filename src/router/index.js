import Vue from 'vue'
import Router from 'vue-router'
// import live from '@/views/live'
// import playback from '@/views/playback'
import play from '@/views/play'
// const login = () => import('@/views/login')
import login from '@/views/login'
// const room = () => import('@/views/room')
import room from '@/views/room'
// const video = () => import('@/views/video')
import video from '@/views/video'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/room',
      name: 'room',
      component: room
    },
    {
      path: '/play',
      name: 'play',
      component: play
    },
    {
      path: '/video',
      name: 'video',
      component: video
    }
  ]
})
