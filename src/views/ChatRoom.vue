<template>
  <div class="main_container">
    <ChatHeader :title="title"></ChatHeader>
    <div class="chat_content_box" ref="chatContentRef">
      <div class="msg_container_history" key="history">
        <ChatContent v-for="v in historyList" :key="v.id" :msgInfo="v" :convMember="convMember"></ChatContent>
      </div>
      <div class="msg_container_query" key="query">
        <ChatContent v-for="v in msgList" :key="v.id" :msgInfo="v" :convMember="convMember"></ChatContent>
      </div>
      <div class="msg_containere_new" key="new">
        <ChatContent v-for="v in newList" :key="v.id" :msgInfo="v" :convMember="convMember"></ChatContent>
      </div>
    </div>
    <ChartFooter @sendMessage="sendMsg"  @focus="scrollToBottom" />
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, nextTick, onDeactivated } from 'vue'
import { showToast } from 'vant';
import ChatHeader from '@/views/components/ChatHeader.vue';
import ChatContent from '@/views/components/ChatContent.vue';
import ChartFooter from '@/views/components/ChatFooter.vue';
import { WS_mitt, WS_Client } from '@/utils/WS_Client';
import { useRoute, onBeforeRouteLeave  } from 'vue-router'
import { fetchChatRecords, fetchConvMember } from '@/api/chat.js'
import { throttle } from 'lodash';
// import store from '@/store'
import { notify } from 'mini-notifier'

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




// 聊天记录
const originList = ref([])
const msgList = ref([])
const firstRenderCount = 20
const historyList = ref([])
const addHistoryCountOnce = 20
const newList = ref([])
const getAllChats = () => {
  fetchChatRecords({ convId: route.query.convId })
    .then(res => {
      originList.value = res.data || []
      msgList.value = originList.value.splice(-firstRenderCount)
      scrollToBottom()
    })
    .catch(err => {
      console.log('fetchChatRecords', err)
    })
}
// 滚动监听
const scrollEvent = () => {
  if (chatContentRef.value.scrollTop == 0) {
    if (!originList.value.length) {
      showToast({
        message: '别滑了，一条都没有了',
        duration: 500,
      })
      return
    }
    let lastHeight = chatContentRef.value.scrollHeight
    let newArr = originList.value.splice(-addHistoryCountOnce)
    historyList.value = [...newArr, ...historyList.value]
    notify(`newMsg${historyList.value.length}`)
    nextTick(() => {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight - lastHeight
    })
  }
}

// 渲染消息
const render = (msgData) => {
  newList.value.push(msgData)
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
      if (newList.value.length) {
        id = newList.value[newList.value.length - 1]?.id
      } else {
        id = msgList.value[msgList.value.length - 1]?.id
      }
      msgElement = document.querySelector(`.msg_item_${id}`)
    }
    msgElement && msgElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  })
}

onMounted(() => {
  getAllChats()
  
})



onActivated(() => {
  WS_Client.joinRoom(route.query.convId)
  getConvMember()
  

  userInfo.value = {
    sender_id: localStorage.getItem('id'),
    nickname: localStorage.getItem('nickname'),
    avatar: localStorage.getItem('avatar'),
  }
  
  // 聊天消息
  WS_mitt.on('message', eventMessage)
  // 系统消息
  WS_mitt.on('system_msg', eventSystemMsg)
  // 重连成功
  WS_mitt.on('connect_success', () => {
    // notify('重连成功', {
    //   time: 3000,
    //   style: 'success',
    // })
    getAllChats()
    WS_Client.joinRoom(route.query.convId)
  })
  // 加入房间
  WS_mitt.on('join_room', entryRoomEvent)
  // 离开房间
  WS_mitt.on('leave_room', leaveRoomEvent)
  
  chatContentRef.value.addEventListener('scroll', throttle(scrollEvent, 200))
})

onBeforeRouteLeave((to, from, next) => {
  // 离开房间
  WS_Client.leaveRoom({
    roomId: route.query.convId,
    userId: localStorage.getItem('id'),
  })
  next()
})

onDeactivated(() => {
  chatContentRef.value?.removeEventListener('scroll', scrollEvent)
  // 聊天消息
  WS_mitt.off('message', eventMessage)
  // 系统消息
  WS_mitt.off('system_msg', eventSystemMsg)
  // 有人加入房间
  WS_mitt.off('join_room', entryRoomEvent)
  // 有人离开房间
  WS_mitt.off('leave_room', leaveRoomEvent)
  
})
// 监听事件
const leaveRoomEvent = (data) => {
  notify(data, {
    time: 3000,
  })
}
const entryRoomEvent = (data) => {
  notify(data, {
    time: 3000,
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
</script>

<style scoped lang="scss">
.main_container {
  height: 100%;
  overflow-x: hidden;
  display: flex;
  flex-direction: column; 
}
.chat_content_box {
  flex: 1;
  overflow-y: auto;
  padding: 60px 6px 0px;
  // margin-top: 70px;
  background-color: $base_bg_color;
}
.msg_item_box {
  .msg_system_content {
    text-align: center;
    color: #999;
    font-size: 14px;
    margin: 10px 0;
  }
  .msg_item {
    display: flex;
    text-align: left;
    padding-bottom: 16px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;
    margin: 0 10px;
    flex-shrink: 0;
    background-color: #f0f0f0;
  }
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .msg_box {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .left .msg_box {
    flex-direction: row;
  }
  .right .msg_box {
    flex-direction: row-reverse; 
  }

  .nickname {
    font-size: 12px;
    color: #ccc;
    height: 14px;
    line-height: 10px;
    width: 100%;
    font-weight: 500;
    span {
      color: #666;

    }
  }
  .right .nickname {
    text-align: right;
  }
  .msg_content {
    max-width: 80%;
    position: relative;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    line-height: 1.4;
    word-break: break-word;
  }
  .left .msg_content::before {
    content: '';
    position: absolute;
    top: 4px;
    left: -5px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid #fff;
  }
  .right .msg_content::before {
    content: '';
    position: absolute;
    top: 4px;
    right: -5px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #20d63e;
  }
  .left .msg_content {
    background-color: #fff;
    border-radius: 4px;
  }
  .right .msg_content {
    background-color: #20d63e;
    border-radius: 4px;
  }
  
  .msg_other {
    justify-content: flex-start;
  }
  .msg_self {
    justify-content: flex-end;
  }
}
</style>
