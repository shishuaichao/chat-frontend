<template>
  <div class="new-message-badge" 
    :class="{ 
      'show': count > 0,  
      'hide': count <= 0, 
      'top': position === 'top',
      'bottom': position === 'bottom',
    }"
  >
    <span class="badge-content">
      <span class="arrow-icon"> 
        <!-- <van-icon name="chat-o" size="16" /> -->
        <!-- <van-icon name="arrow-down" /> -->
        <van-icon name="arrow-double-right" />
      </span>
      {{ count }} 条新消息
    </span>
  </div>
</template>

<script setup>
// import { ref } from 'vue'

defineProps({
  count: {
    type: Number,
    default: 0
  },
  position: {
    type: String,
    default: 'bottom'
  }
})
</script>

<style scoped>
.new-message-badge {
  display: inline-block;
  background: #ffffff;
  color: #36c275;
  font-size: 12px;
  padding: 8px 30px 8px 14px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  margin: 10px;
  position: absolute;
  right: 0px;
  z-index: 1000;
  transition: transform 0.5s linear;
  &.show {
    transform: translateX(30px);
  }
  &.hide {
    transform: translateX(200px);
  }
  &.top {
    top: 50px;
  }
  &.bottom {
    bottom: 80px;
  }
}


.badge-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow-icon {
  font-size: 12px;
  position: relative;
}

.top .arrow-icon {
  transform: rotate(-90deg);
}
.bottom .arrow-icon {
  transform: rotate(90deg);
}
</style>