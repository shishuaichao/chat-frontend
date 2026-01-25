<template>
  <!-- 父容器：100×100 正方形，直接包含三个小方块 -->
  <div class="parent-box">
    <div class="small-box"></div>
    <div class="small-box"></div>
    <div class="small-box"></div>
  </div>
</template>

<script setup>
// 无需业务逻辑
</script>

<style scoped lang="scss">
/* 父容器：100×100 正方形，Flex 换行 + 整体居中 */
.parent-box {
  width: 100px;
  height: 100px;
  border: 1px solid #000; /* 方便查看边界，可删 */
  display: flex;
  flex-wrap: wrap; /* 开启换行，关键！ */
  justify-content: center; /* 水平方向居中（每行都居中） */
  align-content: center; /* 垂直方向居中（多行整体居中） */
  gap: 5px; /* 小方块之间的间距（行内+行间） */
}

/* 小方块：40×40 正方形，直接放在父容器中 */
.small-box {
  width: 40px;
  height: 40px;
  background: #409eff; /* 背景色，方便查看 */
}
</style>