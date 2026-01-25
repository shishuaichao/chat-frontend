<template>
  <div class="chat_room_box">
    <indexSetting @canLink="linkStart" ref="indexSettingRef" v-show="settingShow"></indexSetting>
    <div class="main_container" v-show="!settingShow">
      <chatHeader :onlineUser="onlineUser"  @setInfo="setUserInfo"></chatHeader>
      <div class="chat_content_box" ref="chatContent">
        <chatItem v-for="v,i in msgList" :key="i" :msgInfo="v" :userInfo="userInfo"></chatItem>
      </div>
      <chartFooter @sendMessage="sendMsg"  @focus="scrollToBottom" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import io from 'socket.io-client'
import moment from 'moment'
import axios from 'axios'
import { showToast } from 'vant';
import chatHeader from '@/components/chatPage/chatHeader.vue';
import chartFooter from '@/components/chatPage/chatFfooter.vue';
import chatItem from '@/components/chatPage/chatItem.vue';
import indexSetting from '@/components/setting/indexSetting.vue';

export default {
  name: 'ChatRoom',
  components: {
    chatHeader,
    chartFooter,
    chatItem,
    indexSetting,
  },
  props: {
    msg: String
  },
  setup() {
    const settingShow = ref(true)
    
    let ws = null
    const onlineUser = ref([])
    const userInfo = ref({})
    const linkStart = (info) => {
      ws?.close()
      userInfo.value = info
      settingShow.value = false
      ws = io('http://172.20.10.2:5000', {
        withCredentials: true, // 若后端有cookie鉴权需开启，否则可省略
        transports: ['websocket']
      })
      // 链接成功 
      ws.on('connect_success', (sid) => {
        console.log('连接成功，sid：', sid)
        ws.emit('set_nickname', { ...userInfo.value })
        getAllChats()
      })
      // 昵称设置成功 
      ws.on('username_success', (data) => {
        console.log('昵称设置成功', data)
      })
      // 聊天消息
      ws.on('message', (data) => {
        console.log('普通消息：', data)
        
        render(data)
      })
      // 系统消息
      ws.on('system_msg', (data) => {
        console.log('系统消息：', data)
        if (data.id !== userInfo.value.id) {
          showToast(data.content);
          render(data)
        }
      })
      // 在线人数
      ws.on('online_count', (data) => {
        // console.log('在线人数：', data)
        onlineUser.value = data
      })
    }

    // 设置用户信息
    const setUserInfo = (type) => {
      settingShow.value = true
      ws?.close()
      if (type === 'nickname') {
        indexSettingRef.value.setNickname()
      } else if (type === 'avatar') {
        indexSettingRef.value.setAvatar()
      }
    }

    // 滚动到底部
    const chatContent = ref(null)
    const scrollToBottom = () => {
      if (!chatContent.value) return;
      nextTick(() => {
        chatContent.value.scrollTop = chatContent.value.scrollHeight
      })
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
      console.log('sendMsg1111', userInfo.value )
      ws.emit('message', msgData)
    }

    // 1. 核心监听：visibilitychange 事件（通用所有浏览器）
    document.addEventListener('visibilitychange', () => {
      // document.hidden 为 true 表示页面不可见（切后台），false 表示可见（切前台）
      console.log('visibilitychange', document.hidden)
      if (document.hidden) {
        // 切到后台
        ws.close()
      } else {
        // 切到前台
        indexSettingRef.value.checkUser()
      }
    });


    const indexSettingRef = ref(null)
    onMounted(() => {
      indexSettingRef.value.checkUser()
      chatContent.value.addEventListener('scroll', () => {
        if (!originList.value.length) return
        if (chatContent.value.scrollTop == 0) {
          let lastHeight = chatContent.value.scrollHeight
          let newArr = originList.value.splice(-30)
          msgList.value = [...newArr, ...msgList.value]
          nextTick(() => {
            chatContent.value.scrollTop = chatContent.value.scrollHeight - lastHeight
          })
        }
      })
    })
    return {
      settingShow,
      msgList,
      moment,
      userInfo,
      onlineUser,
      sendMsg,
      chatContent,
      linkStart,
      indexSettingRef,
      setUserInfo,
      scrollToBottom,
    }
  }

  
}
</script>

<style scoped>
/* 核心 CSS：禁用全局滚动 */
html, body {
  height: 100%; /* 改用 100% 而非 100vh，基于父容器高度计算 */
  overflow: hidden; /* 禁用整体滚动 */
  -webkit-overflow-scrolling: touch; /* 保留子元素的顺滑滚动 */
  position: fixed; /* 固定页面，避免偏移 */
  width: 100%; /* 确保宽度满屏 */
}
.chat_room_box {
  height: 100%; 
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
  padding: 60px 6px 30px;
  background-color: #f4f4f4;
}

</style>
