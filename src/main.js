import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'

// 引入全局css样式
import './assets/css/global.css'
// 引入图标库
import './assets/fonts/iconfont.css'

import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios 拦截器 给axios 设置Authorization 的 token 信息
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios
// 给vue注册element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
