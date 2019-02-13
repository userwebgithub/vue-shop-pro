import Vue from 'vue'
import Router from 'vue-router'

// 登录组件
import Login from '@/components/Login.vue'

// 后台首页
import Home from '@/components/Home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})
