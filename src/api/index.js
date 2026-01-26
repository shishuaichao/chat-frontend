import { fetchGet, fetchPost } from './axios.js'

export const fetchRegister = (params) => fetchPost('/user/register', params)
export const fetchLogin = (params) => fetchPost('/user/login', params)
export const fetchUpdateAvatar = (params) => fetchPost('/user/update/avatar', params)



export const fetchChatRecords = (params) => fetchGet('/chat/records', params)
