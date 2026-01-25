// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import settingRoutes from './setting.js'
import tabBarsRoutes from './tabbars.js'



// 懒加载写法（推荐，优化打包体积）
// const NotFound = () => import('@/views/NotFound.vue')
const ChatRoom = () => import('@/views/ChatRoom.vue')
const TabMessage = () => import('@/views/tabBars/TabMessage.vue')


// 路由规则
const routes = [
  {
    path: '/',
    name: 'TabMessage',
    component: TabMessage,
    meta: { title: '聊天列表' } 
  },
  {
    path: '/chatRoom',
    name: 'ChatRoom',
    component: ChatRoom,
    meta: { title: '聊天页面' } 
  },
  ...settingRoutes,
  ...tabBarsRoutes,
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: TabMessage
  }
]

// 创建路由实例（Webpack 环境用 createWebHistory，无需配置 base）
const router = createRouter({
  history: createWebHistory(), // 对应 history 模式（无 # 号）
  // history: createWebHashHistory(), // 哈希模式（带 # 号，无需后端配置）
  routes
})

// 路由守卫示例：修改页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router