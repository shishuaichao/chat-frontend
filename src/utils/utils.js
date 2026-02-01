import { nextTick } from "vue"


export const getSessionKey = (arr) => {
    let ids = arr.sort((a, b) => a - b)
    return ids.join('_')
}


// 废弃 1.0
// export const addObserver = (el, callback, isLang = false, options = {}) => {
//   let observer = new IntersectionObserver((entries) => {
//     if (entries[0].isIntersecting) {
//       callback()
//       if (!isLang) {
//         observer.unobserve(el)
//         observer.disconnect()
//         observer = null
//       }
//     }
//   }, options)
//   observer.observe(el);
//   return observer
// }

// 废弃 2.0
// export class AddObserverFun {
//   constructor(el, callback, options = {}) {
//     this.el = el
//     this.callback = callback  
//     this.options = options
//     this.observer = null
//     this.isLang = options.isLang
//   }
//   open() {  
//     if (!this.observer && this.el) {
//       this.observer = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting) {
//           this.callback()
//           if (!this.isLang) {
//             this.close()
//           }
//         }
//       }, this.options)
//       this.observer.observe(this.el);
//     }
//   }
//   close() {
//     if (this.observer) {
//       this.observer.unobserve(this.el)
//       this.observer.disconnect()
//       this.observer = null
//     }
//   }
// }


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
          console.log('进入视口', entry.target, id);
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
      nextTick(() => {
        this.add(el, callback)
      })
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
