<template>
  <div class="chat_item" @click="$emit('handleClick', item)">
    <div class="avatar_wrapper">
      <UserImg 
        :avatarList="item.type == 2 ? item.avatar.split(',') : []"
        :avatar="item.type == 1 ? item.avatar : ''" 
      />
    </div>
    <div class="content-wrapper">
      <div class="top-row">
        <span class="name">{{ item.remark || item.nickname || item.name }}</span>
        <span class="time">{{ item.time }}</span>
      </div>
      <div class="bottom-row">
        <span class="message">{{ item.message }}</span>
        <span v-if="item.hasAttachment" class="attachment-icon">📎</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import UserImg from '@/components/UserImg.vue'



defineProps({
  item: {
    type: Object,
    default: () => ({
      avatar: [],
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
  transition: background-color 0.2s;
  .avatar_wrapper {
    position: relative;
    padding: 11px;
    box-sizing: border-box;
    
    // TODO: 聊天项红点
    // .red-dot {
    //   position: absolute;
    //   top: 10px;
    //   right: 10px;
    //   width: 8px;
    //   height: 8px;
    //   background-color: #ed3b31;
    //   border-radius: 50%;
    // }
  }

  .content-wrapper {
    flex: 1;
    min-width: 0;
    border-bottom: 1px solid #e3e2e2;
    padding: 12px 16px 12px 0;
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
}
</style>
