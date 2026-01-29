

export const getLocal = (key) => {
  let data = localStorage.getItem(key)
  if (data) {
    data = JSON.parse(data)
  }
  return data
}

export const setLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const getRemark = (id) => {
  let remark = getLocal('remark')
  if (remark) {
    remark = remark[id] || ''
  } else {
    remark = ''
  }
  return remark
}

export const setRemark = (id, remark) => {
  let remarkObj = getLocal('remark') || {}
  remarkObj[id] = remark
  setLocal('remark', remarkObj)
}
