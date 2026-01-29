<template>
  <div>
    <van-nav-bar
      :title="title"
    />
    <ChatList :chatList="chatList" @handleClick="entryChat" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import ChatList from '@/components/ChatList.vue';
import { getConversationList } from '@/api/index.js'
import router from '@/router';

router

// 定义标题
const title = ref('消息');


// 进入聊天
const entryChat = (item) => {
  router.push({
    name: 'ChatRoom',
    query: {
      convId: item.convId,
    }
  })
}

const chatList = ref([]);
onMounted(() => {
  getConversationList()
    .then(res => {
      chatList.value = res.data
    })
    .catch(err => {
      console.log('getConversationList', err)
    })
})
</script>
<style scoped lang="scss">

</style>
