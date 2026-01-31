<template>
  <div class="chat-list-container">
    <ChatItem v-for="(item, index) in chatList" :key="index" :item="item" @handleClick="$emit('handleClick', item)" />
  </div>
</template>

<script setup>

import ChatItem from './ChatItem.vue'

defineProps({
  chatList: {
    type: Array,
    default: () => [],
  },
})





</script>

<style scoped lang="scss">
.chat-list-container {
  width: 100%;
  // max-width: 480px;
  background-color: #fff;
  border-radius: 4px;
}






</style>