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

    <!-- <van-button type="primary" block @click="addConv(10)">新增10个群聊</van-button> -->
    <!-- <van-button type="primary" block @click="addUser(10)">新增10个用户</van-button> -->
  </div>
</template>
<script setup>
import { ref, onActivated, onDeactivated, onMounted } from 'vue';
import ChatItem from '@/views/components/ChatItem.vue';
import DropdownMenu from '@/views/components/DropdownMenu.vue';
import { 
  getConversationList,
  fetchJoinConversation,
} from '@/api/index.js'
import router from '@/router';
import { useClickAway } from '@vant/use';
// import { v4 as uuidv4 } from 'uuid'
// import { fetchRegister } from '@/api/index.js'
import { WS_mitt } from '@/utils/WS_Client';
// import { notify } from 'mini-notifier'
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
  fetchJoinConversation({ convId: item.id, })  
    .then(res => {
      console.log('fetchJoinConversation', res)
      router.push({
        name: 'ChatRoom',
        query: {
          convId: item.id,
          type: item.type,
        }
      })
    })
    .catch(err => {
      console.log('fetchJoinConversation', err)
    })
  
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
    if (chatList.value[i].id == item.convId) {
      console.log('chatList.value[i]', chatList.value[i])
      chatList.value[i] = {
        ...chatList.value[i],
        unreadMsgCount: chatList.value[i].unreadMsgCount ? chatList.value[i].unreadMsgCount + 1 : 1,
        lastMsg: item.content,
        lastMsgTime: item.created_at,
        lastMsgSender: item.sender_id,
        lastMsgType: item.type,
      }
      break
    }
  }
}

// 监听消息事件
const messageEvent = (data) => {
  console.log('group_message', data)
  // notify(
  //   `
  //   sender_id: ${data.sender_id}
  //   内容：${data.content}
  //   type: ${data.type}
  //   created_at: ${data.created_at}
  //   convId: ${data.convId}
  //   `
  //   , {
  //     duration: 5000,
  //   }
  // )
  updateChatItem(data)
}

onMounted(() => {
  getChatList()
})
const scrollerRef = ref(null);
let lastScrollTop = 0

// 页面激活时
onActivated(() => {
  WS_mitt.on('group_message', messageEvent)
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
