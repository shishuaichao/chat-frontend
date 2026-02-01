// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import settingRoutes from './setting.js'
import tabBarsRoutes from './tabbars.js'

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



// 🌟 核心1：扩展router，存储【页面-path → 主动push的来源路由】映射表
// 键：目标页面的fullPath，值：触发push的来源路由对象（from）
router.prePage = null
// 🌟 核心2：标记是否为【主动push】跳转（默认false，back/直接访问为false）
router.isPushJump = false

// 🌟 核心3：重写router.push，添加【主动push】标记
const originalPush = router.push
router.push = function push(location, onComplete, onAbort) {
  // 主动调用push时，标记为true
  this.isPushJump = true
  return originalPush.call(this, location, onComplete, onAbort)
}

// 🌟 核心4：全局前置守卫，处理来源路由存储
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (router.isPushJump) {
    // 情况1：主动push跳转（A push到B）
    // 存储：B的fullPath → 来源路由A（from）
    router.prePage = from.name
    // 重置标记，避免影响后续跳转
    router.isPushJump = false
  }
  // 情况2：back回退/浏览器后退（A back到B）→ 不修改映射表，直接放行
  next()
})

export default router