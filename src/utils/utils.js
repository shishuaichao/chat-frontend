// import { notify } from "mini-notifier"

// import { nextTick } from "vue"
import { v4 as uuidv4 } from 'uuid'


export const getSessionKey = (arr) => {
    let ids = arr.sort((a, b) => a - b)
    return ids.join('_')
}

// 是否在页面最底部
export const isBottom = (container, offsetNum = 0) => {
  if (!container) return 
  return container.scrollTop + container.clientHeight + offsetNum >= container.scrollHeight
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
      behavior: options.isImediate ? 'instant' : 'smooth',
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

// 创建指定数量的群聊
export const createConvByCount = (count, callback) => {
  for (let i = 1; i <= count; i++) {
    let id = uuidv4().substring(0, 8)
    let avatarList = []
    for (let j = 1; j <= i; j++) {
      avatarList.push( Math.floor(Math.random() * 200) + 1)
    }
    let params = {
      name: id,
      avatar: avatarList.join(','),
      type: 2,
      memberIds: [getUserInfo().id],
      convName: id,
      friendId: 17
    }
    callback(params)
  }
}


// 创建指定数量的用户
// export const createUserByCount = (count, callback) => {
//   for (let i = 1; i <= count; i++) {
//     let id = uuidv4().substring(0, 8)
//     for (let j = 1; j <= i; j++) {
//       avatarList.push( Math.floor(Math.random() * 200) + 1)
//     }
//     let params = {
//       id: id,
//       nickname: id,
//       username: avatarList.join(','),
//     }
//     callback(params)
//   }
// }


















// 如果 later 动态添加新元素，需要手动 observer.observe(newEl)
export class AddObserverFun {
  constructor(options = {}) {
    this.options = options
    this.idMap = new Map()
    this.idCount = 0
    this.timer = null
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
    console.log('添加元素监听', el)
    if (!el) {
      console.error('添加元素监听失败，元素不存在')
      return
    }
    console.log('验证通过，添加元素监听', el)
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
    clearTimeout(this.timer)
    this.observer.disconnect()
  }
}
