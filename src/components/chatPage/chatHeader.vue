<template>
  <!-- 1. 顶部固定导航栏 -->
  <van-popup v-model:show="showTop" position="top">
    <van-grid :border="false" :column-num="3">
      <van-grid-item :text="v.nickname" v-for="v,i in onlineUser" :key="i">
        <van-image
          :src="v.avatar"
        />
        <div class="nickname">{{ v.nickname }}</div>
      </van-grid-item>
    </van-grid>
  </van-popup>
  <div class="header">
    <div class="left"> 
      设置
    </div>
    <div class="title" @click="showTop = true">
        聊天室（{{ onlineUser.length }}）
    </div>
    <div class="right">
      <div class="setting" @click="showSetting = !showSetting">设置</div>
      <div class="setting_box" v-if="showSetting">
        <div class="set">
          <button 
            class="submit-btn"
             @click.stop="setInfo('nickname')"
          > 设置昵称 </button>
        </div>
        <div class="set">
          <button 
            class="submit-btn"
             @click.stop="setInfo('avatar')"
          > 设置头像 </button>
        </div>
      </div>
    </div>
  </div>
  <div class="header_pad"></div>
</template>

<script setup>
import { ref } from 'vue';

// 仅保留核心配置：文字、高度、背景色
defineProps({
  // 中间显示的文字
  onlineUser: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(['setInfo']);
const setInfo = (type) => {
  showSetting.value = false
  emit('setInfo', type)
}
const showTop = ref(false)

const showSetting = ref(false)

</script>

<style scoped lang="scss">
/* 1. 顶部固定导航栏（50px） */
.nickname {
  font-size: 12px;
  margin-top: 4px;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  line-height: 50px;
  background: #f7f7f7;
  /* opacity: 0.8; */
  border-bottom: 1px solid #e5e5e5;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  z-index: 999;
  /* iOS 关键：硬件加速 + 强制渲染 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: top;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}
.header_pad {
  /* height: 50px; */
  width: 100%;
}
.left {
  opacity: 0;
}
.right {
  position: relative;
  font-size: 14px;
  .setting_box {
    background: #fff;
    position: absolute;
    top: 60px;
    right: -5px;
    width: 150px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 4px 20px;
    z-index: 1000;
  }
}
.set {
  line-height: 40px;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  /* font-weight: 500; */
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}


/* 按钮点击状态 */
.submit-btn:not(:disabled):active {
  transform: translateY(0);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>