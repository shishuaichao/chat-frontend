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
    <div class="operate">
      
      <van-button 
        type="primary" 
        icon="chat" 
        block
        plain
        v-if="isFriendShip && !isSelf"
        >
            发消息
      </van-button>
      <van-button 
        type="primary" 
        icon="plus" 
        block
        plain
        v-if="!isFriendShip && !isSelf"
        >
          加为好友
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchUserInfo } from '@/api/index.js'

const router = useRouter()
const route = useRoute()

const isFriendShip = ref(false)
const isSelf = ref(true)

onMounted(() => {
  fetchUserInfo({ id: route.query.id })
    .then(res => {
      info.value = res.data
      isFriendShip.value = res.data.isFriendShip
      isSelf.value = localStorage.getItem('id') == route.query.id
    })
    .catch(err => {
      console.log(err)
    })
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