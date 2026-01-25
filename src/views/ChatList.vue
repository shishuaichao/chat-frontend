<template>
  <div class="chat-list-container">
    <!-- 单个聊天项 -->
    <div class="chat-item" v-for="(item, index) in chatList" :key="index">
      <div class="avatar-wrapper">
        <img :src="item.avatar" class="avatar" alt="avatar" />
        <span v-if="item.hasRedDot" class="red-dot"></span>
      </div>
      <div class="content-wrapper">
        <div class="top-row">
          <span class="name">{{ item.name }}</span>
          <span class="time">{{ item.time }}</span>
        </div>
        <div class="bottom-row">
          <span class="message">{{ item.message }}</span>
          <span v-if="item.hasAttachment" class="attachment-icon">📎</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const chatList = ref([
  {
    avatar: 'https://via.placeholder.com/60',
    name: '徐海花',
    message: '[动画表情]',
    time: '昨天 11:31',
    hasRedDot: false,
    hasAttachment: false
  },
  {
    avatar: 'https://via.placeholder.com/60',
    name: '郑鹏',
    message: '来吧',
    time: '星期五',
    hasRedDot: false,
    hasAttachment: false
  },
  {
    avatar: 'https://via.placeholder.com/60/4A90E2',
    name: 'QQ Mail',
    message: 'ChatGPT: Write faster with ChatGPT',
    time: '星期五',
    hasRedDot: true,
    hasAttachment: true
  },
  {
    avatar: 'https://via.placeholder.com/60',
    name: '12月20日遇见7周年活动群',
    message: '勇爸: [链接] 冬天零下5度跑步，是一场双向博弈',
    time: '星期五',
    hasRedDot: true,
    hasAttachment: true
  },
  {
    avatar: 'https://via.placeholder.com/60',
    name: '有知有行金钱魔法师🐍',
    message: '[2条] "夏天" recalled a message',
    time: '星期四',
    hasRedDot: true,
    hasAttachment: false
  },
  {
    avatar: 'https://via.placeholder.com/60',
    name: '丁瀚林17671759875',
    message: '我到食堂了',
    time: '星期四',
    hasRedDot: false,
    hasAttachment: false
  }
]);
</script>

<style scoped>
.chat-list-container {
  width: 100%;
  max-width: 480px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background-color: #f9f9f9;
}

.avatar-wrapper {
  position: relative;
  margin-right: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
}

.red-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #ff3b30;
  border-radius: 50%;
}

.content-wrapper {
  flex: 1;
  min-width: 0;
}

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
  font-size: 12px;
  color: #999;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message {
  font-size: 14px;
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
</style>