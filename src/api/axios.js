

import axios from 'axios'
import { API_BASE_URL } from '@/utils/constant.js'

axios.defaults.baseURL = API_BASE_URL

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
    config.headers['Authorization'] = localStorage.getItem('token')
    return config
  },
  error => Promise.reject(error)
)

export const fetchGet = async (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then(response => resolve(response.data))
      .catch(error => {
        console.error('GET 请求失败:', error)
        reject(error)
      })
  })
}

export const fetchPost = (url, data) => {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => resolve(response.data))
      .catch(error => {
        console.error('POST 请求失败:', error)
        reject(error)
      })
  })
}
