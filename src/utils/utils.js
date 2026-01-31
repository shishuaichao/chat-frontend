

export const getSessionKey = (arr) => {
    let ids = arr.sort((a, b) => a - b)
    return ids.join('_')
}


export const addObserver = (el, callback) => {
  let observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      callback()
      observer.unobserve(el)
      observer.disconnect()
      observer = null
    }
  })
  observer.observe(el);
}