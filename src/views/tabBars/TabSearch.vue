
<template>
  <div class="tab_container">
    <van-nav-bar
        :title="title"
    />
    <div class="tab_content" ref="scrollerRef">
      
      <UserImg :avatar="avatarList.slice(0,2)" size="normal" />
      <hr />
      <UserImg :avatar="avatarList.slice(0,3)" size="normal" />
      <hr />
      <div v-for="v, i in 12" :key="i">
        <UserImg :avatar="avatarList.slice(0,1)" size="normal" />
        <hr />
      </div>
    </div>
  </div>
</template>
<script setup>
import UserImg from '@/views/components/UserImg.vue'
// import { IMG_REAL_URL } from '@/utils/constant'
import { ref, onActivated, onDeactivated } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router'

const route = useRoute()

const title = ref('朋友圈')
// const size = ref('normal')
// const avatar = ref(`${IMG_REAL_URL}23`)
const avatarList = ref([
  `23`, 
  `24`, 
  `25`, 
  `26`,
  `27`,
  `28`,
  `29`,
  `30`,
  `31`,
])

const getFriendsShow = () => {
  // 获取朋友圈
}

const scrollerRef = ref(null);
let lastScrollTop = 0
// 页面激活时
onActivated(() => {
  getFriendsShow()
  scrollerRef.value.scrollTop = lastScrollTop
})
// 页面失活时
onDeactivated(() => {
  
})
// 离开页面前
onBeforeRouteLeave((to, from, next) => {
  if (from.name == route.name) {  
    lastScrollTop = scrollerRef.value.scrollTop
  }
  next()
})
</script>
<style scoped lang="scss">

</style>
