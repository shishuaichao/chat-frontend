<template>
  <div class="tab_container">
    <NavBar
        :title="title"
    >
      <template #right>
         <van-icon name="plus" />
      </template>
    </NavBar>
    <div class="tab_content" ref="scrollerRef">
      <div class="item_box">
        <div class="item_title" v-if="applyList.length > 0">好友申请</div>
        <ChatItem v-for="item in applyList" :key="item.id" :item="item" @applyOperate="applyOperate(item)" />
      </div>
      <div class="item_box">
        <div class="item_title" v-if="friendList.length > 0">好友列表</div>
        <ChatItem v-for="item in friendList" :key="item.id" :item="item" @handleClick="entryFriendInfo" />
      </div>
      <div class="item_box">
        <div class="item_title" v-if="groupList.length > 0">群列表</div>
        <ChatItem v-for="item in groupList" :key="item.id" :item="item" @handleClick="entryGroupInfo" />
      </div>
    </div>
  </div>
  
  
</template>·

<script setup>
import { ref, onActivated, onDeactivated } from 'vue';
import { fetchFriendList, fetchGroupList, fetchFriendsApplyList, fetchFriendAdd } from '@/api/user.js'
import ChatItem from '@/views/components/ChatItem.vue'
import router from '@/router'
import { setRemark } from '@/utils/localStorage.js'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

const route = useRoute()


// 定义标题
const title = ref('好友');
// 定义当前激活的项
// const activeNames = ref(['1', '2', '3']);
const friendList = ref([])
const groupList = ref([])
const applyList = ref([])

// 获取好友申请列表
const getFriendApplyList = () => {
  fetchFriendsApplyList()
    .then(res => {
      if (res.code === 200) {
        applyList.value = res.data || []
        applyList.value.map(e => e.type = 1)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

// 同意
const applyOperate = (item) => {
  fetchFriendAdd({ friendId: item.user_id })
    .then(() => {
      getFriendList()
      getFriendApplyList()
    })
    .catch(err => {
      console.log(err)
    })
}


// 获取好友列表
const getFriendList = () => {
  fetchFriendList()
    .then(res => {
      if (res.code === 200) {
        friendList.value = res.data || []
        friendList.value.map(item => setRemark(item.id, item.remark || item.nickname))
      }
    })
    .catch(err => {
      console.log(err)
    })
}
// 获取群列表
const getGroupList = () => {
  fetchGroupList()
    .then(res => {
      if (res.code === 200) {
        groupList.value = res.data || []
        groupList.value.map(item => {
          item.avatar = item?.avatar?.split(',')
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
}

// 进入好友信息
const entryFriendInfo = (item) => {
  router.push({
    name: 'OtherUserInfo',
    query: {
      id: item.id,
    }
  })
}
// 进入群信息
const entryGroupInfo = (item) => {
  router.push({
    name: 'ChatRoom',
    query: {
      convId: item.id,
      type: 2,
    }
  })
}


const scrollerRef = ref(null);
let lastScrollTop = 0
// 页面激活时
onActivated(() => {
  getFriendList()
  getGroupList()
  getFriendApplyList()
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

<style scoped lang="scss">
.tab_container {
  .tab_content {
    .item_box {
      .item_title {
        font-size: 14px;
        color: $chat_msg_color;
        padding: 16px 16px 4px;
        // background-color: $light_gray_color;
      }
    }
  }
}
</style>