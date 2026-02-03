<template>
  <div class="msg_item_box"
    :class="`msg_item_${msgInfo.id}`"
    :data-msg-id="msgInfo.id"
    ref="msgItemRef"
    >
    <!-- 自己 -->
    <div class="msg_self msg_item right" 
      v-if="userInfo?.id == msgInfo.sender_id">
      <div class="msg_box">
        <!-- <div class="nickname"> 
          ID: {{ msgInfo.id }} 
          {{ msgInfo.created_at }}
        </div> -->
        <div class="msg_content">{{ msgInfo.content }}</div>
      </div>
      <div class="avatar" @click="handleClickUserInfo(msgInfo)">
        <img v-once :src="msgInfo.avatar" alt="">
      </div>
    </div>
    <!-- 其他人 -->
    <div class="msg_other msg_item left" v-else>
      <div class="avatar" @click="handleClickUserInfo(msgInfo)">
        <img v-once :src="msgInfo.avatar" alt="">
      </div>
      <div class="msg_box">
        <div class="nickname">
          <span>{{ getRemark(msgInfo.sender_id) }}</span>
          <!-- {{ msgInfo.created_at }} -->
        <!-- ID: {{ msgInfo.id }} -->
        </div>
        <div class="msg_content">{{ msgInfo.content }}</div>
      </div>
    </div>
    <!-- 系统消息 -->
    <div class="msg_system" v-if="msgInfo.type == 5">
      <div class="msg_system_content">{{ msgInfo.content }}</div>
    </div>
  </div>

</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'
import { getRemark } from '@/utils/localStorage';
import { getUserInfo } from '@/utils/utils';

const router = useRouter()

defineProps({
  // 消息
  msgInfo: {
    type: Object,
    required: true,
  },
});

const msgItemRef = ref(null)
defineExpose({
  msgItemRef,
})


const handleClickUserInfo = (msgInfo) => {
  router.push({
    name: 'OtherUserInfo',
    query: {
      id: msgInfo.sender_id,
    }
  })
}

const userInfo = ref({})
onMounted(() => {
  userInfo.value = getUserInfo()
})
</script>

<style scoped lang="scss">
.msg_item_box {
  .msg_system_content {
    text-align: center;
    color: #999;
    font-size: 12px;
    margin: 10px auto 20px;
    width: 80%;
    line-height: 16px;
  }
  .msg_item {
    display: flex;
    text-align: left;
    padding-bottom: 16px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    overflow: hidden;
    margin: 0 10px;
    flex-shrink: 0;
    background-color: #f0f0f0;
  }
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .msg_box {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .left .msg_box {
    flex-direction: row;
  }
  .right .msg_box {
    flex-direction: row-reverse; 
  }

  .nickname {
    font-size: 12px;
    color: #999;
    height: 14px;
    line-height: 10px;
    width: 100%;
    font-weight: 500;
    span {
      color: #666;

    }
  }
  .right .nickname {
    text-align: right;
  }
  .msg_content {
    min-width: 48px;
    max-width: 80%;
    position: relative;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    line-height: 1.5;
    word-break: break-word;
    color: $chat_msg_color;
    font-size: 16px;
  }
  .left .msg_content::before {
    content: '';
    position: absolute;
    top: 8px;
    left: -5px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid #fff;
  }
  .right .msg_content::before {
    content: '';
    position: absolute;
    top: 8px;
    right: -5px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid $chat_pop_color;
  }
  .left .msg_content {
    background-color: #fff;
    border-radius: 4px;
  }
  .right .msg_content {
    background-color: $chat_pop_color;
    border-radius: 4px;
  }
  
  .msg_other {
    justify-content: flex-start;
  }
  .msg_self {
    justify-content: flex-end;
  }
}
</style>