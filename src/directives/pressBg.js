// src/directives/pressBg.js
/**
 * Vue3 按压背景色指令 v-press-bg
 * 新增：路由切换前自动重置所有按压样式，解决页面返回样式残留问题
 * 用法：v-press-bg / v-press-bg="{ bg: '#e6f7ff', scale: 0.99 }"
 */
// 全局缓存：存储所有绑定指令的元素及原始样式 { el: 元素, originStyle: 原始样式 }
let pressBgElements = null
// 标记是否已注册路由监听，避免重复注册
let isRouterListened = false;
import router from '@/router';
// import { notify } from "mini-notifier"

export default {
  mounted(el, binding) {
    // 1. 默认配置 + 合并用户传参
    const defaultOptions = {
      bg: '#f0f0f0',
      borderColor: '#dcdfe6',
      scale: 0.99,
      transition: 'all 0.1s ease'
    };
    const options = { ...defaultOptions, ...(binding.value || {}) };

    // 2. 设置基础过渡样式 + 记录元素原始样式（核心：保留最初样式）
    if (!el.style.transition) el.style.transition = options.transition;
    const originStyle = {
      background: el.style.background || '',
      borderColor: el.style.borderColor || '',
      transform: el.style.transform || '',
      boxShadow: el.style.boxShadow || ''
    };
    // 把元素和原始样式存入全局缓存
    pressBgElements = el
    el.originStyle = originStyle

    // 3. 按压样式添加
    const pressDown = () => {
      el.style.background = options.bg;
      el.style.borderColor = options.borderColor;
      el.style.transform = `scale(${options.scale})`;
      el.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.05)';
    };

    // 4. 样式恢复（抽离为独立函数，方便路由切换时调用）
    const pressUp = () => {
      el.style.background = originStyle.background;
      el.style.borderColor = originStyle.borderColor;
      el.style.transform = originStyle.transform;
      el.style.boxShadow = originStyle.boxShadow;
    };

    // 5. 绑定PC+移动端事件
    el.addEventListener('mousedown', pressDown);
    el.addEventListener('mouseup', pressUp);
    el.addEventListener('mouseleave', pressUp);
    el.addEventListener('touchstart', pressDown);
    el.addEventListener('touchend', pressUp);
    el.addEventListener('touchcancel', pressUp);
    el.addEventListener('touchmove', pressUp);

    // 6. 缓存事件和恢复函数，方便解绑
    el.__pressBgEvents__ = { pressDown, pressUp };

    // 7. 注册路由切换监听（仅注册一次，全局生效）
    if (!isRouterListened) {
      registerRouterListener();
      isRouterListened = true;
    }
  },

  // 元素解绑时：移除事件 + 从全局缓存删除 + 恢复样式
  unmounted(el) {
    const { pressDown, pressUp } = el.__pressBgEvents__ || {};
    if (pressDown && pressUp) {
      el.removeEventListener('mousedown', pressDown);
      el.removeEventListener('mouseup', pressUp);
      el.removeEventListener('mouseleave', pressUp);
      el.removeEventListener('touchstart', pressDown);
      el.removeEventListener('touchend', pressUp);
      el.removeEventListener('touchcancel', pressUp);
      el.removeEventListener('touchmove', pressUp);
    }
    // 从全局缓存中删除并恢复样式
    // pressBgElements.forEach(item => {
    //   if (item.el === el) {
    //     item.originStyle && pressUp.call(el);
    //     pressBgElements.delete(item);
    //   }
    // });
    // pressBgElements = null
    delete el.__pressBgEvents__;
  }
};

/**
 * 注册路由跳转前监听：强制重置所有按压元素的样式
 * @param {VNode} vnode - 指令绑定的虚拟节点，用于获取路由实例
 */
function registerRouterListener() {
  try {
    // 方式1：从vnode上下文获取路由实例（Vue3 setup 全局注册路由时可用）
    // const router = vnode.appContext.config.globalProperties.$router;
    if (router) {
      // 路由**开始跳转前**执行：重置所有样式（核心钩子）
      router.beforeEach((to, from, next) => {
        resetAllPressBgStyles();
        next(); // 必须调用next，否则路由会卡住
      });
      return;
    }

    // 方式2：兼容手动导入路由实例（如果方式1获取失败，用这种）
    // 注意：需把你的路由文件路径替换为实际路径（如src/router/index.js）
    // const { default: router } = require('@/router');
    // if (router) {
    //   router.beforeEach((to, from, next) => {
    //     resetAllPressBgStyles();
    //     next();
    //   });
    //   return;
    // }

  } catch (e) {
    console.warn('v-press-bg：未检测到Vue路由实例，路由切换样式重置功能失效（单个组件使用不受影响）', e);
  }
}

/**
 * 全局重置函数：遍历所有缓存元素，强制恢复原始样式
 */
function resetAllPressBgStyles() {
  let el = pressBgElements
  el.style.background = el.originStyle.background;
  el.style.borderColor = el.originStyle.borderColor;
  el.style.transform = el.originStyle.transform;
  el.style.boxShadow = el.originStyle.boxShadow;
}