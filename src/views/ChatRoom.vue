<template>
  <div class="main_container">
    <ChatHeader :onlineUser="onlineUser" :title="title"></ChatHeader>
    <div class="chat_content_box" ref="chatContentRef">
      <ChatContent v-for="v,i in msgList" :key="i" :msgInfo="v"></ChatContent>
    </div>
    <ChartFooter @sendMessage="sendMsg"  @focus="scrollToBottom" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { showToast } from 'vant';
import ChatHeader from '@/components/ChatHeader.vue';
import ChatContent from '@/components/ChatContent.vue';
import ChartFooter from '@/components/ChatFooter.vue';
import { WS_mitt, WS_Client } from '@/utils/WS_Client';
import { useRoute } from 'vue-router'

import { fetchChatRecords } from '@/api/chat.js'


const route = useRoute()  



const onlineUser = ref([])
const title = ref('')
const userInfo = ref({})
const init = () => {
  title.value = route.query.title || ''
  getAllChats()
  // 加入房间
  WS_Client.joinRoom(route.query.convId)

  // 监听连接成功
  WS_mitt.on('join_room', () => {
    // showToast({
    //   message: msg,
    //   duration: 500
    // })
  })

  userInfo.value = {
    senderId: localStorage.getItem('id'),
    nickname: localStorage.getItem('nickname'),
    avatar: localStorage.getItem('avatar'),
  }
  // 链接成功 
  WS_mitt.on('connect_success', () => {
    WS_Client.joinRoom(route.query.convId)
  })

  // 聊天消息
  WS_mitt.on('message', (data) => {
    console.log('11111', data)
    render(data)
  })



  // 系统消息
  WS_mitt.on('system_msg', (data) => {
    if (data.id !== userInfo.value.id) {
      showToast(data.content);
      render(data)
    }
  })
  // 在线人数
  WS_mitt.on('online_count', (data) => {
    onlineUser.value = data
  })
  WS_Client.emit('query_online_count')
}

// 聊天记录
const msgList = ref([])
const originList = ref([])
const getAllChats = () => {
  fetchChatRecords({ convId: route.query.convId })
    .then(res => {
      originList.value = res.data || []
      msgList.value = originList.value.splice(-40)
      scrollToBottom()
    })
    .catch(err => {
      console.log('fetchChatRecords', err)
    })
}

// 渲染消息
const render = (msgData) => {
  msgList.value.push(msgData)
  console.log('msgList', msgList.value)
  scrollToBottom()
}

// 发送消息
const sendMsg = (msg) => {
  const msgData = { 
    content: msg, 
    convId: route.query.convId, 
    type: 1,
    status: 1,
    created_at: Date.parse(new Date()),
    ...userInfo.value,
  }
  WS_Client.emit('message', msgData)
}



// 滚动到底部
const chatContentRef = ref(null)
const scrollToBottom = () => {
  if (!chatContentRef.value) return;
  nextTick(() => {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight
  })
}

// 滚动监听
const scrollEvent = () => {
  if (!originList.value.length) return
  if (chatContentRef.value.scrollTop == 0) {
    let lastHeight = chatContentRef.value.scrollHeight
    let newArr = originList.value.splice(-30)
    msgList.value = [...newArr, ...msgList.value]
    nextTick(() => {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight - lastHeight
    })
  }
}

onMounted(() => {
  init()
  
  chatContentRef.value.addEventListener('scroll', scrollEvent)
})

onUnmounted(() => {

})

</script>

<style scoped>

.main_container {
  height: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column; 
}
.chat_content_box {
  flex: 1;
  overflow-y: auto;
  padding: 60px 6px 30px;
  background-color: #f4f4f4;
}

</style>
