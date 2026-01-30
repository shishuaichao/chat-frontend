

import { fetchGet, fetchPost } from './axios.js'

export const fetchRegister = (params) => fetchPost('/user/register', params)
export const fetchUserUpdate = (params) => fetchPost('/user/update', params)
export const fetchUserInfo = (params) => fetchGet('/user/userInfo', params)
export const fetchFriendAdd = (params) => fetchPost('/user/friendship/add', params)
export const fetchRemarkname = (params) => fetchPost('/user/friendship/remark', params)

export const fetchFriendList = () => fetchGet('/user/friends')
export const fetchGroupList = () => fetchGet('/user/groups')
// 好友申请列表
export const fetchFriendsApplyList = () => fetchGet('/user/friends/apply')


