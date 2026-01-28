<template>
  <div>
    <van-nav-bar
      :title="route.meta.title"
      @click-left="onClickLeft"
    />
    <div class="info_box">
      <van-image
        class="avatar"
        :src="IMG_REAL_URL + userInfo.avatar"
        @click="editAvatar"
      />
      <div class="info">
        <div class="nickname flex align_items_center">
          {{ userInfo.nickname }}
          <div class="edit_icon" @click="editNickname">
            <van-icon name="edit" />
          </div>
        </div>
        <div class="userId">ID: {{ userInfo.username }}</div>
      </div>
    </div>
    <!-- <van-cell title="设置头像" is-link url="/setting/avatar" />
    <van-cell title="设置昵称" is-link url="/setting/nickname" /> -->

    <div class="padding_20 justify_content_center foot_box">
      <van-button block plain hairline type="danger" size="small" class="logout-btn" @click="logout">注  销</van-button>
    </div>
    <router-view />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IMG_REAL_URL } from '@/utils/constant.js'



const router = useRouter()
const route = useRoute()  

const onClickLeft = () => {
  router.back()
}

const editAvatar  = () => {
  router.push({
    name: 'SettingAvatar',
  })
}

const editNickname  = () => {
  router.push({
    name: 'SettingNickname',
  })
}

const userInfo = ref({
  avatar: '',
  nickname: '',
  username: '',
})
onMounted(() => {
  userInfo.value = {
    avatar: localStorage.getItem('avatar'),
    nickname: localStorage.getItem('nickname'),
    username: localStorage.getItem('username'),
  }
})

const logout = () => {
  // localStorage.clear()
  // router.replace({ path: '/' })
}
</script>

<style scoped lang="scss">
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .foot_box {
    position: absolute;
    bottom: 200px;
    width: 100%;
    .logout-btn {
      width: 40%;
    }
  }
.info_box {
  display: flex;
  align-items: center;
  padding: 20px;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  overflow: hidden;
  display: block;
}
.info {
  flex: 1;
  margin-left: 20px;
}
.nickname {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  .edit_icon {
    font-size: 14px;
    color: #999;
    margin-left: 8px;
  }
  
}
</style>  
