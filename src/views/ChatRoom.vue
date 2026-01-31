<template>
  <div class="main_container">
    <ChatHeader :title="title"></ChatHeader>
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


const eventMessage = (data) => {
  render(data)
}
const eventSystemMsg = (data) => {
  if (data.id !== userInfo.value.id) {
    showToast(data.content);
    render(data)
  }
}


// 聊天记录
const msgList = ref([])
const originList = ref([])
const getAllChats = () => {
  fetchChatRecords({ convId: route.query.convId })
    .then(res => {
      originList.value = res.data || []
      msgList.value = originList.value.splice(-20)
      scrollToBottom()
    })
    .catch(err => {
      console.log('fetchChatRecords', err)
    })
}

// 渲染消息
const render = (msgData) => {
  msgList.value.push(msgData)
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
  WS_Client.sendMsg('message', msgData)
}



// 滚动到底部
const chatContentRef = ref(null)
const scrollToBottom = (id) => {
  let msgElement = null
  nextTick(() => {
    if (id) {
      msgElement = document.querySelector(`.msg_item_${id}`)
    } else {
      msgElement = document.querySelector(`.msg_item_${msgList.value[msgList.value.length - 1]?.id}`)
    }
    msgElement && msgElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  })
}

// 滚动监听
const scrollEvent = () => {
  if (!originList.value.length) {
    showToast('没有更多消息了')
    return
  }
  if (chatContentRef.value.scrollTop == 0) {
    let lastHeight = chatContentRef.value.scrollHeight
    let newArr = originList.value.splice(-10)
    msgList.value = [...newArr, ...msgList.value]
    nextTick(() => {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight - lastHeight
      const id = newArr[newArr.length - 1]?.id
      scrollToBottom(id)
    })
    
  }
}

onActivated(() => {
  WS_Client.joinRoom(route.query.convId)
  getConvMember()
  getAllChats()

  userInfo.value = {
    sender_id: localStorage.getItem('id'),
    nickname: localStorage.getItem('nickname'),
    avatar: localStorage.getItem('avatar'),
  }
  
  // 聊天消息
  WS_mitt.on('message', eventMessage)
  // 系统消息
  WS_mitt.on('system_msg', eventSystemMsg)
  
  chatContentRef.value.addEventListener('scroll', scrollEvent)
})

onDeactivated(() => {
  WS_Client.leaveRoom(route.query.convId)
  chatContentRef.value?.removeEventListener('scroll', scrollEvent)
  // 聊天消息
  WS_mitt.off('message', eventMessage)
  // 系统消息
  WS_mitt.off('system_msg', eventSystemMsg)
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
  padding: 70px 6px 0px;
  background-color: #f4f4f4;
}

</style>
