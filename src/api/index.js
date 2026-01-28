import { fetchGet, fetchPost } from './axios.js'

export const fetchRegister = (params) => fetchPost('/user/register', params)
export const fetchLogin = (params) => fetchPost('/user/login', params)
export const fetchUserUpdate = (params) => fetchPost('/user/update', params)
export const fetchUserInfo = (params) => fetchGet('/user/info', params)
export const getAllUsers = () => fetchGet('/user/all')
export const fetchFriendAdd = (params) => fetchPost('/user/friendship/add', params)


export const fetchChatRecords = (params) => fetchGet('/chat/records', params)
export const fetchCreateConversation = (params) => fetchPost('/chat/conversation/create', params)
export const fetchJoinConversation = (params) => fetchPost('/chat/conversation/join', params)
