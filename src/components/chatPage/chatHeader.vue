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
      <div class="setting" @click="goSettingInfo">设置</div>
    </div>
  </div>
  <div class="header_pad"></div>
   
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()

// 仅保留核心配置：文字、高度、背景色
defineProps({
  // 中间显示的文字
  onlineUser: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const showTop = ref(false)

const goSettingInfo = () => {
  router.push({ name: 'IndexSetting' })
}


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
}


</style>