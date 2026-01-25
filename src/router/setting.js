

const IndexSetting = () => import('@/views/settings/IndexSetting.vue')
const SettingAvatar = () => import('@/views/settings/SettingAvatar.vue')
const SettingNickname = () => import('@/views/settings/SettingNickname.vue')
export default [
  {
    path: '/setting',
    name: 'IndexSetting',
    component: IndexSetting,
    meta: { title: '设置' },
  },
  {
    path: '/setting/avatar',
    name: 'SettingAvatar',
    component: SettingAvatar,
    meta: { title: '设置头像' }
  },
  {
    path: '/setting/nickname',
    name: 'SettingNickname',
    component: SettingNickname,
    meta: { title: '设置昵称' }
  },
]