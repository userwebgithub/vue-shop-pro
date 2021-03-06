import Vue from 'vue'
import Router from 'vue-router'

// 登录组件
import Login from '@/components/Login.vue'

// 后台首页
import Home from '@/components/Home.vue'

import Welcome from '@/components/Welcome.vue'

// 用户管理页面
import User from '@/components/User.vue'

// 权限管理角色列表页面
import Roles from '@/components/Roles.vue'

// 权限管理权限列表页面
import Rights from '@/components/Rights.vue'

// 商品列表页
import Goods from '@/components/Goods.vue'

// 商品分类页
import Cat from '@/components/Cat.vue'

// 分类参数
import Param from '@/components/Param.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        {
          path: '/users',
          component: User
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/categories',
          component: Cat
        },
        { path: '/params',
        component: Param

        }
      ]
    }
  ]
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
