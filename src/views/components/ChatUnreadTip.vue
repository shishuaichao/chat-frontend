<template>
  <div class="new-message-badge" :class="position">
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
  margin: 10px;
  position: absolute;
  right: -30px;
  z-index: 1000;
  &.top {
    top: 50px;
  }
  &.bottom {
    bottom: 60px;
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