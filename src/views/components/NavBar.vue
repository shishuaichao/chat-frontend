<template>
  <div class="header">
    <van-nav-bar
      :title="title"
      :left-arrow="leftArrow"
      @click-left="onClickLeft"
    >
      <template #right>
        <!-- <van-icon name="ellipsis" /> -->
         <slot name="right"></slot>
      </template>
    </van-nav-bar>
  </div>
  <div class="header_pad"></div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  'left-arrow': {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click-left'])

const onClickLeft = () => {
  emit('click-left')
  if (!props.cusBack) {
    router.back()
  }
}



</script>

<style scoped lang="scss">

.header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
    background-color: $footer_bg_color;
}
.header_pad {
    height: $nav-bar-height;
}

</style>