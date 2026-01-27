import { fetchGet, fetchPost } from './axios.js'

export const fetchRegister = (params) => fetchPost('/user/register', params)
export const fetchLogin = (params) => fetchPost('/user/login', params)
export const fetchUserUpdate = (params) => fetchPost('/user/update', params)



export const fetchChatRecords = (params) => fetchGet('/chat/records', params)
