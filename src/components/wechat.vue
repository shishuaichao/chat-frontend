
<template>
  <div class="wechat-chat-container">
    <!-- 头部区域 -->
    <div class="chat-header">
      <div class="header-left">
        <button class="header-btn back-btn">
          <span class="icon-arrow-left">←</span>
        </button>
      </div>
      <div class="header-center">
        <h2 class="chat-title">摸鱼群聊</h2>
      </div>
      <div class="header-right">
        <button class="header-btn more-btn">
          <span class="icon-more">...</span>
        </button>
      </div>
    </div>

    <!-- 消息区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <!-- 时间戳 -->
      <div class="message-time" v-if="messages.length > 0">
        <span>{{ currentDate }}</span>
      </div>

      <!-- 消息列表 -->
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        class="message-item"
        :class="{ 'message-sent': message.isSent, 'message-received': !message.isSent }"
      >
        <!-- 头像 -->
        <div class="message-avatar">
          <div class="avatar">{{ message.isSent ? '我' : '对方' }}</div>
        </div>

        <!-- 消息内容 -->
        <div class="message-content">
          <div class="message-bubble">
            {{ message.text }}
          </div>
          <!-- 消息时间 -->
          <div class="message-time-small">
            {{ formatTime(message.time) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-area">
      <div class="input-container">
        <button class="input-btn emoji-btn">
          <span class="icon-emoji">😊</span>
        </button>
        <textarea 
          v-model="inputText" 
          class="message-input"
          placeholder="输入消息..."
          @keydown.enter.prevent="sendMessage"
          rows="1"
        ></textarea>
        <button 
          class="input-btn send-btn"
          :disabled="!inputText.trim()"
          @click="sendMessage"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'

export default {
  name: 'WeChatChat',
  setup() {
    const messages = ref([
      { text: '你好！', isSent: false, time: new Date() - 3600000 },
      { text: '你好，有什么可以帮助你的？', isSent: true, time: new Date() - 3500000 },
      { text: '我想了解一下Vue组件开发我想了解一下Vue组件开发我想了解一下Vue组件开发我想了解一下Vue组件开发', isSent: false, time: new Date() - 3400000 },
      { text: '当然可以，Vue组件是Vue.js的核心概念之一...', isSent: true, time: new Date() - 3300000 },
      { text: '非常感谢你的帮助！', isSent: false, time: new Date() - 3200000 },
      { text: '不客气，有问题随时问我！', isSent: true, time: new Date() - 3100000 }
    ])
    
    const inputText = ref('')
    const messagesContainer = ref(null)

    // 格式化时间
    const formatTime = (time) => {
      const date = new Date(time)
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    // 当前日期
    const currentDate = computed(() => {
      const date = new Date()
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    })

    // 发送消息
    const sendMessage = () => {
      if (inputText.value.trim()) {
        messages.value.push({
          text: inputText.value.trim(),
          isSent: true,
          time: new Date()
        })
        inputText.value = ''
        scrollToBottom()
      }
    }

    // 滚动到底部
    const scrollToBottom = () => {
      setTimeout(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      }, 0)
    }

    // 监听消息变化，自动滚动到底部
    watch(messages, () => {
      scrollToBottom()
    }, { deep: true })

    onMounted(() => {
      scrollToBottom()
    })

    return {
      messages,
      inputText,
      messagesContainer,
      formatTime,
      currentDate,
      sendMessage
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.wechat-chat-container {
  width: 100%;
  max-width: 480px;
  height: 100vh;
  margin: 0 auto;
  background-color: #e5ddd5;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 头部样式 */
.chat-header {
  background-color: #f7f7f7;
  border-bottom: 1px solid #ddd;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  flex-shrink: 0;
}

.header-left, .header-right {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-center {
  flex: 1;
  text-align: center;
}

.chat-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #333;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 消息区域样式 */
.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 时间戳 */
.message-time {
  text-align: center;
  margin: 10px 0;
}

.message-time span {
  background-color: rgba(0, 0, 0, 0.15);
  color: white;
  padding: 4px 12px;
  border-radius: 10px;
  font-size: 12px;
}

/* 消息项 */
.message-item {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 10px;
}

.message-received {
  flex-direction: row;
}

.message-sent {
  flex-direction: row-reverse;
}

/* 头像 */
.message-avatar {
  flex-shrink: 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

/* 消息内容 */
.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.message-received .message-content {
  align-items: flex-start;
}

.message-sent .message-content {
  align-items: flex-end;
}

/* 消息气泡 */
.message-bubble {
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 16px;
  line-height: 1.4;
  word-wrap: break-word;
  position: relative;
}

.message-received .message-bubble {
  background-color: white;
  border-bottom-left-radius: 4px;
}

.message-sent .message-bubble {
  background-color: #dcf8c6;
  border-bottom-right-radius: 4px;
}

/* 消息时间 */
.message-time-small {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

/* 输入区域样式 */
.chat-input-area {
  background-color: #f7f7f7;
  border-top: 1px solid #ddd;
  padding: 10px 15px;
  flex-shrink: 0;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.input-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.input-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.message-input {
  flex: 1;
  border: none;
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 16px;
  resize: none;
  max-height: 120px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-input:focus {
  outline: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.send-btn {
  background-color: #07c160;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 20px;
  padding: 8px 16px;
  width: auto;
}

.send-btn:hover:not(:disabled) {
  background-color: #06b255;
}

.send-btn:disabled {
  background-color: #b3e59f;
  cursor: not-allowed;
}
</style>
