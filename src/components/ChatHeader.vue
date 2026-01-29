<template>
  <!-- 1. 顶部固定导航栏 -->
  <van-popup v-model:show="showTop" position="top">
    <van-grid :border="false" :column-num="5">
      <van-grid-item :text="v.nickname" v-for="v,i in onlineUser" :key="i">
        <AvatarName :info="v" />
      </van-grid-item>
    </van-grid>
  </van-popup>
  <div class="header">
    <van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      @click-right="goSettingInfo"
    >
      <template #right>
        <van-icon name="setting-o" />
      </template>
    </van-nav-bar>
    <!-- <div class="left"> 
      
    </div>
    <div class="title" @click="showTop = true">
        {{ title }}
    </div>
    <div class="right">
      <div class="setting" @click="goSettingInfo">。。。</div>
    </div> -->
  </div>
  <div class="header_pad"></div>
   
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import AvatarName from '@/components/AvatarName.vue'

const router = useRouter()

// 仅保留核心配置：文字、高度、背景色
defineProps({
  // 中间显示的文字
  onlineUser: {
    type: Array,
    required: true,
    default: () => [],
  },
  title: {
    type: String,
    required: true,
    default: () => '',
  },
});

const onClickLeft = () => {
  router.back()
}

const showTop = ref(false)

const goSettingInfo = () => {
  router.push({ name: 'TabMine' })
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
  border-bottom: 1px solid #e5e5e5;
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