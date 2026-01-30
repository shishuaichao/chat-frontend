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
        :src="userInfo.avatar"
      />
      <div class="info">
        <div class="edit_remarkname flex" v-if="isEdit">
          <van-field v-model="remarkname" type="text" autofocus placeholder="备注名..."/>
          <van-button type="primary" size="mini" plain @click="saveRemarkname('cancel')"> 取 消</van-button>
          <van-button type="primary" size="mini" :disabled="remarkname.trim().length == 0" @click="saveRemarkname" > 保 存 </van-button>
        </div>
        <div class="nickname flex align_items_center" v-else>
          {{ userInfo.remark || userInfo.nickname }}
          <div class="edit_icon" v-if="friendShipStatus == 1" @click="editRemarkname">
            <van-icon name="edit" />
          </div>
        </div>
        <div class="userId">昵称: {{ userInfo.nickname }}</div>
        <div class="userId">ID: {{ $route.query.id }}</div>
      </div>
    </div>
    <div class="operate" v-if="!isSelf">
      <van-button type="primary" icon="chat" block plain v-if="friendShipStatus == 1 && userInfo.convId != null" @click="clickChat"> 发消息 </van-button> 
      <van-button type="primary" icon="plus" block plain v-if="friendShipStatus == null" @click="addFriend"> 加为好友 </van-button> 
      <van-button type="primary" block plain v-if="friendShipStatus == 3"> 已申请，等待确认 </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
  import { showToast } from 'vant'
import { 
  fetchFriendInfo, 
  fetchFriendAdd, 
  fetchRemarkname,
} from '@/api/user.js'
import { fetchCreateConversation } from '@/api/chat.js'
import { setRemark } from '@/utils/localStorage.js'





const router = useRouter()
const route = useRoute()

const friendShipStatus = ref(null)
const isSelf = ref(localStorage.getItem('id') == route.query.id)

const entryChat = (convId) => {
  router.push({
    name: 'ChatRoom',
    query: {
      convId: convId,
      type: 1,
    }
  })
}

// 点击聊天
const clickChat = () => {
  if (userInfo.value.convId) {
    entryChat(userInfo.value.convId)
  } 
}
const remarkname = ref('')
const isEdit = ref(false)
// 编辑备注名
const editRemarkname = () => {
  isEdit.value = true
  remarkname.value = userInfo.value.remark || userInfo.value.nickname
}

// 保存备注名
const saveRemarkname = (type) => {
  if (type == 'cancel') {
    isEdit.value = false
    return
  }
  if (remarkname.value.trim().length > 10) {
    showToast('请输入备注名（10个字符以内）')
    return
  }
  fetchRemarkname({
    friendId: route.query.id,
    remark: remarkname.value,
  })
    .then(() => {
      isEdit.value = false
      showToast('备注成功')
      userInfo.value.remark = remarkname.value
      setRemark(route.query.id, remarkname.value)
    })
    .catch(err => {
      console.log(err)
      showToast(err.msg)
    })
}

const addFriend = () => {
  fetchFriendAdd({ friendId: route.query.id })
    .then((res) => {
      friendShipStatus.value = res.data.status
      console.log('friendShipStatus.value', res.data)
      showToast(res?.msg)
      if (friendShipStatus.value != 3) {
        createConversation()
      }
    })
    .catch(err => {
      console.log(err)
      showToast(err.msg)
    })
}

// 创建聊天会话
const createConversation = () => {
  fetchCreateConversation({
    friendId: route.query.id,
    memberIds: [
      { id: localStorage.getItem('id'), type: 1, },
      { id: route.query.id, type: 1, },
    ],
    type: 1,
  })
    .then(() => {
      getOtherUserInfo()
    })
    .catch(err => {
      console.log(err)
      showToast(err.msg)
    })
}



const getOtherUserInfo = () => {
  fetchFriendInfo({ id: route.query.id })
    .then(res => {
      userInfo.value = res.data || {}
      friendShipStatus.value = res?.data?.friendshipsStatus
    })
    .catch(err => {
      console.log(err)
    })
}

onActivated(() => {
  getOtherUserInfo()
}) 

const userInfo = ref({})



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
  .edit_icon {
    font-size: 14px;
    color: #999;
    margin-left: 8px;
  }
  
}
:deep(.van-field) {
  width: 110px !important;
  padding: 0;
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