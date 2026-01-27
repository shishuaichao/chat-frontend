<template>
  <div>
    <van-nav-bar
      :title="title"
    />
    <ChatList @clickChat="clickChat" />
    <van-button 
      type="primary" 
      icon="plus" 
      block
      plain
      @click="createConversation"
      >
        新建聊天
    </van-button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import ChatList from '@/components/ChatList.vue';
import router from '@/router';
import { fetchCreateConversation } from '@/api/index.js'
import { showToast } from 'vant';
// 点击聊天项
const clickChat = () => {
  router.push({
    name: 'ChatRoom',
  })
}
// 定义标题
const title = ref('消息');
// 新建聊天
const createConversation = () => {
  const params = {
    name: '公共聊天群',
    type: 2,
    owner_id: localStorage.getItem('username'),
    member_ids: [localStorage.getItem('username')],
  }
  fetchCreateConversation(params)
    .then(res => {
      if (res.code === 200) {
        showToast('新建聊天成功')
        // router.push({
        //   name: 'ChatRoom',
        //   params: {
        //     conversationId: res.data.id,
        //   }
        // })
      }
    })
    .catch(err => {
      console.log('fetchCreateConversation', err)
    })
}
</script>
<style scoped lang="scss">

</style>
