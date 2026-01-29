<template>
  <div 
    class="user_img_box"
    :class="{'mini': size == 'mini', 'normal': size == 'normal', 'large': size == 'large'}"
    >
    <div 
      class="img_box"
      v-if="avatarList.length == 1 || avatar">
      <img :src="avatar" alt="" class="avatar avatar_1" />
    </div>
    <div 
      class="img_box img_box_mul" 
      v-if="avatarList.length > 1"
      >
      <img 
        alt="avatar" 
        v-for="(v, index) in avatarList" 
        :key="index" 
        :src="v" 
        class="avatar"
        :class="{
          'avatar_1': avatarList.length == 1,
          'avatar_234': avatarList.length > 1 && avatarList.length <= 4,
          'avatar_5-9': avatarList.length >= 5 && avatarList.length <= 9,
        }"
        />
    </div>
  </div>
</template>
<script setup>
defineProps({
  avatarList: {
    type: Array,
    default: () => [],
  },
  avatar: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'normal',
  }
})
</script>

<style scoped lang="scss">
.user_img_box {
  display: inline-block;
  &.mini {
    width: 40px;
    height: 40px;
  }
  &.normal {
    width: 48px;
    height: 48px;
  }
  &.large {
    width: 64px;
    height: 64px;
  }
}
.img_box {
  box-sizing: border-box;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  .avatar_1 {
    width: 100%;
    height: 100%;
  }
  .avatar_234 {
    width: 42%;
    height: 42%;
  }
  .avatar_5-9 {
    width: 30%;
    height: 30%;
  }
}
.img_box_mul {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  gap: 2px;
}
</style>
