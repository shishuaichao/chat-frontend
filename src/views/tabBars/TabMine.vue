<template>
  <div class="tab_container">
    <div class="fixed_to_top"></div>
    <IndexSetting />
  </div>
</template>
<script setup>
import IndexSetting from '@/views/settings/IndexSetting.vue'
</script>
<style scoped lang="scss">
.tab_container  {
  position: relative;
  padding: 50px 20px;
  width: 100vw;
  box-sizing: border-box;
  overflow: hidden;
  .fixed_to_top {
    background-color: #fff;
  }
}

</style>
