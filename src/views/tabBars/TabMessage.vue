<template>
  <div class="tab_container">
    <NavBar
      :title="title"
    >
      <template #right>
        <div ref="dropdownMenuRef">
          <van-icon name="add-o" @click="rightClick" />
          <DropdownMenu :isShow="isShow" @checkClick="checkClick" />
        </div>
      </template>
    </NavBar>
    <div class="tab_content" ref="scrollerRef">
      <ChatItem v-for="(item, index) in chatList" :key="index" :item="item" @handleClick="entryChat" />
    </div>

  </div>
</template>
<script setup>
import { ref, onActivated, onDeactivated, onMounted } from 'vue';
import ChatItem from '@/views/components/ChatItem.vue';
import DropdownMenu from '@/views/components/DropdownMenu.vue';
import { 
  getConversationList,
  // fetchJoinConversation,
} from '@/api/index.js'
import router from '@/router';
import { useClickAway } from '@vant/use';
import { WS_mitt } from '@/utils/WS_Client';
import { onBeforeRouteLeave, useRoute } from 'vue-router'

const route = useRoute()

// 点击下拉菜单
const isShow = ref(false)
const checkClick = (item) => {
  isShow.value = false
  console.log(item)
}
const rightClick = () => {
  isShow.value = !isShow.value
}
const dropdownMenuRef = ref(null);
useClickAway(dropdownMenuRef, () => {
  console.log('click outside!');
  isShow.value = false
});

// 定义标题
const title = ref('消息');

// 进入聊天
const entryChat = (item) => {
  item.unreadCount = 0
  router.push({
    name: 'ChatRoom',
    query: {
      convId: item.convId,
      type: item.convType,
    }
  })
  // fetchJoinConversation({ convId: item.convId, })  
  //   .then(() => {
      
  //   })
  //   .catch(err => {
  //     console.log('fetchJoinConversation', err)
  //   })
}

const chatList = ref([]);
const getChatList = () => {
  getConversationList()
    .then(res => {
      chatList.value = res.data
    })
    .catch(err => {
      console.log('getConversationList', err)
    })
}

// 监听消息，修改列表中显示的样式，
// 增加未读消息数量，更新最后一条消息，
const updateChatItem = (item) => {
  for (let i = 0; i < chatList.value.length; i++) {
    if (chatList.value[i].convId == item.convId) {
      console.log('chatList.value[i]', chatList.value[i])
      chatList.value[i] = {
        ...chatList.value[i],
        unreadCount: chatList.value[i].unreadCount + 1,
        content: item.content,
        createTime: item.createTime,
        senderId: item.senderId,
        senderNickname: item.senderNickname,
        msgType: item.msgType,
        convType: item.convType,
      }
      break
    }
  }
}

// 监听消息事件
const messageEvent = (data) => {
  // console.log('notice_message', data)
  updateChatItem(data)
}

onMounted(() => {
  WS_mitt.on('notice_message', messageEvent)
})
const scrollerRef = ref(null);
let lastScrollTop = 0

// 页面激活时
onActivated(() => {
  getChatList()
  scrollerRef.value.scrollTop = lastScrollTop
})
// 页面失活时
onDeactivated(() => {
  
})
// 离开页面前
onBeforeRouteLeave((to, from, next) => {
  if (from.name == route.name) {  
    lastScrollTop = scrollerRef.value.scrollTop
  }
  next()
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
