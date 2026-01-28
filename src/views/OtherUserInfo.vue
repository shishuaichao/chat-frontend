<template>
  <div>
    <van-nav-bar
      title=""
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="info_box">
      <van-image
        class="avatar"
        :src="info.avatar"
      />
      <div class="info">
        <div class="nickname">{{ info.nickname }}</div>
        <div class="userId">ID: {{ info.username }}</div>
      </div>
    </div>
    <div class="operate" v-if="!isSelf">
      <van-button 
        type="primary" 
        icon="chat" 
        block
        plain
        v-if="friendShipStatus == 1"
        @click="clickChat"
        >
            发消息
      </van-button>
      <van-button 
        type="primary" 
        icon="plus" 
        block
        plain
        v-if="friendShipStatus == null"
        @click="addFriend"
        >
          加为好友
      </van-button>
      <van-button 
        type="primary" block plain
        v-if="friendShipStatus == 3"
        >
          已申请，等待确认
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { 
  fetchUserInfo, 
  fetchFriendAdd, 
} from '@/api/index.js'


const router = useRouter()
const route = useRoute()

const friendShipStatus = ref(null)
const isSelf = ref(localStorage.getItem('id') == route.query.id)
// 点击聊天
const clickChat = () => {
  router.push({
    name: 'ChatRoom',
    query: {
      convId: '1',
    }
  })
}



const addFriend = () => {
  fetchFriendAdd({ friendId: route.query.id })
    .then((res) => {
      friendShipStatus.value = res?.data?.friendshipsStatus
      showToast(res?.msg)
    })
    .catch(err => {
      console.log(err)
      showToast(err.msg)
    })
}

const getOtherUserInfo = () => {
  fetchUserInfo({ id: route.query.id })
    .then(res => {
      info.value = res.data || {}
      friendShipStatus.value = res?.data?.friendshipsStatus
    })
    .catch(err => {
      console.log(err)
    })
}

onMounted(() => {
  getOtherUserInfo()
}) 

const info = ref({})



const onClickLeft = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.info_box {
  display: flex;
  align-items: center;
  padding: 20px;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  overflow: hidden;
  display: block;
}
.info {
  flex: 1;
  margin-left: 20px;
}
.nickname {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.userId {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}
.operate {
  padding: 20px;
}
</style>