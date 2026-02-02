<template>
  <div class="tab_msg_box">
    <van-nav-bar
      :title="title"
    >
      <template #right>
        <div  ref="dropdownMenuRef">
          <van-icon name="add-o" @click="rightClick" />
          <DropdownMenu :isShow="isShow" @checkClick="checkClick" />
        </div>
      </template>
    </van-nav-bar>
    <div class="conv_list_box">
      <ChatList :chatList="chatList" @handleClick="entryChat" />
    </div>

    <!-- <van-button type="primary" block @click="addConv(10)">新增10个群聊</van-button> -->
    <!-- <van-button type="primary" block @click="addUser(10)">新增10个用户</van-button> -->
  </div>
</template>
<script setup>
import { ref, onActivated } from 'vue';
import ChatList from '@/views/components/ChatList.vue';
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
onActivated(() => {
  

  console.log('TabMessage mounted')
  getConversationList()
    .then(res => {
      chatList.value = res.data
      console.log('avatar', chatList.value)
      chatList.value.map(item => {
        console.log('avatar', item.avatar, chatList.value)
        item.avatar = item.avatar.split(',').map(v => `${IMG_REAL_URL}${v}`).join(',')
      })
    })
    .catch(err => {
      console.log('getConversationList', err)
    })
})
</script>
<!-- 新增普通script标签，声明组件name -->
<script>
export default {
  name: 'TabMessage'
}
</script>

<style scoped lang="scss">
.tab_msg_box {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  .conv_list_box {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
