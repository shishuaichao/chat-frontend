<template>
  <div class="item_box">
    <!-- 其他人 -->
    <div class="msg_other msg_item left" v-if="msgInfo.type == 'message' && userInfo.id != msgInfo.id">
      <div class="avatar">
        <img :src="msgInfo.avatar" alt="">
      </div>
      <div class="msg_box">
        <div class="nickname">{{ msgInfo.nickname }}</div>
        <div class="msg_content">{{ msgInfo.content }}</div>
      </div>
    </div>
    <!-- 自己 -->
    <div class="msg_self msg_item right" v-if="msgInfo.type == 'message' && userInfo.id == msgInfo.id">
      <div class="msg_box">
        <div class="nickname">{{ msgInfo.nickname }}</div>
        <div class="msg_content">{{ msgInfo.content }}</div>
      </div>
      <div class="avatar">
        <img :src="msgInfo.avatar" alt="">
      </div>
    </div>
    <!-- 系统消息 -->
    <div class="msg_system" v-if="msgInfo.type == 'system_msg'">
      <div class="msg_system_content">{{ msgInfo.content }}</div>
    </div>
  </div>

</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  // 消息
  msgInfo: {
    type: Object,
    required: true,
  },
  // 用户信息
  userInfo: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
  .msg_system_content {
    text-align: center;
    color: #999;
    font-size: 14px;
    margin: 10px 0;
  }
  .msg_item {
    display: flex;
    text-align: left;
    margin-bottom: 16px;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px;
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
  }
  .right .nickname {
    text-align: right;
  }
  .msg_content {
    max-width: 80%;
    position: relative;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    line-height: 1.4;
  }
  .left .msg_content::before {
    content: '';
    position: absolute;
    top: 6px;
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
    top: 6px;
    right: -5px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #20d63e;
  }
  .left .msg_content {
    background-color: #fff;
    border-radius: 4px;
  }
  .right .msg_content {
    background-color: #20d63e;
    border-radius: 4px;
  }
  
  .msg_other {
    justify-content: flex-start;
  }
  .msg_self {
    justify-content: flex-end;
  }

</style>