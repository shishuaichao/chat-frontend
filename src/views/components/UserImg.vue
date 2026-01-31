<template>
  <div class="main_box"
    :class="{'mini': size == 'mini', 'normal': size == 'normal', 'large': size == 'large'}"
  >
    <div 
      class="user_img_box"
      >
      <div 
        class="img_box"
        v-if="type == 1">
        <img 
          :src="avatar" alt="" class="avatar avatar_one"
          
          />
      </div>
      <div 
        class="img_box img_box_mul" 
        :class="{
          'img_box_234': avatarList.length > 1 && avatarList.length <= 4,
          'img_box_1': avatarList.length == 1,
          'img_box_2': avatarList.length == 2,
          'img_box_3': avatarList.length == 3,
          'img_box_4': avatarList.length == 4,
          'img_box_5': avatarList.length == 5,
          'img_box_6': avatarList.length == 6,
          'img_box_7': avatarList.length == 7,
          'img_box_8': avatarList.length == 8,
          'img_box_5-9': avatarList.length >= 5 && avatarList.length <= 9,
        }"
        v-if="type == 2"
        >
        <img 
          alt="avatar" 
          v-for="(v, index) in avatarList" 
          :key="index" 
          :src="v" 
          class="avatar"
          :class="`avatar_${index + 1}`"
          />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({
  avatar: {
    type: String,
    default: '',
  },
  type: {
    type: Number,
    default: 1,
  },
  size: {
    type: String,
    default: 'normal',
  }
})

console.log("type", props.type)

const avatarList = computed(() => {
  return props.type == 1 ? props.avatar : (props?.avatar?.split(',') || [])
})
</script>

<style scoped lang="scss">
.main_box {
  display: inline-block;
  &.normal {
    width: 50px;
    height: 50px;
    .img_box_234 {
      padding: 2px;
      .avatar {
        width: 22px;
        height: 22px;
      }
    }
    .img_box_5-9 {
      padding: 2px;
      .avatar {
        width: 14px;
        height: 14px;
      }
    }
  }
}
.user_img_box {
  width: 100%;
  height: 100%;
  background-color: #e6e7e5;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
}
.img_box {
  box-sizing: border-box;
  // background-color: #a562e3;
  overflow: hidden;
  .avatar_one {
    width: 50px;
    height: 50px;
    display: block;
  }
}
.img_box_mul {
  display: grid;
  justify-items: center;
  align-items: center;
  width: fit-content;
  gap: 2px;
  &.img_box_234 {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
  &.img_box_2 {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(1, 1fr);
  }
  &.img_box_3 {
    .avatar_1 {
      grid-column: 1 / span 2;
    }
  }

  &.img_box_5-9 {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
  &.img_box_5 {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    .avatar_1 {
      grid-column: 1 / span 1;
      position: relative;
      left: 8px;
    }
    .avatar_2 {
      grid-column: 3 / span 1;
      position: relative;
      right: 8px;
    }
  }
  &.img_box_6 {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
  &.img_box_7 {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    .avatar_1 {
      grid-column: 1 / span 3;
    }
  }
  &.img_box_8 {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    .avatar_1 {
      grid-column: 1 / span 1;
      position: relative;
      left: 8px;
    }
    .avatar_2 {
      grid-column: 3 / span 1;
      position: relative;
      right: 8px;
    }
  }
}
</style>
