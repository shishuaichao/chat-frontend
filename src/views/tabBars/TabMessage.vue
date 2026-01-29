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
      console.log('getConversationList', res)
      chatList.value = res.data
      // .map(item => {
      //   return {
      //     convId: item.convId,
      //     avatar: item.type == 2 ? item.avatar.split(',') : item.avatar,
      //     name: item.name,
      //     type: item.type,
      //     message: '',
      //     time: '',
      //     hasRedDot: false,
      //     hasAttachment: false
      //   }
      // })
    })
    .catch(err => {
      console.log('getConversationList', err)
    })
})
</script>
<style scoped lang="scss">

</style>
