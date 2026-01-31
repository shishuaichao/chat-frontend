<template>
  <div>
    <van-nav-bar
      :title="title"
    />
    <ChatList :chatList="chatList" @handleClick="entryChat" />
  </div>
</template>
<script setup>
import { ref, onActivated } from 'vue';
import ChatList from '@/views/components/ChatList.vue';
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
      type: item.type,
    }
  })
}

const chatList = ref([]);
onActivated(() => {
  console.log('TabMessage mounted')
  getConversationList()
    .then(res => {
      chatList.value = res.data
    })
    .catch(err => {
      console.log('getConversationList', err)
    })
})
</script>
<!-- 新增普通script标签，声明组件name -->
<script>
export default {
  name: 'TabMessage'
}
</script>

<style scoped lang="scss">

</style>
