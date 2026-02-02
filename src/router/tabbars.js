

const TabMessage = () => import('@/views/tabBars/TabMessage.vue')
const TabFriends = () => import('@/views/tabBars/TabFriends.vue')
const TabSearch = () => import('@/views/tabBars/TabSearch.vue')
// const TabMine = () => import('@/views/tabBars/TabMine.vue')   
const IndexSetting = () => import('@/views/settings/IndexSetting.vue')

export default [
  {
    path: '/message',
    name: 'TabMessage',
    component: TabMessage,
    meta: { title: '消息', icon: 'wechat' },
  },
  {
    path: '/friends',
    name: 'TabFriends',
    component: TabFriends,
    meta: { title: '好友', icon: 'friends' },
  },
  {
    path: '/search',
    name: 'TabSearch',
    component: TabSearch,
    meta: { title: '朋友圈', icon: 'wechat-moments' },
  },
  {
    path: '/setting',
    name: 'TabMine',
    component: IndexSetting,
    meta: { title: '我的', icon: 'user' },
  },
]