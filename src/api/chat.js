
import { fetchGet, fetchPost } from './axios.js'


export const fetchChatRecords = (params) => fetchGet('/chat/records', params)
export const fetchCreateConversation = (params) => fetchPost('/chat/conversation/create', params)
export const fetchJoinConversation = (params) => fetchPost('/chat/conversation/join', params)
export const getConversationList = (params) => fetchGet('/chat/conversation/list', params)

export const fetchConvInfo = (params) => fetchGet('/chat/conversation/info', params)


export default {
  fetchChatRecords,
  fetchCreateConversation,
  fetchJoinConversation,
  getConversationList
}
