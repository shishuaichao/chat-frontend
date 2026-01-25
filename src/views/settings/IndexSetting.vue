<template>
  <div>
    <van-nav-bar
      :title="route.meta.title"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-cell title="设置头像" is-link url="/setting/avatar" />
    <van-cell title="设置昵称" is-link url="/setting/nickname" />
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
</script>

<style scoped lang="scss">
  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
</style>  
