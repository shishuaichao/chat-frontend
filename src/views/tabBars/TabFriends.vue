<template>
  <van-nav-bar
      :title="title"
    />
  <van-collapse v-model="activeNames">
    <van-collapse-item title="好友申请" name="1">
      <ChatItem v-for="item in applyList" :key="item.id" :item="item" @applyOperate="applyOperate" />
    </van-collapse-item>
    <van-collapse-item title="好友列表" name="2">
      <ChatItem v-for="item in friendList" :key="item.id" :item="item" @handleClick="entryFriendInfo" />
    </van-collapse-item>
    <van-collapse-item title="群列表" name="3">
      <ChatItem v-for="item in groupList" :key="item.id" :item="item" @handleClick="entryGroupInfo" />
    </van-collapse-item>
  </van-collapse>
</template>

<script setup>
import { ref, onActivated } from 'vue';
import { fetchFriendList, fetchGroupList, fetchFriendsApplyList, fetchFriendAdd } from '@/api/user.js'
import ChatItem from '@/views/components/ChatItem.vue'
import router from '@/router'
import { setRemark } from '@/utils/localStorage.js'
// import { showToast } from 'vant'


// 定义标题
const title = ref('好友');
// 定义当前激活的项
const activeNames = ref(['1', '2', '3']);
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
      id: item.id,
    }
  })
}

onActivated(() => {
  getFriendList()
  getGroupList()
  getFriendApplyList()
})
</script>

<style scoped lang="scss">
:deep(.van-collapse-item__content) {
  padding: 0;
}
</style>