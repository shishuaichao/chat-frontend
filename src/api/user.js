

import { fetchGet, fetchPost } from './axios.js'

// info
export const fetchRegister = (params) => fetchPost('/user/info/register', params)
export const fetchUserUpdate = (params) => fetchPost('/user/info/updateInfo', params)
export const fetchUserInfo = (params) => fetchGet('/user/info/userInfo', params)

// friend
export const fetchFriendInfo = (params) => fetchGet('/user/friend/friendInfo', params)
export const fetchFriendAdd = (params) => fetchPost('/user/friend/addFriend', params)
export const fetchRemarkname = (params) => fetchPost('/user/friend/setRemark', params)
export const fetchFriendList = (params) => fetchGet('/user/friend/friendList', params)
export const fetchFriendsApplyList = (params) => fetchGet('/user/friend/applyList', params)

// group
export const fetchGroupList = (params) => fetchGet('/user/group/groupList', params)



