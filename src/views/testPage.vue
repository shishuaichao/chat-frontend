<template>
  <div class="page">
  <!-- 其他内容 -->
  <footer class="safe-footer">sdfdf
    <div class="footer-bg"></div>
  </footer>
</div>
</template>

<script setup>


</script>

<style scoped lang="scss">
/* 让底部背景覆盖安全区的核心思路 */
:root {
  /* 兼容旧版 iOS）
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  /* 备用写法用于极端旧设备 */
  --safe-bottom-legacy: constant(safe-area-inset-bottom, 0px);
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff; /* 页面背景色，必要时改为图片等 */
}

.safe-footer {
  /* 让底部容器撑满视口高度，背景覆盖底部区域 */
  position: fixed;
  bottom: 0;
  width: 100%;
  /* 高度可以根据实际需要调整，包含安全区底部的 inset */
  padding-bottom: calc(env(safe-area-inset-bottom, 0px));
  padding-bottom: calc(constant(safe-area-inset-bottom, 0px));
  /* 可选：背景覆盖整块区域 */
  background: #ff0; /* 底部背景颜色，或者使用背景图片 */
  color: #fff;
}

/* 背景真正覆盖到底部安全区的实现 */
.safe-footer::before {
  content: "";
  position: absolute;
  left: 0; right: 0;
  bottom: calc(-1 * env(safe-area-inset-bottom, 0px)); /* 让背景延伸到屏幕底部边界 */
  height: env(safe-area-inset-bottom, 0px);
  background: #333; /* 与 footer 背景一致，确保覆盖无缝 */
  /* 注意：如果你使用的是图片背景，改成 background-image 来覆盖 */
  z-index: -1;
}
</style>