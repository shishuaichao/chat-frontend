<template>
  <div>
    <van-nav-bar
      :title="title"
    />
    <ChatList @clickChat="clickChat" />
    <!-- <van-button 
      type="primary" 
      icon="plus" 
      block
      plain
      @click="createConversation"
      >
        新建聊天
    </van-button> -->
    <!-- <van-button 
      type="primary" 
      icon="chat" 
      block
      plain
      @click="joinConversation"
      >
        加入群聊
    </van-button> -->
  </div>
</template>
<script setup>
import { ref } from 'vue';
import ChatList from '@/components/ChatList.vue';
import router from '@/router';
// import { fetchJoinConversation } from '@/api/index.js'
// import { showToast } from 'vant';
// 点击聊天项
const clickChat = () => {
  router.push({
    name: 'ChatRoom',
  })
}
// 定义标题
const title = ref('消息');
// 新建聊天
// const createConversation = () => {
//   const params = {
//     name: '公共聊天群',
//     type: 2,
//     owner_id: localStorage.getItem('id'),
//     member_ids: [localStorage.getItem('id')],
//   }
//   fetchCreateConversation(params)
//     .then(res => {
//       if (res.code === 200) {
//         showToast('新建聊天成功')
//       }
//     })
//     .catch(err => {
//       console.log('fetchCreateConversation', err)
//     })
// }
// 加入群聊
// const joinConversation = () => {
//   const params = {
//     conv_id: '1',
//     user_id: localStorage.getItem('id'),
//   }
//   fetchJoinConversation(params)
//     .then(res => {
//       if (res.code === 200) {
//         showToast('加入群聊成功')
//       }
//     })
//     .catch(err => {
//       console.log('fetchJoinConversation', err)
//     })
// }
</script>
<style scoped lang="scss">

</style>
