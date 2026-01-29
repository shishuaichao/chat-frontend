
<template>
  <div class="search_box">
    <UserImg :avatarList="avatarList.slice(0,2)" size="normal" />
    <hr />
    <UserImg :avatarList="avatarList.slice(0,3)" size="normal" />
     <hr />
    <UserImg :avatarList="avatarList.slice(0,4)" size="normal" />
    <hr />
    <UserImg :avatarList="avatarList.slice(0,5)" :size="size" />
     <hr />
    <UserImg :avatarList="avatarList.slice(0,6)" :size="size" />
    <hr />
    <UserImg :avatarList="avatarList.slice(0,7)" :size="size" />
     <hr />
    <UserImg :avatarList="avatarList.slice(0,8)" :size="size" />
     <hr />
    <UserImg :avatarList="avatarList.slice(0,9)" :size="size" />
  </div>
</template>
<script setup>
import UserImg from '@/components/UserImg.vue'
import { IMG_REAL_URL } from '@/utils/constant'
import { ref } from 'vue'


const size = ref('normal')
// const avatar = ref(`${IMG_REAL_URL}23`)
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
.search_box {
  padding: 20px;
}
:deep(.main_box) {
  margin-right: 10px;
}
</style>
