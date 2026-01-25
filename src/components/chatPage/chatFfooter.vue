<template>
  <!-- 2. 底部固定输入框 -->
  <div class="footer">
    <input v-model="inputMsg" type="text" class="input-box" ref="inputRef" placeholder="输入消息..." @change="sendMessage" @keyup.enter="sendMessage" @focus="focus">
    <div class="send-btn" :class="{'disabled': inputMsg.trim() === ''}" ref="sendBtnRef" @click="sendMessage">发送</div>
  </div>
  <div class="footer_pad"></div>
</template>
<script setup>
import { ref, defineEmits, onMounted } from 'vue'
const inputMsg = ref('')

const emit = defineEmits(['sendMessage', 'focus'])

const focus = () => {
  emit('focus')
}
// 输入框引用
const inputRef = ref(null)
const sendMessage = () => {
  if (inputMsg.value.trim() === '') {
    return;
  }
  // 触发发送消息的逻辑
  // console.log('发送消息:', inputMsg.value);
  emit('sendMessage', inputMsg.value)
  // 发送后清空输入框
  inputMsg.value = '';
  inputRef.value.focus(); // 聚焦
  // 延迟 0ms 利用事件循环，确保在点击事件后重新聚焦
  setTimeout(() => {
    // 强制聚焦（部分 iOS 需先触发 click 再 focus）
    inputRef.value.click(); // 模拟点击输入框（触发激活）
    inputRef.value.focus(); // 聚焦
    // 兼容 iOS 15+：强制滚动到输入框（避免键盘收起）
    inputRef.value.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, 0);
};

// 3. 绑定事件（优先用 touchstart 阻止 iOS 失焦）
// 触摸事件（移动端核心）
const sendBtnRef = ref(null)
onMounted(() => {
  // 发送按钮引用
  sendBtnRef.value.addEventListener('touchstart', (e) => {
    // 阻止默认行为：避免 iOS 触发输入框失焦
    e.preventDefault();
    sendMessage();
  }, { passive: false });
})
</script>
<style scoped>
/* 2. 底部固定输入框（50px） */
.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: #f7f7f7;
    border-top: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    padding: 0 10px;
    z-index: 999;
    /* iOS 关键：硬件加速 + 强制渲染 */
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: bottom;
    /* padding-bottom: 40px; */
}
.footer_pad {
    height: 50px;
    width: 100%;
}

/* 输入框样式 */
.input-box {
    flex: 1;
    height: 36px;
    padding: 0 10px;
    border: 1px solid #e5e5e5;
    border-radius: 18px;
    outline: none;
    font-size: 14px;
    /* iOS 移除默认样式 */
    -webkit-appearance: none;
}

/* 发送按钮 */
.send-btn {
    width: 60px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: #07c160;
    color: #fff;
    border-radius: 18px;
    margin-left: 10px;
    cursor: pointer;
    font-size: 14px;
}
.disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>