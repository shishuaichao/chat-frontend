<template>
  <div>
    <van-nav-bar
      :title="route.meta.title"
      @click-left="onClickLeft"
    />
    <van-cell title="设置头像" is-link url="/setting/avatar" />
    <van-cell title="设置昵称" is-link url="/setting/nickname" />

    <div class="padding_20 justify_content_center foot_box">
      <van-button block plain hairline type="danger" size="small" class="logout-btn" @click="logout">注  销</van-button>
    </div>
    <router-view />
  </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()  

const onClickLeft = () => {
  router.back()
}

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
    margin-top: 20px;
    width: 100%;
    .logout-btn {
      width: 40%;
    }
  }
</style>  
