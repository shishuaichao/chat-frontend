<template>
  <div>
    <van-nav-bar
      :left-arrow="showLeftArrow"  
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
    <van-cell title="测试页面" to="/testPage" value="查看详情" />

    <!-- 在后台：{{ isInBack }} -->

    <div class="padding_20 justify_content_center foot_box">
      <van-button block plain hairline type="danger" size="small" class="logout-btn" @click="logout">注  销</van-button>
    </div>
    <router-view />
  </div>
</template>
<script setup>
import { onActivated, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import routes from '@/router/tabbars.js'
import { showConfirmDialog } from 'vant'
import { getUserInfo } from '@/utils/utils'
const store = useStore()
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

const userInfo = ref(getUserInfo())
const showLeftArrow = ref(false)
onActivated(() => {
  userInfo.value = getUserInfo()
  showLeftArrow.value = false
  routes.forEach(item => {
    showLeftArrow.value = store.state.prePageInfo.name === item.name
  })
})

const logout = () => {
  showConfirmDialog({
    title: '提示',
    message: '确定注销吗？',
  })
    .then(() => {
      localStorage.clear()
      window.location.reload()
    })
    .catch(() => {});
  
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
