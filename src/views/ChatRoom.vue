<template>
  <div class="main_container">
    <ChatHeader :title="title"></ChatHeader>
    <div class="chat_content_box" ref="chatContentRef">
      <ChatUnreadTip :count="unreadMsgCount" position="bottom" @click="toReadNewMsg"></ChatUnreadTip>
      <div class="msg_container_history" key="history">
        <ChatContent v-for="v in historyList" :key="v.id" :msgInfo="v" :convMember="convMember"></ChatContent>
      </div>
      <div class="msg_container_query" key="query">
        <ChatContent v-for="v in msgList" :key="v.id" :msgInfo="v" :convMember="convMember"></ChatContent>
      </div>
      <div class="msg_container_unread" key="unread">
        <ChatContent v-for="v in unreadList" :key="v.id" :msgInfo="v" :convMember="convMember"></ChatContent>
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
import { fetchChatRecords, fetchConvMember, fetchUpdateUnread, fetchGetUnreadList } from '@/api/chat.js'
import { throttle } from 'lodash';
import ChatUnreadTip from '@/views/components/ChatUnreadTip.vue'
// import store from '@/store'
import { notify } from 'mini-notifier'
import { AddObserverFun } from '@/utils/utils.js'

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
const firstRenderCount = 30
const historyList = ref([])
const addHistoryCountOnce = 30
const unreadList = ref([])
const getAllChats = () => {
  fetchChatRecords({ convId: route.query.convId })
    .then(res => {
      let resList = res.data?.records || []
      originList.value = resList.filter(v => v.id <= res.data?.last_read_msg_id)
      unreadList.value = resList.filter(v => v.id > res.data?.last_read_msg_id)
      msgList.value = originList.value.splice(-firstRenderCount)
      unreadMsgCount.value = unreadList.value.length
      let id = msgList.value.length ? msgList.value[msgList.value.length - 1]?.id : 0
      scrollToBottom(id, id ? 'end' : '')
      nextTick(() => {
        unreadList.value.forEach(e => {
          let el = document.querySelector(`.msg_item_${e.id}`)
          observer.add(el, updateUnreadMsgCount(e.id))
        })
      })
    })
    .catch(() => {})
}
const getUnreadList = () => {
  lastReadMsgId = getLastMsgId()
  if (!lastReadMsgId) {
    return
  }
  fetchGetUnreadList({ convId: route.query.convId, lastReadMsgId, })
    .then(res => {
      let resList = res.data || []
      unreadList.value = resList
      unreadMsgCount.value = unreadList.value.length
    })
    .catch(err => {
      console.log('fetchGetUnreadInfo', err)
    })
}




// 滚动监听
const scrollEvent = () => {
  if (chatContentRef.value?.scrollTop == 0) {
    if (!originList.value.length) {
      showToast({
        message: '别滑了，一条都没有了',
        duration: 500,
      })
      return
    }
    let lastHeight = chatContentRef.value?.scrollHeight
    let newArr = originList.value.splice(-addHistoryCountOnce)
    historyList.value = [...newArr, ...historyList.value]
    nextTick(() => {
      chatContentRef.value && (chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight - lastHeight)
    })
  }
  
}



// 发送消息
const sendMsg = (msg) => {
  const msgData = { 
    content: msg, 
    convId: route.query.convId, 
    type: 1,
    status: 1,
    ...userInfo.value,
  }
  if (route.query.type == 1) {
    let data = {
      ...msgData,
      from: localStorage.getItem('id'),
      to: route.query.id,
    }
    WS_Client.sendPrivateMsg(data)
  } else {
    WS_Client.sendMsg(msgData)
  }
}

const getLastMsgId = () => {
  let id = null
  if (unreadList.value.length) {
    id = unreadList.value[unreadList.value.length - 1]?.id
  } else {
    id = msgList.value[msgList.value.length - 1]?.id
  }
  return id
}


// 滚动到底部
const chatContentRef = ref(null)
const scrollToBottom = (id, options={}) => {
  let msgElement = null
  nextTick(() => {
    if (id) {
      msgElement = document.querySelector(`.msg_item_${id}`)
    } else {
      id = getLastMsgId()
      msgElement = document.querySelector(`.msg_item_${id}`)
    }

    if (msgElement?.scrollIntoView) {
      msgElement && msgElement.scrollIntoView({
        behavior: options.behavior || 'smooth',
        block: options.block || 'end',
        container: options.container || 'nearest',
        inline: options.inline || 'end',
      })
    } else {
      requestAnimationFrame(() => {
        const container = chatContentRef.value
        container && (container.scrollTop = container.scrollHeight)
      })
    }
  })
}


onMounted(() => {
  getAllChats()
})


let observer = null
let lastScrollTop = 0
let lastReadMsgId = null
onActivated(() => {
  observer = new AddObserverFun({})
  WS_Client.joinRoom(route.query.convId)
  getConvMember()
  getUnreadList()

  userInfo.value = {
    sender_id: localStorage.getItem('id'),
    nickname: localStorage.getItem('nickname'),
    avatar: localStorage.getItem('avatar'),
  }
  
  // 聊天消息
  WS_mitt.on('message', eventMessage)
  // 聊天消息
  WS_mitt.on('private_message', eventMessage)
  // 系统消息
  WS_mitt.on('system_msg', eventSystemMsg)
  // 重连成功
  WS_mitt.on('connect_success', eventConnectSuccess)
  // 加入房间
  WS_mitt.on('join_room', entryRoomEvent)
  // 离开房间
  WS_mitt.on('leave_room', leaveRoomEvent)
  
  chatContentRef.value?.addEventListener('scroll', throttle(scrollEvent, 200))

  chatContentRef.value.scrollTop = lastScrollTop
})

onBeforeRouteLeave((to, from, next) => {
  // 离开房间前 判断路由
  if (from.name == 'ChatRoom') {
    WS_Client.leaveRoom({
      roomId: route.query.convId,
      userId: localStorage.getItem('id'),
    })
    lastScrollTop = chatContentRef.value.scrollTop || 0
    updateUnread()
  }
  next()
})


onDeactivated(() => {
  observer.close()
  chatContentRef.value?.removeEventListener('scroll', scrollEvent)
  // 聊天消息
  WS_mitt.off('message', eventMessage)
  // 聊天消息
  WS_mitt.off('private_message', eventMessage)
  // 系统消息
  WS_mitt.off('system_msg', eventSystemMsg)
  // 有人加入房间
  WS_mitt.off('join_room', entryRoomEvent)
  // 有人离开房间
  WS_mitt.off('leave_room', leaveRoomEvent)
  // 重连成功
  WS_mitt.off('connect_success', eventConnectSuccess)
  
})
const eventConnectSuccess = () => {
  if (route.name == 'ChatRoom') {
    getUnreadList()
    WS_Client.joinRoom(route.query.convId)
  }
}
// 监听事件
const leaveRoomEvent = (data) => {
  if (route.query.type == 2) {
    notify(data)
  }
}
const entryRoomEvent = (data) => {
  if (route.query.type == 2) {
    notify(data)
  }
}
// 是否在页面最底部
const isBottom = () => {
  return chatContentRef.value?.scrollTop + chatContentRef.value?.clientHeight >= chatContentRef.value?.scrollHeight
}
const isSelf = (id) => {
  return id == localStorage.getItem('id')
}
const unreadMsgCount = ref(0)
const toReadNewMsg = () => {
  scrollToBottom()
  unreadMsgCount.value = 0
  lastReadMsgId = getLastMsgId()
}
const updateUnreadMsgCount = (id) => {
  return () => {
    if (unreadMsgCount.value > 0) {
      unreadMsgCount.value--
      // notify(`消息${id}已读`)
      lastReadMsgId = id
      updateUnreadThrottle()
    }
  }
}

const updateUnreadThrottle = throttle(() => {
  updateUnread()
}, 300)

const eventMessage = (data) => {
  unreadList.value.push(data)
  if (isSelf(data.sender_id)) {
    scrollToBottom(data.id)
  } else if (isBottom()) {
    scrollToBottom(data.id)
  } else {
    // 添加未读消息标识
    unreadMsgCount.value++
    nextTick(() => {
      let msgElement = document.querySelector(`.msg_item_${data.id}`)
      observer.add(msgElement, updateUnreadMsgCount(data.id))
    })
  }
}

const updateUnread = () => {
  let lastReadMsgId = getLastMsgId()
  unreadMsgCount.value = 0
  lastReadMsgId && fetchUpdateUnread({
    convId: route.query.convId,
    lastReadMsgId,
  }).catch(() => {})
}


const eventSystemMsg = (data) => {
  if (data.id !== userInfo.value.id) {
    showToast(data.content);
    newList.value.push(data)
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
  -webkit-overflow-scrolling: touch; 
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
