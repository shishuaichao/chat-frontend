<template>
  <div class="main_container">
    <ChatHeader :onlineUser="onlineUser" :title="title"></ChatHeader>
    <div class="chat_content_box" ref="chatContentRef">
      <ChatContent v-for="v,i in msgList" :key="i" :msgInfo="v" :convMember="convMember"></ChatContent>
    </div>
    <ChartFooter @sendMessage="sendMsg"  @focus="scrollToBottom" />
  </div>
</template>

<script setup>
import { ref, onActivated, nextTick, onDeactivated } from 'vue'
import { showToast } from 'vant';
import ChatHeader from '@/components/ChatHeader.vue';
import ChatContent from '@/components/ChatContent.vue';
import ChartFooter from '@/components/ChatFooter.vue';
import { WS_mitt, WS_Client } from '@/utils/WS_Client';
import { useRoute } from 'vue-router'
import { fetchChatRecords, fetchConvMember } from '@/api/chat.js'
// import store from '@/store'

const route = useRoute()  



const onlineUser = ref([])
const convMember = ref({})   // [ id: {nickname: '', avatar: ''}]
const userInfo = ref({}) 
const title = ref('')
const getConvMember = () => {
  fetchConvMember({ convId: route.query.convId, type: route.query.type })
    .then(res => {
      let arr = res.data || []
      convMember.value = arr.reduce((pre, cur) => {
        pre[cur.id] = {
          nickname: cur.nickname,
          avatar: cur.avatar,
        }
        return pre
      }, {})
    })
    .catch(err => {
      console.log('fetchConvMember', err)
    })
}

const eventConnectSuccess = () => {
  WS_Client.joinRoom(route.query.convId)
}
const eventMessage = (data) => {
  render(data)
}
const eventSystemMsg = (data) => {
  if (data.id !== userInfo.value.id) {
    showToast(data.content);
    render(data)
  }
}
const eventOnlineCount = (data) => {
  onlineUser.value = data
}



const init = () => {
  WS_Client.joinRoom(route.query.convId)
  getConvMember()
  getAllChats()
  

  userInfo.value = {
    sender_id: localStorage.getItem('id'),
    nickname: localStorage.getItem('nickname'),
    avatar: localStorage.getItem('avatar'),
  }
  // 链接成功 
  WS_mitt.on('connect_success', eventConnectSuccess)
  // 聊天消息
  WS_mitt.on('message', eventMessage)
  // 系统消息
  WS_mitt.on('system_msg', eventSystemMsg)
  // 在线人数
  WS_mitt.on('online_count', eventOnlineCount)

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
  // console.log('msgList', msgList.value)
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

onActivated(() => {
  init()
  
  chatContentRef.value.addEventListener('scroll', scrollEvent)
})

onDeactivated(() => {
  WS_Client.leaveRoom(route.query.convId)
  chatContentRef.value?.removeEventListener('scroll', scrollEvent)
  // 链接成功 
  WS_mitt.off('connect_success', eventConnectSuccess)
  // 聊天消息
  WS_mitt.off('message', eventMessage)
  // 系统消息
  WS_mitt.off('system_msg', eventSystemMsg)
  // 在线人数
  WS_mitt.off('online_count', eventOnlineCount)
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
