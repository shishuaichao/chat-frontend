

export const getSessionKey = (arr) => {
    let ids = arr.sort((a, b) => a - b)
    return ids.join('_')
}


// export const addObserver = (el, callback) => {
//   let observer = new IntersectionObserver((entries) => {
//     if (entries[0].isIntersecting) {
//       callback()
//       observer.unobserve(el)
//       observer.disconnect()
//       observer = null
//     }
//   })
//   observer.observe(el);
// }

// 废弃
export const addObserver = (el, callback, isLang = false, options = {}) => {
  let observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      callback()
      if (!isLang) {
        observer.unobserve(el)
        observer.disconnect()
        observer = null
      }
    }
  }, options)
  observer.observe(el);
  return observer
}

export class AddObserverFun {
  constructor(el, callback, options = {}) {
    this.el = el
    this.callback = callback  
    this.options = options
    this.observer = null
    this.isLang = options.isLang
  }
  open() {  
    if (!this.observer && this.el) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.callback()
          if (!this.isLang) {
            this.close()
          }
        }
      }, this.options)
      this.observer.observe(this.el);
    }
  }
  close() {
    if (this.observer) {
      this.observer.unobserve(this.el)
      this.observer.disconnect()
      this.observer = null
    }
  }
}

