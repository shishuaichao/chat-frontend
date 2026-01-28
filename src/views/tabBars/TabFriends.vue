<template>
  <van-nav-bar
      :title="title"
    />
  <van-collapse v-model="activeNames">
    <van-collapse-item title="好友申请" name="1">
      代码是写出来给人看的，附带能在机器上运行。
    </van-collapse-item>
    <van-collapse-item title="好友列表" name="2">
      技术无非就是那些开发它的人的共同灵魂。
    </van-collapse-item>
  </van-collapse>
</template>

<script setup>
import { ref } from 'vue';
// 定义标题
const title = ref('好友');
// 定义当前激活的项
const activeNames = ref(['1', '2']);
</script>

<style scoped lang="scss">

</style>