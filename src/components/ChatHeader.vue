<template>
  <!-- 1. 顶部固定导航栏 -->
  <div class="header">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #right>
        <van-icon name="setting-o" />
      </template>
    </van-nav-bar>
  </div>
  <div class="header_pad"></div>
   
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 仅保留核心配置：文字、高度、背景色
defineProps({
  title: {
    type: String,
    required: true,
    default: () => '',
  },
});

const onClickLeft = () => {
  router.back()
}



</script>

<style scoped lang="scss">
/* 1. 顶部固定导航栏（50px） */
.nickname {
  font-size: 8px;
  margin-top: 4px;
}
.header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  z-index: 999;
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
.van-popup--top {
  padding: 10px 4px;
}
:deep(.van-grid-item__content) {
  padding: 10px 4px;
}

</style>