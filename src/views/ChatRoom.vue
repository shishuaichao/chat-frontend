<template>
  <div class="main_container">
    <ChatHeader :onlineUser="onlineUser"></ChatHeader>
    <div class="chat_content_box" ref="chatContentRef">
      <ChatContent v-for="v,i in msgList" :key="i" :msgInfo="v" :userInfo="userInfo"></ChatContent>
    </div>
    <ChartFooter @sendMessage="sendMsg"  @focus="scrollToBottom" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
// import io from 'socket.io-client'
import axios from 'axios'
import { showToast } from 'vant';
import ChatHeader from '@/components/ChatHeader.vue';
import ChatContent from '@/components/ChatContent.vue';
import ChartFooter from '@/components/ChatFooter.vue';
import { WS_mitt, WS_Client } from '@/utils/WS_Client';

const onlineUser = ref([])
const userInfo = ref({})
const init = () => {
  getAllChats()
  userInfo.value = {
    id: localStorage.getItem('id'),
    nickname: localStorage.getItem('nickname'),
    avatar: localStorage.getItem('avatar'),
  }
  // 链接成功 
  WS_mitt.on('connect_success', () => {
    WS_Client.emit('set_nickname', { ...userInfo.value })
  })
  // 聊天消息
  WS_mitt.on('message', (data) => {
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
    onlineUser.value = [...data, ...data, ...data, ...data]
  })
  WS_Client.emit('query_online_count')
}

// 聊天记录
const msgList = ref([])
const originList = ref([])
const getAllChats = async () => {
  const res = await axios.get('http://172.20.10.2:5000/api/wechats')
  originList.value = res.data || []
  msgList.value = originList.value.splice(-40)
  scrollToBottom()
}

// 渲染消息
const render = (msgData) => {
  msgList.value.push(msgData)
  // console.log(msgList.value)
  scrollToBottom()
}

// 发送消息
const sendMsg = (msg) => {
  const msgData = { content: msg, ...userInfo.value }
  // console.log('sendMsg1111', userInfo.value )
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
