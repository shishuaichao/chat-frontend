<template>
  <div class="chat_item" @click="$emit('handleClick', item)">
    <div class="avatar_wrapper">
      <UserImg 
        :avatar="item.avatar" 
        :type="item.type"
      />
      <div class="red-dot" v-if="item.unreadCount > 0 && item.convType == 2"></div>
      <div class="red-dot red_dot_num" v-if="item.unreadCount > 0 && item.convType == 1">
        <span>{{ item.unreadCount }}</span>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="row top-row">
        <span class="name single_line" v-if="item.convType == 2">{{ item.name }} </span>
        <span class="name single_line" v-else>{{ getRemark(item.senderId) || item.senderNickname }} </span>
        <span class="time">{{ item.createTime }}</span>
      </div>
      <div class="row bottom-row">
        <span class="message single_line">
          <span class="count" v-if="item.unreadCount >= 2">[{{ item.unreadCount }}条]</span>
          <span v-if="item.convType == 2">{{ getRemark(item.senderId) || item.senderNickname }}: </span>
          <span>{{ item.content }}</span>
        </span>
        <span class="attachment-icon" v-if="item.convType == 10">
          <van-icon name="fire-o" color="#ee0a24" />
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getRemark } from '@/utils/localStorage';
import UserImg from '@/views/components/UserImg.vue'



defineProps({
  item: {
    type: Object,
    default: () => ({
      avatar: '',
      name: '',
      time: '',
      message: '',
      hasAttachment: false,
      hasRedDot: false,
    }),
  },
})
</script>

<style scoped lang="scss">
.chat_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.2s;
  background-color: #fff;
  position: relative;
  padding: 0 6px;
  width: 100%;
  .avatar_wrapper {
    position: relative;
    padding: 11px;
    box-sizing: border-box;
    height: 72px;

    // 聊天项红点
    .red-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 9px;
      height: 9px;
      background-color: $msg_notice_color;
      border-radius: 50%;
      color: #fff;
      font-size: 8px;
      line-height: 14px;
      text-align: center;
    }
    .red_dot_num {
      width: 16px;
      height: 16px;
      top: 4px;
      right: 4px;
      line-height: 15px;
      font-size: 10px;
    }
  }
  
  .content-wrapper {
    flex: 1;
    border-bottom: 0.5px solid #e3e2e2;
    min-width: 0;
    padding: 12px 16px 12px 0px;
    height: 72px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .row {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .top-row {
      margin-bottom: 2px;
      .name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        width: calc(100% - 60px);
      }
      .time {
        font-size: 12px;
        color: $chat_sys_msg_color;
      }
    }
    .bottom-row {
      .message {
        width: calc(100% - 30px);
        font-size: 12px;
        color: $chat_sys_msg_color;
        .count {
          position: relative;
          top: -1px;
          margin-right: 2px;
        }
      }
      // .attachment-icon {
      //   font-size: 12px;
      //   color: #999;
      //   margin-left: 4px;
      // }
    }
    

    

    

    
  }
  .agree {
    width: 50px;
    position: absolute;
    top: calc(50% - 16px);
    right: 20px;
    z-index: 1;
  }
}
</style>
