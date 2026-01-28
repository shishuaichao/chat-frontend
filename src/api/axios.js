

import axios from 'axios'

axios.defaults.baseURL = '/api'
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.put['Content-Type'] = 'application/json';

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

axios.interceptors.request.use(
  config => {
    config.headers['Authorization'] = 'token111'
    // config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => Promise.reject(error)
)

export const fetchGet = async (url, params = {}) => {
  const baseParams = {
    userId: localStorage.getItem('id'),
  }
  return new Promise((resolve, reject) => {
    axios.get(url, { params: { ...baseParams, ...params }, }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => resolve(response.data))
      .catch(error => {
        console.error('GET 请求失败:', error)
        reject(error)
      })
  })
}

export const fetchPost = (url, params = {}) => {
  const baseParams = {
    userId: localStorage.getItem('id'),
  }
  return new Promise((resolve, reject) => {
    axios.post(url, { ...baseParams, ...params })
      .then(response => resolve(response.data))
      .catch(error => {
        console.error('POST 请求失败:', error)
        reject(error)
      })
  })
}
