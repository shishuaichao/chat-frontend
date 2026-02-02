
<template>
  <div class="tab_container">
    <van-nav-bar
        :title="title"
    />
    <div class="tab_content">
      <UserImg :type="1" :avatar="avatar" size="normal" />
      <hr />
      <UserImg :type="2" :avatar="avatarList.slice(0,2).join(',')" size="normal" />
      <hr />
      <UserImg :type="2" :avatar="avatarList.slice(0,3).join(',')" size="normal" />
      <hr />
      <UserImg :type="2" :avatar="avatarList.slice(0,4).join(',')" size="normal" />
      <hr />
      <UserImg :type="2" :avatar="avatarList.slice(0,5).join(',')" :size="size" />
      <hr />
      <UserImg :type="2" :avatar="avatarList.slice(0,6).join(',')" :size="size" />
      <hr />
      <UserImg :type="2" :avatar="avatarList.slice(0,7).join(',')" :size="size" />
      <hr />
      <UserImg :type="2" :avatar="avatarList.slice(0,8).join(',')" :size="size" />
      <hr />
      <UserImg :type="2" :avatar="avatarList.slice(0,9).join(',')" :size="size" />
    </div>
  </div>
</template>
<script setup>
import UserImg from '@/views/components/UserImg.vue'
import { IMG_REAL_URL } from '@/utils/constant'
import { ref } from 'vue'

const title = ref('朋友圈')
const size = ref('normal')
const avatar = ref(`${IMG_REAL_URL}23`)
const avatarList = ref([
  `${IMG_REAL_URL}23`, 
  `${IMG_REAL_URL}24`, 
  `${IMG_REAL_URL}25`, 
  `${IMG_REAL_URL}26`,
  `${IMG_REAL_URL}27`,
  `${IMG_REAL_URL}28`,
  `${IMG_REAL_URL}29`,
  `${IMG_REAL_URL}30`,
  `${IMG_REAL_URL}31`,
])
// avatarList.value.slice(3)
</script>
<style scoped lang="scss">

</style>
