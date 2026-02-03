<template>
  <!-- 2. 底部固定输入框 -->
  <div class="footer">
    <!-- <van-icon class="icon icon_left" name="play-circle-o" /> -->
    <!-- <span class="icon iconfont">&#xe66c;</span> -->
     <span class="icon iconfont icon-yuyin icon_left"></span>
    <input v-model="inputMsg" type="text" class="input-box" ref="inputRef" @change="sendMessage" @keyup.enter="sendMessage" @focus="focus">
    <van-icon class="icon" name="smile-o" v-show="isSendText" @click="toSendEmoji" />
    <span class="icon iconfont icon-jianpan" v-show="!isSendText" @click="toSendText"></span>
    <van-icon class="icon" name="add-o" />
    <!-- <div class="send-btn" :class="{'disabled': inputMsg.trim() === ''}" ref="sendBtnRef" @click="sendMessage">发送</div> -->
  </div>
  <div class="footer_pad"></div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
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
// 切换发送文本和表情
const isSendText = ref(true)
const toSendEmoji = () => {
  isSendText.value = false
}
const toSendText = () => {
  isSendText.value = true
}



// 3. 绑定事件（优先用 touchstart 阻止 iOS 失焦）
// 触摸事件（移动端核心）
// const sendBtnRef = ref(null)
onMounted(() => {
  // 发送按钮引用
  // sendBtnRef.value.addEventListener('touchstart', (e) => {
  //   // 阻止默认行为：避免 iOS 触发输入框失焦
  //   e.preventDefault();
  //   sendMessage();
  // }, { passive: false });
})
</script>
<style scoped lang="scss">
/* 2. 底部固定输入框（50px） */
.footer {
    background: $footer_bg_color;
    display: flex;
    align-items: center;
    padding: $footer_input_pad_h 10px;
    z-index: 1;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    .icon {
      font-size: 30px;
      margin-left: 6px;
      color: $chat_msg_color;
    }
    .icon_left {
      margin-left: 0;
      margin-right: 6px;
    }
}
.footer_pad {
  height: $footer_input_real_h;
  width: 100%;
}

/* 输入框样式 */
.input-box {
    flex: 1;
    height: $footer_input_h;
    padding: 0 10px;
    border: 1px solid #fff;
    border-radius: 6px;
    outline: none;
    font-size: 16px;
    /* iOS 移除默认样式 */
    -webkit-appearance: none;
}
input[type="text"] {
  caret-color: #20d63e;        
}

/* 发送按钮 */
.send-btn {
    width: 60px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: #07c160;
    color: #fff;
    border-radius: 10px;
    margin-left: 10px;
    cursor: pointer;
    font-size: 14px;
}
.disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>