

import{notify} from 'mini-notifier'

// ********** 核心方法：键盘弹起时的精准适配（零间隙关键） **********
function handleKeyboardShow() {
  if (isKeyboardShow) return; // 防止重复触发
  isKeyboardShow = true;

  // 延迟100ms：等待键盘完全弹起，保证视口高度计算精准（Safari键盘弹起有延迟）
  setTimeout(() => {
    // 1. 计算真实键盘高度 = 原始视口高度 - 键盘弹起后的视口高度
    const currentViewHeight = window.innerHeight;
    const keyboardHeight = originalViewHeight - currentViewHeight;
    notify(`键盘高度${keyboardHeight}`)
    notify(`视口高度高度${currentViewHeight}`)
    if (keyboardHeight <= 0) return; // 过滤非键盘触发的视口变化

    // 2. 动态调整页面容器底部边距 = 键盘高度，让输入框紧贴键盘（零间隙核心！）
    pageWrapper.style.paddingBottom = `${keyboardHeight}px`;
    // const app = document.querySelector('#app')
    // app.style.paddingBottom = `${keyboardHeight}px`;
    // document.documentElement.style.setProperty('--vh', `${currentViewHeight}px`);
    inputBar.style.position = 'static'

    // 3. 强制视口归位：禁止浏览器自动上移页面，输入框始终在可视区底部
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }, 100);
}

// ********** 核心方法：键盘收起时的恢复 **********
function handleKeyboardHide() {
  if (!isKeyboardShow) return;
  isKeyboardShow = false;

  // 1. 恢复页面容器样式，移除底部边距
//   pageWrapper.style.paddingBottom = '0px';
  // 2. 恢复原始视口高度（适配窗口大小变化）
  originalViewHeight = window.innerHeight;
  // 3. 强制视口归位
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
}


document.addEventListener('click', (e) => {
  if (e.target !== input && !inputBar.contains(e.target)) {
    input.blur(); // 主动失焦
    handleKeyboardHide();
  }
});
// 4. 屏蔽所有触摸/滚动的默认行为，杜绝外层滚动（终极保险）
document.addEventListener('touchmove', (e) => {
  if (isKeyboardShow) {
    console.log(e)
    // e.preventDefault();
    // e.stopPropagation();
  }
}, { passive: false }); // passive: false 必须加，否则preventDefault失效！




let pageWrapper = null;
let inputBar = null;
let input = null;
let originalViewHeight = 0;  // 初始化视口高度（键盘收起时的原始高度）
let isKeyboardShow = false; // 标记键盘是否弹起
const init = (containerEl, inputBarEl, inputEl) => {
    originalViewHeight = window.innerHeight
    pageWrapper = containerEl
    inputBar = inputBarEl
    input = inputEl
    console.log('xxxxx', pageWrapper, inputBar, inputEl)
    input.addEventListener('focus', handleKeyboardShow);
    input.addEventListener('blur', handleKeyboardHide);
}

export default init