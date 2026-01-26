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
        :src="info.userAvatar"
      />
      <div class="info">
        <div class="nickname">{{ info.userName }}</div>
        <div class="userId">ID: {{ info.userId }}</div>
      </div>
    </div>
    <div class="operate">
      <!-- <van-button 
        type="primary" 
        icon="plus" 
        block
        plain
        >
          加为好友
      </van-button> -->
      <van-button 
        type="primary" 
        icon="chat" 
        block
        plain
        >
            发消息
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const info = ref({
  userId: route.query.userId,
  userAvatar: decodeURIComponent(route.query.userAvatar),
  userName: route.query.userName,
})



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