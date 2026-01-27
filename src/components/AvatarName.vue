
<template>
  <div class="avatar_name" @click="onClick">
    <van-image
      class="avatar"
      :src="info.userAvatar"
    />
    <div class="nickname single-line-demo">{{ info.userName }}</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

let props = defineProps({
  info: {
    type: Object,
    default: () => ({
      userAvatar: '',
      userName: ''
    })
  }
})

const onClick = () => {
  router.push({
    name: 'OtherUserInfo',
    params: {
      id: props.info.id
    }
  })
}
</script>

<style scoped lang="scss">
.avatar_name {
  // display: flex;
  // align-items: center;

}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
  overflow: hidden;
  display: block;
}
.nickname {
  width: 50px;
  font-size: 10px;
  margin-top: 6px;
  text-align: center;
}
// 单行省略核心样式（必须包含这4行！）
.single-line-demo {
  /* 1. 必须限定宽度（没有宽度就不会有“超出”） */
  /* 2. 强制文本单行显示 */
  white-space: nowrap;
  /* 3. 超出容器的部分隐藏 */
  overflow: hidden;
  /* 4. 超出部分显示省略号 */
  text-overflow: ellipsis;
  display: block;
}
</style>
