<template>
  <div class="chat_item" @click="$emit('handleClick', item)">
    <div class="avatar_wrapper">
      <UserImg 
        :avatar="item.avatar" 
        :type="item.type"
      />
      <div class="red-dot" v-if="item.unreadMsgCount">
        {{ item.unreadMsgCount }}
      </div>
    </div>
    <!-- lastMsg: item.lastMsg,
        lastMsgTime: item.created_at,
        lastMsgSender: item.sender_id,
        lastMsgType: item.type, 
        unreadMsgCount
        -->
    <div class="content-wrapper">
      <div class="top-row">
        <span class="name">{{ item.remark || item.nickname || item.name }}</span>
        <span class="time">{{ item.lastMsgTime }}</span>
      </div>
      <div class="bottom-row">
        <span class="message">13123{{ item.lastMsg }}</span>
        <span v-if="item.hasAttachment" class="attachment-icon">📎</span>
      </div>
    </div>
    <van-button 
      v-if="item.status == 3"
      size="mini" 
      class="agree"
      type="primary" @click="$emit('applyOperate', item)">同&nbsp;&nbsp;意</van-button>
  </div>
</template>
<script setup>
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
  .avatar_wrapper {
    position: relative;
    padding: 11px;
    box-sizing: border-box;
    height: 72px;

    // 聊天项红点
    .red-dot {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 8px;
      height: 8px;
      background-color: #ed3b31;
      border-radius: 50%;
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
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .name {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .time {
      font-size: 10px;
      color: #999;
    }

    .bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .message {
      font-size: 13px;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .attachment-icon {
      font-size: 12px;
      color: #999;
      margin-left: 4px;
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
