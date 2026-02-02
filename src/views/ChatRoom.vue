<template>
  <div class="main_container">
    <NavBar
        :title="title"
        :left-arrow="true"
    >
      <template #right>
         <van-icon class="right_icon" name="ellipsis" />
      </template>
    </NavBar>
    <div class="chat_content_box" ref="chatContentRef">
      <ChatUnreadTip :count="unreadMsgCount" position="bottom" @click="toReadNewMsg"></ChatUnreadTip>
      <div class="msg_container_history" key="history">
        <ChatContent v-for="v in historyList" :key="v.id" :msgInfo="v"></ChatContent>
      </div>
      <div class="msg_container_query" key="query">
        <ChatContent v-for="v in msgList" :key="v.id" :msgInfo="v"></ChatContent>
      </div>
      <div class="msg_container_unread" key="unread">
        <ChatContent v-for="v in unreadList" :key="v.id" :msgInfo="v"></ChatContent>
      </div>
    </div>
    <ChartFooter 
      @sendMessage="sendMessage" 
      @focus="scrollToBottom" />
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, nextTick, onDeactivated } from 'vue'
import { showToast } from 'vant';
import ChatContent from '@/views/components/ChatContent.vue';
import ChartFooter from '@/views/components/ChatFooter.vue';
import { WS_mitt, WS_Client } from '@/utils/WS_Client';
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { fetchChatRecords, fetchUpdateUnread, fetchGetUnreadList } from '@/api/chat.js'
import { throttle } from 'lodash';
import ChatUnreadTip from '@/views/components/ChatUnreadTip.vue'
import { notify } from 'mini-notifier'
// import store from '@/store'
import { 
  scrollToBottomUtil,
  AddObserverFun, 
  getUserInfo, 
  isBottom,
  isSelf,
} from '@/utils/utils.js'
import { 
  sendMsg,
} from '@/utils/ChatRoom.js'
const route = useRoute()  


let observer = null
let lastScrollTop = 0
let lastReadMsgId = null
const chatContentRef = ref(null)
// 页面挂载时
onMounted(() => {
  getAllChats()
})
const lastConvId = ref('')
// 页面激活时
onActivated(() => {
  let newConvId = route.query.convId
  console.log('lastConvId', lastConvId.value)
  console.log('newConvId', newConvId)
  if (newConvId != lastConvId.value) {
    notify('需要更新页面了', {
      position: 'center',
      time: 1000,
    })
    lastConvId.value = newConvId
    lastScrollTop = 0
    getAllChats()
  } else {
    getUnreadList()
  }

  observer = new AddObserverFun({})
  WS_Client.joinRoom(route.query.convId)
  WS_mitt.on('message', eventMessage)
  WS_mitt.on('private_message', eventMessage)
  WS_mitt.on('system_msg', eventMessage)
  WS_mitt.on('connect_success', eventConnectSuccess)
  WS_mitt.on('join_room', entryRoomEvent)
  WS_mitt.on('leave_room', leaveRoomEvent)
  chatContentRef.value.addEventListener('scroll', throttle(scrollEvent, 200))
  chatContentRef.value.scrollTop = lastScrollTop
})
// 页面失活时
onDeactivated(() => {
  msgList.value = [...msgList.value, ...unreadList.value]
  observer?.close()
  WS_mitt.off('message', eventMessage)
  WS_mitt.off('private_message', eventMessage)
  WS_mitt.off('system_msg', eventMessage)
  WS_mitt.off('connect_success', eventConnectSuccess)
  WS_mitt.off('join_room', entryRoomEvent)
  WS_mitt.off('leave_room', leaveRoomEvent)
})
// 离开页面前
onBeforeRouteLeave((to, from, next) => {
  if (from.name == 'ChatRoom') {
    chatContentRef.value?.removeEventListener('scroll', throttle(scrollEvent, 200))
    observer?.close()
    WS_Client.leaveRoom({
      roomId: route.query.convId,
      userId: getUserInfo().id,
    })
    lastScrollTop = chatContentRef.value.scrollTop
    if (isBottom()) {
      chatContentRef.value.scrollTop = lastScrollTop - 10
    }
    updateUnread()
  }
  next()
})


const unreadMsgCount = ref(0)
const originList = ref([])
const historyList = ref([])
const msgList = ref([])
const unreadList = ref([])
const firstRenderCount = 30
const addHistoryCountOnce = 20
// 获取聊天记录
const getAllChats = () => {
  originList.value = []
  historyList.value = []
  msgList.value = []  
  unreadList.value = []
  fetchChatRecords({ convId: route.query.convId })
    .then(res => {
      let resList = res.data?.records || []
      lastReadMsgId = res.data?.last_read_msg_id
      originList.value = resList.filter(v => v.id <= lastReadMsgId)
      unreadList.value = resList.filter(v => v.id > lastReadMsgId)
      msgList.value = originList.value.splice(-firstRenderCount)
      unreadMsgCount.value = unreadList.value.length
      scrollToBottom(lastReadMsgId)
      addUnreadListObserve(unreadList.value)
    })
    .catch(() => {})
}
// 获取未读消息列表
const getUnreadList = () => {
  lastReadMsgId = getLastMsgId()
  if (lastReadMsgId) {
    fetchGetUnreadList({ convId: route.query.convId, lastReadMsgId, })
      .then(res => {
        let resList = res.data || []
        unreadList.value = resList
        unreadMsgCount.value = unreadList.value.length
        addUnreadListObserve(unreadList.value)
      })
      .catch(() => {})
  }
}
// 连接成功
const eventConnectSuccess = () => {
  if (route.name == 'ChatRoom') {
    getUnreadList()
    WS_Client.joinRoom(route.query.convId)
  }
}
// 离开房间
const leaveRoomEvent = (data) => {
  if (route.query.type == 21) {
    notify(data)
  }
}
// 进入房间
const entryRoomEvent = (data) => {
  if (route.query.type == 21) {
    notify(data)
  }
}
// 发送消息
const sendMessage = (msg) => {
  sendMsg(route.query.type, {
    content: msg,
    convId: route.query.convId,
    friendId: route.query.id,
  })
}
// 接收消息/系统消息
const eventMessage = (data) => {
  unreadList.value.push(data)
  let obj = JSON.parse(JSON.stringify(data))
  obj.type = 5
  unreadList.value.push(obj)
  if (isSelf(data.sender_id)) {
    scrollToBottom(data.id)
    updateUnreadThrottle(data.id)
  } else if (isBottom(chatContentRef.value)) {
    scrollToBottom(data.id)
    updateUnreadThrottle(data.id)
  } else {
    // 添加未读消息标识
    unreadMsgCount.value++
    addUnreadListObserve([data])
  }
}
// 未读消息进入页面监听
const addUnreadListObserve = async (arr) => {
  await nextTick()
  arr.forEach(e => {
    let el = document.querySelector(`.msg_item_${e.id}`)
    let id = e.id
    observer.add(el,  () => {
      if (unreadMsgCount.value > 0) {
        unreadMsgCount.value--
        // notify(`消息${id}已读`)
        lastReadMsgId = id
        updateUnreadThrottle(id)
      }
    })
  })
}
// 点击未读消息，滚动到底部并更新未读消息为已读
const toReadNewMsg = () => {
  scrollToBottom()
  unreadMsgCount.value = 0
  lastReadMsgId = getLastMsgId()
  updateUnread()
}
// 更新未读（节流）
const updateUnreadThrottle = throttle((id) => {
  updateUnread(id)
}, 300)
// 更新未读消息为已读
const updateUnread = (id) => {
  let lastReadMsgId = id || getLastMsgId()
  !id && (unreadMsgCount.value = 0)
  lastReadMsgId && fetchUpdateUnread({
    convId: route.query.convId,
    lastReadMsgId,
  }).catch(() => {})
}

























/******** 非核心代码 ********/ 



// 获取最后一条消息id
const getLastMsgId = () => {
  if (unreadList.value.length) {
    lastReadMsgId = unreadList.value[unreadList.value.length - 1]?.id
  } else {
    lastReadMsgId = msgList.value[msgList.value.length - 1]?.id
  }
  return lastReadMsgId
}
// 滚动到底部
const scrollToBottom = (id, options={}) => {
  nextTick(() => {
    id = id || getLastMsgId()
    let msgElement = document.querySelector(`.msg_item_${id}`)
    scrollToBottomUtil(msgElement, chatContentRef.value, options)
  })
}
// 滚动监听
const scrollEvent = () => {
  if (chatContentRef.value && chatContentRef.value.scrollTop == 0) {
    if (!originList.value.length) {
      showToast({
        message: '别滑了，一条都没有了',
        duration: 500,
      })
      return
    }
    let lastHeight = chatContentRef.value.scrollHeight
    historyList.value = [...originList.value.splice(-addHistoryCountOnce), ...historyList.value]
    nextTick(() => {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight - lastHeight
    })
  }
}
</script>

<style scoped lang="scss">
:deep(.van-nav-bar__right) {
  font-size: 28px !important;
}
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
  background-color: $base_bg_color;
  -webkit-overflow-scrolling: touch; 
}
.right_icon {
  font-size: 24px;
  font-weight: 600;
}
</style>
