

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
    meta: { title: '消息', icon: 'home-o' },
  },
  {
    path: '/friends',
    name: 'TabFriends',
    component: TabFriends,
    meta: { title: '好友', icon: 'friends-o' },
  },
  {
    path: '/search',
    name: 'TabSearch',
    component: TabSearch,
    meta: { title: '搜索', icon: 'search' },
  },
  {
    path: '/setting',
    name: 'TabMine',
    component: IndexSetting,
    meta: { title: '设置', icon: 'setting-o' },
  },
]