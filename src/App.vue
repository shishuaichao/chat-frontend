<template>
  <div class="page_view">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  <van-tabbar v-model="active" class="top_line" v-if="showTabbar">
    <van-tabbar-item 
      v-for="item in tabBarsRoutes" 
      :key="item.name"
      :name="item.name" 
      :icon="item.meta.icon" 
      :to="item.path"
      replace
    >{{ item.meta.title }}
      <template #icon="props">
        <van-icon :name="props.active ? item.meta.activeIcon : item.meta.icon" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import router from './router'
import tabBarsRoutes from '@/router/tabbars.js'
import { checkLogined } from '@/utils/checkLogin.js'
import { WS_mitt, WS_Client } from '@/utils/WS_Client.js'
import store from '@/store/index.js'
// import { notify } from 'mini-notifier'
// import { useRoute } from 'vue-router'
// const route = useRoute()
import { sound } from '@/utils/audio.js'
import { getUserInfo } from './utils/utils'

onMounted(() => {
  checkLogined()
  WS_Client.connect()
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // 切到后台
      store.commit('setIsInBack', true)
    } else {
      // 切到前台
      store.commit('setIsInBack', false)
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange);
})





WS_mitt.on('private_message', (data) => {
  console.log('data', data)
  // if (route.name == 'ChatRoom') return
  // notify(`私聊消息：${data.sender_id} 对你说：${data.content}`, {
  //   time: 3000,
  //   style: 'success',
  // });
})
WS_mitt.on('notice_message', data => {
  console.log('notice_message', data)
  if (data.senderId != getUserInfo().id) [
    sound.receive.play()
  ]
  // notify(`群聊消息：${data.group_id} 说：${data.content}`, {
  //   time: 3000,
  //   style: 'success',
  // });
})

const showTabbar = ref(false)
const homePageList = tabBarsRoutes.map(item => item.name)
const active = ref(homePageList[0])
router.beforeEach((to, from, next) => {
  // console.log('to.name', to.name)
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

<style scoped lang="scss">

</style>
