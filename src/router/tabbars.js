

const TabMessage = () => import('@/views/tabBars/TabMessage.vue')
const TabFriends = () => import('@/views/tabBars/TabFriends.vue')
const TabSearch = () => import('@/views/tabBars/TabSearch.vue')
const TabMine = () => import('@/views/tabBars/TabMine.vue')   

export default [
  {
    path: '/message',
    name: 'TabMessage',
    component: TabMessage,
    meta: { title: '消息', icon: 'chat-o', activeIcon: 'chat', clearHistory: true },
  },
  {
    path: '/friends',
    name: 'TabFriends',
    component: TabFriends,
    meta: { title: '好友', icon: 'friends-o', activeIcon: 'friends', clearHistory: true },
  },
  {
    path: '/search',
    name: 'TabSearch',
    component: TabSearch,
    meta: { title: '朋友圈', icon: 'wechat-moments', activeIcon: 'eye', clearHistory: true },
  },
  {
    path: '/setting',
    name: 'TabMine',
    component: TabMine,
    meta: { title: '我', icon: 'contact-o', activeIcon: 'contact', clearHistory: true },
  },
]