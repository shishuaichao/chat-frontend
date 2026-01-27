
import router from '@/router/index.js'
import { getAllUsers } from '@/api/index.js'





export const checkLogined = () => {
  let username = localStorage.getItem('username')
  let nickname = localStorage.getItem('nickname')
  let avatar = localStorage.getItem('avatar')
  if (!username || !nickname) {
    router.replace({ name: 'SettingNickname' })
    return
  } else if (!avatar) {
    router.replace({ name: 'SettingAvatar' })
    return
  }
  getAllUsers()
    .then(res => {
      if (res.code === 200) {
        let users = res.data
        let user = users.find(item => item.id == localStorage.getItem('id'))
        console.log('getAllUsers', user)
        if (!user) {
          localStorage.clear()
          router.replace({ name: 'SettingNickname' })
          return
        }
      }
    })
    .catch(err => {
      console.log('getAllUsers', err)
    })
}