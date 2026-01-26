
import router from '@/router/index.js'

export const checkLogined = () => {
  let username = localStorage.getItem('username')
  let nickname = localStorage.getItem('nickname')
  let avatar = localStorage.getItem('avatar')
  if (!username || !nickname) {
    router.replace({ name: 'SettingNickname' })
  } else if (!avatar) {
    router.replace({ name: 'SettingAvatar' })
  }
}