// import { showToast } from 'vant'

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
  return localStorage.getItem(`remark${id}`) || ''
}

export const setRemark = (id, remark) => {
  localStorage.setItem(`remark${id}`, remark)
  // showToast(`设置成功，${id}的备注为${remark}`)
}
