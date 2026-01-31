
import { nextTick } from 'vue'

export const getSessionKey = (arr) => {
    let ids = arr.sort((a, b) => a - b)
    return ids.join('_')
}


export const smoothScrollTo = async (target, container = window, offset = 0) => {
  await nextTick() // 确保DOM更新，必加
  if (!target) return
  // 局部容器/全局窗口适配
  const scrollEl = container === window ? document.documentElement : container
  // 计算目标位置
  const targetTop = target.getBoundingClientRect().top - (container === window ? scrollEl.getBoundingClientRect().top : 0) + scrollEl.scrollTop - offset
  // 平滑滚动（所有浏览器支持，包括iOS）
  scrollEl.scrollTo({
    top: targetTop,
    behavior: 'smooth' // 平滑生效，iOS无兼容问题
  })
}