import { fetchGet, fetchPost } from './axios.js'

export const fetchRegister = (params) => fetchPost('/api/user/register', params)
export const fetchLogin = (params) => fetchPost('/api/user/login', params)
export const fetchUserUpdate = (params) => fetchPost('/user/update', params)
export const fetchUserInfo = (params) => fetchGet('/user/info', params)



export const fetchChatRecords = (params) => fetchGet('/chat/records', params)
