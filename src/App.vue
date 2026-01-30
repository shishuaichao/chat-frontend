<template>
  <div class="page_view">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  <van-tabbar v-model="active" class="tabbar" v-if="showTabbar">
    <van-tabbar-item 
      v-for="item in tabBarsRoutes" 
      :key="item.name"
      :name="item.name" 
      :icon="item.meta.icon" 
      :to="item.path"
    >{{ item.meta.title }}</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import router from './router'
import tabBarsRoutes from '@/router/tabbars.js'
import { checkLogined } from '@/utils/checkLogin.js'
import { showNotify } from 'vant'
import { WS_mitt} from '@/utils/WS_Client.js'

onMounted(() => {
  checkLogined()
})

onUnmounted(() => {
  // WS_mitt.off('message')
  // WS_Client.disconnect()
})

WS_mitt.on('message', (data) => {
  // 成功通知
  if (data.sender_id != localStorage.getItem('id')) {
    showNotify({ type: 'success', message: data.content });
  }
})

const showTabbar = ref(false)
const homePageList = tabBarsRoutes.map(item => item.name)
const active = ref(homePageList[0])
router.beforeEach((to, from, next) => {
  console.log('to.name', to.name)
  active.value = to.name
  if (homePageList.includes(to.name)) {
    active.value = to.name
    showTabbar.value = true
  } else {
    showTabbar.value = false
  }
  next()
})
</script>

<style lang="scss">
/* 核心 CSS：禁用全局滚动 */
html, body {
  height: 100%; /* 改用 100% 而非 100vh，基于父容器高度计算 */
  overflow: hidden; /* 禁用整体滚动 */
  -webkit-overflow-scrolling: touch; /* 保留子元素的顺滑滚动 */
  position: fixed; /* 固定页面，避免偏移 */
  width: 100%; /* 确保宽度满屏 */
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  display: flex;
  flex-direction: column;
  .page_view {
    flex: 1;
    overflow-y: auto;
  }
  .tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
}

* {
  box-sizing: border-box;
  /* 全局禁用双击缩放，保留滚动/点击 */
  touch-action: manipulation;
}

/* 仅针对图片（避免影响其他交互） */
img {
  touch-action: manipulation;
  pointer-events: auto; /* 保留点击事件 */
}
</style>
