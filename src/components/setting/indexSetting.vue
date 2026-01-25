<template>
  <div>
    <nicknameSetting @change="nicknameChange" v-if="showNickname"></nicknameSetting>
    <avatarSetting @change="avatarChange" v-if="showAvatar"></avatarSetting>
  </div>
</template>
<script setup>
import nicknameSetting from './nicknameSetting.vue';
import avatarSetting from './avatarSetting.vue';
import { defineEmits, defineExpose, ref } from 'vue'
import { showSuccessToast } from 'vant';
import { v4 as uuId } from 'uuid';

const emit = defineEmits(['canLink'])


const nicknameChange = (nickname) => {
  console.log('nicknameChange', nickname)
  localStorage.setItem('nickname', nickname)
  showSuccessToast('修改成功')
  canLink()
}

const avatarChange = (avatar) => {
  localStorage.setItem('avatar', avatar)
  showSuccessToast('修改成功')
  console.log('avatarChange', avatar)
  canLink()
}

const canLink = () => {
  let id = localStorage.getItem('id')
  let nickname = localStorage.getItem('nickname')
  let avatar = localStorage.getItem('avatar')
  showAvatar.value = !avatar
  showNickname.value =  !nickname
  console.log('canLink', id, nickname, avatar)
  if (id && nickname && avatar) {
    emit('canLink', {id, nickname, avatar})
  }
}

// 检查用户信息
const checkUser = () => {
  // localStorage.clear()
  let id = localStorage.getItem('id')
  let nickname = localStorage.getItem('nickname')
  let avatar = localStorage.getItem('avatar')
  showAvatar.value = !avatar
  showNickname.value = !nickname
  if (!id) {
    id = uuId()
    localStorage.setItem('id', id)
  }
  if (nickname && avatar) {
    canLink()
  }
}  

const showAvatar = ref(false)
const showNickname = ref(false)
const setAvatar = () => {
  showAvatar.value = true
}
const setNickname = () => {
  showNickname.value = true 
}

defineExpose({
  checkUser,
  setAvatar,
  setNickname,
})

</script>