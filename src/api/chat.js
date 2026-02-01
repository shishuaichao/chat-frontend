
import { fetchGet, fetchPost } from './axios.js'


export const fetchCreateConversation = (params) => fetchPost('/chat/conversation/createConversation', params)
export const fetchGetIdBySessionKey = (params) => fetchGet('/chat/conversation/getIdBySessionKey', params)
export const fetchConvMember = (params) => fetchGet('/chat/conversation/member', params)
export const fetchUpdateUnread = (params) => fetchPost('/chat/conversation/updateUnread', params)


export const fetchChatRecords = (params) => fetchGet('/chat/records', params)

export const fetchJoinConversation = (params) => fetchPost('/chat/conversation/join', params)
export const getConversationList = (params) => fetchGet('/chat/conversation/list', params)

export const fetchConvInfo = (params) => fetchGet('/chat/conversation/info', params)

