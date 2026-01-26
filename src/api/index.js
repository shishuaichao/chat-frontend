import { fetchGet, fetchPost } from './axios.js'

export const fetchRegister = (params) => fetchPost('/user/registry', params)
export const fetchLogin = (params) => fetchPost('/user/login', params)

export const fetchChatRecords = (params) => fetchGet('/chat/records', params)