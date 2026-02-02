// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import settingRoutes from './setting.js'
import tabBarsRoutes from './tabbars.js'
import store from '@/store/index.js'

// 懒加载写法（推荐，优化打包体积）
const NotFound = () => import('@/views/NotFound.vue')
const ChatRoom = () => import('@/views/ChatRoom.vue')
const otherUserInfo = () => import('@/views/OtherUserInfo.vue')
const TestPage = () => import('@/views/testPage.vue')

// 路由规则
const routes = [
  {
    path: '/',
    redirect: '/message'
  },
  {
    path: '/chatRoom',
    name: 'ChatRoom',
    component: ChatRoom,
    meta: { title: '聊天页面' } 
  },
  {
    path: '/otherUserInfo',
    name: 'OtherUserInfo',
    component: otherUserInfo,
    meta: { title: '其他用户信息' } 
  },
  ...settingRoutes,
  ...tabBarsRoutes,
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
  // 空路径占位符
  // { path: '/__empty', component: { render: h => h('div', '') } },
  {
    path: '/testPage',
    name: 'TestPage',
    component: TestPage,
    meta: { title: '测试页面' } 
  },
]

// 创建路由实例（Webpack 环境用 createWebHistory，无需配置 base）
const router = createRouter({
  history: createWebHistory(), // 对应 history 模式（无 # 号）
  // history: createWebHashHistory(), // 哈希模式（带 # 号，无需后端配置）
  routes
})


// 🌟 核心4：全局前置守卫，处理来源路由存储
router.beforeEach((to, from, next) => {
  store.commit('setPrePageInfo', from)
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 使用两步法清空历史
  if (to.meta.clearHistory) {
    // router.replace(to.fullPath);
    console.log('clearHistory发', from.fullPath)
    console.log('clearHistory', to.fullPath)
    // router.replace('/__empty').then(() => {
    //   router.replace(to.fullPath);
    // });
  } else {
    next();
  }
  next()
})

export default router