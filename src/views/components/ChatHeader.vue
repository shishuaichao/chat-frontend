<template>
  <!-- 1. 顶部固定导航栏 -->
  <div class="header">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #right>
        <van-icon name="ellipsis" />
      </template>
    </van-nav-bar>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 仅保留核心配置：文字、高度、背景色
defineProps({
  title: {
    type: String,
    default: '',
  },
});

const onClickLeft = () => {
  router.back()
}



</script>

<style scoped lang="scss">

:deep(.van-nav-bar__right) {
  font-size: 20px;
}

</style>