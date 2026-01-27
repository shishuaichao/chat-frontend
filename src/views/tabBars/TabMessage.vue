<template>
  <div>
    <van-nav-bar
      :title="title"
    />
    <ChatList @clickChat="clickChat" />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import ChatList from '@/components/ChatList.vue';
import router from '@/router';
// 点击聊天项
const clickChat = () => {
  router.push({
    name: 'ChatRoom',
  })
}
// 定义标题
const title = ref('消息');
</script>
<style scoped lang="scss">

</style>
