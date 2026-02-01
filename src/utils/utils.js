// import { notify } from "mini-notifier"

// import { nextTick } from "vue"


export const getSessionKey = (arr) => {
    let ids = arr.sort((a, b) => a - b)
    return ids.join('_')
}

// 是否在页面最底部
export const isBottom = (container) => {
  if (!container) return 
  return container.scrollTop + container.clientHeight >= container.scrollHeight
}
export const isSelf = (id) => {
  return id == getUserInfo().id
}

export const getUserInfo = () => {
  return {
    id: localStorage.getItem('id'),
    nickname: localStorage.getItem('nickname'),
    avatar: localStorage.getItem('avatar'),
  }
}

export const scrollToBottomUtil = (el, container, options) => {
  if (!el) return
  if (el.scrollIntoView) {
    el.scrollIntoView({
      behavior: options.behavior || 'smooth',
      block: options.block || 'end',
      container: options.container || 'nearest',
      inline: options.inline || 'end',
    })
  } else {
    requestAnimationFrame(() => {
      if (!container) return
      container.scrollTop = container.scrollHeight
    })
  }
}























// 如果 later 动态添加新元素，需要手动 observer.observe(newEl)
export class AddObserverFun {
  constructor(options = {}) {
    this.options = options
    this.idMap = new Map()
    this.idCount = 0
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let id = entry.target?.dataset['observer']
          // console.log('进入视口', entry.target, id);
          if (this.idMap.has(id)) {
            let callback = this.idMap.get(id)
            callback()
            this.idMap.delete(id)
            observer.unobserve(entry.target);
          }
        }
      });
    }, {
      root: this.options.root || null,        // 以浏览器视口为根
      rootMargin: this.options.rootMargin || '0px',
      threshold: this.options.threshold || 0.5,      // 当进入视口至少 50% 时触发
    })
  }
  add(el, callback) {  
    if (!el) {
      setTimeout(() => {
        console.log('延迟添加', el)
        this.add(el, callback)
      }, 200)
      return
    }
    this.idCount++
    let uniqId = `id_${this.idCount}`
    el.dataset['observer'] = uniqId
    this.idMap.set(uniqId, callback)
    this.observer.observe(el);
  }
  remove(id) {
    if (this.idMap.has(id)) {
      this.idMap.delete(id)
    }
  }
  close() {
    this.observer.disconnect()
  }
}
