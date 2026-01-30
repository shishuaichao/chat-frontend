
import router from '@/router/index.js'





export const checkLogined = () => {
  let id = localStorage.getItem('id')
  let nickname = localStorage.getItem('nickname')
  let avatar = localStorage.getItem('avatar')
  if (!id || !nickname) {
    router.replace({ name: 'SettingNickname' })
    return
  } else if (!avatar) {
    router.replace({ name: 'SettingAvatar' })
    return
  }
}