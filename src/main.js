// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueVideoPlayer from 'vue-video-player'
import 'crypto-js'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
// import 'videojs-contrib-hls.js/src/videojs.hlsjs'
import ElementUI from 'element-ui';
import pkg from '../package.json'
import iView from 'iview'


// 安装 ElementUI（ui）
Vue.use(ElementUI)
Vue.use(iView)
Vue.config.productionTip = false
Vue.use(VueVideoPlayer)
import {api_post} from './ajax/api.js';
import {api_get} from "./ajax/api"; //引入
Vue.prototype.$api_post = api_post //挂载
Vue.prototype.$api_get = api_get //挂载


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

console.log(`${pkg.name} v${pkg.version} is running`)
