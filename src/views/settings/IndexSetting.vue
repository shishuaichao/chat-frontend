<template>
  <div>
    <van-nav-bar
      left-arrow  
      :title="route.meta.title"
      @click-left="onClickLeft"
    />
    <div class="info_box">
      <van-image
        class="avatar"
        :src="userInfo.avatar"
        @click="editAvatar"
      />
      <div class="info">
        <div class="nickname flex align_items_center">
          {{ userInfo.nickname }}
          <div class="edit_icon" @click="editNickname">
            <van-icon name="edit" />
          </div>
        </div>
        <div class="userId">ID: {{ userInfo.id }}</div>
      </div>
    </div>

    在后台：{{ isInBack }}

    <div class="padding_20 justify_content_center foot_box">
      <van-button block plain hairline type="danger" size="small" class="logout-btn" @click="logout">注  销</van-button>
    </div>
    <router-view />
  </div>
</template>
<script setup>
import { onActivated, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import msgModule from '@/store/msgModule.js'
import { useStore } from 'vuex'
const store = useStore()

console.log('store', store)
const isInBack = computed(() => {
  return store.state.count
})

setTimeout(() => {
  console.log('msgModule', msgModule)
  // msgModule.setIsInBack(true)
  store.commit('increment')
  
}, 1000)

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
  id: '',
})
onActivated(() => {
  userInfo.value = {
    avatar: localStorage.getItem('avatar'),
    nickname: localStorage.getItem('nickname'),
    id: localStorage.getItem('id'),
  }
})

const logout = () => {
  // const str = localStorage.getItem('remark20')
  // showToast(str)
  localStorage.clear()
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
