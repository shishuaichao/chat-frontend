<template>
  <div class="tab_container">
    <van-nav-bar
      :title="title"
    >
      <template #right>
        <div ref="dropdownMenuRef">
          <van-icon name="add-o" @click="rightClick" />
          <DropdownMenu :isShow="isShow" @checkClick="checkClick" />
        </div>
      </template>
    </van-nav-bar>
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
import { IMG_REAL_URL } from '@/utils/constant';
import { useClickAway } from '@vant/use';
// import { v4 as uuidv4 } from 'uuid'
// import { fetchRegister } from '@/api/index.js'
import { WS_mitt } from '@/utils/WS_Client';
import { notify } from 'mini-notifier'
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
      // console.log('avatar', chatList.value)
      chatList.value.map(item => {
        // console.log('avatar', item.avatar, chatList.value)
        item.avatar = item.avatar?.split(',').map(v => `${IMG_REAL_URL}${v}`).join(',')
      })
    })
    .catch(err => {
      console.log('getConversationList', err)
    })
}

// 监听消息事件
const messageEvent = (data) => {
  notify(data.content)
  // getChatList()
}

onMounted(() => {
  getChatList()
})
const scrollerRef = ref(null);
let lastScrollTop = 0
// 页面激活时
onActivated(() => {
  WS_mitt.on('message', messageEvent)
  WS_mitt.on('system_message', messageEvent)
  WS_mitt.on('private_message', messageEvent)
  scrollerRef.value.scrollTop = lastScrollTop
})
// 页面失活时
onDeactivated(() => {
  WS_mitt.off('message', messageEvent)
  WS_mitt.off('system_message', messageEvent)
  WS_mitt.off('private_message', messageEvent)
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
