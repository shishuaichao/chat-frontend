<template>
  <div class="dropdown-container">
    <!-- 下拉菜单 -->
    <transition name="dropdown">
      <div 
        v-if="isShow" 
        class="dropdown-menu"
      >
        <div 
          v-for="(item, index) in menuList" 
          :key="index" 
          class="menu-item"
          @click="$emit('checkClick', item)"
        >
          <van-icon :name="item.iconClass" />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

defineProps({
  isShow: {
    type: Boolean,
    default: false
  }
})
const menuList = [
  { label: '发起群聊', type: 'group', iconClass: 'chat' },
  { label: '添加朋友', type: 'friend', iconClass: 'link-o' },
  { label: '扫一扫', type: 'scan', iconClass: 'scan' },
  { label: '收付款', type: 'pay', iconClass: 'qr' }
]

</script>

<style scoped lang="scss">
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 34px;
  right: -16px;
  width: 140px;
  background: #333;
  color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 1000;
  &::before {
    content: ' ';
    position: absolute;
    top: -8px;
    right: 16px;
    /* 核心：宽高必须为0，否则箭头会变形 */
    width: 0;
    height: 0;
    /* 左右透明边框（控制箭头底部宽度），下边框有色（控制箭头高度+颜色） */
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #333; /* 箭头主色，可随便改 */
    
  }
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 16px;
  border-bottom: 1px solid #444;
  transition: background 0.2s;
}


.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #444;
}

.menu-item i {
  margin-right: 12px;
  font-size: 18px;
}

/* 过渡动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>