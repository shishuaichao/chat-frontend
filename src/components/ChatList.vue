<template>
  <div class="chat-list-container">
    <ChatItem v-for="(item, index) in chatList" :key="index" :item="item" @handleClick="entryChat" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getConversationList } from '@/api/index.js'
import router from '@/router';
import ChatItem from './ChatItem.vue'


const chatList = ref([]);
// 进入聊天
const entryChat = (item) => {
  router.push({
    name: 'ChatRoom',
    query: {
      convId: item.convId,
    }
  })
}

onMounted(() => {
  getConversationList()
    .then(res => {
      console.log('getConversationList', res)
      chatList.value = res.data.map(item => {
        return {
          convId: item.convId,
          avatar: item.type == 2 ? item.avatar.split(',') : item.avatar,
          name: item.name,
          type: item.type,
          message: '',
          time: '',
          hasRedDot: false,
          hasAttachment: false
        }
      })
    })
    .catch(err => {
      console.log('getConversationList', err)
    })
})
</script>

<style scoped lang="scss">
.chat-list-container {
  width: 100%;
  // max-width: 480px;
  background-color: #fff;
  border-radius: 4px;
}






</style>