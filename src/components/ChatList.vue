<template>
  <div class="chat-list-container">
    <div class="chat_item" v-for="(item, index) in chatList" :key="index" @click="entryChat(item)">
      <div class="avatar_wrapper">
        <div 
          class="img_box img_box_mul" 
          :class="{'img_box_mul': item?.avatar?.length > 1}">
          <img 
            :src="avatar" 
            class="avatar"
            :class="{
              'avatar_1': item?.avatar?.length == 1,
              'avatar_234': item?.avatar?.length > 1 && item?.avatar?.length <= 4,
              'avatar_5-9': item?.avatar?.length >= 5 && item?.avatar?.length <= 9,
            }"
            alt="avatar" 
            v-for="(avatar, index) in item.avatar" 
            :key="index" />
        </div>
        <span v-if="item.hasRedDot" class="red-dot"></span>
      </div>
      <div class="content-wrapper">
        <div class="top-row">
          <span class="name">{{ item.name }}</span>
          <span class="time">{{ item.time }}</span>
        </div>
        <div class="bottom-row">
          <span class="message">{{ item.message }}</span>
          <span v-if="item.hasAttachment" class="attachment-icon">📎</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getConversationList } from '@/api/index.js'
import { IMG_REAL_URL } from '@/utils/constant.js'
import router from '@/router';


const chatList = ref([]);
// 进入聊天
const entryChat = (item) => {
  router.push({
    name: 'ChatRoom',
    query: {
      convId: item.convId,
    }
  })
}

onMounted(() => {
  getConversationList()
    .then(res => {
      console.log('getConversationList', res)
      chatList.value = res.data.map(item => {
        let avatarList = []
        if (item.type == 2) {
          item.avatar.split(',').forEach(e => {
            avatarList.push(IMG_REAL_URL + e.split('_')[1])
          })
        }
        return {
          convId: item.convId,
          avatar: item.type == 2 ? avatarList : [IMG_REAL_URL + item.avatar],
          name: item.name,
          type: item.type,
          message: '',
          time: '',
          hasRedDot: false,
          hasAttachment: false
        }
      })
    })
    .catch(err => {
      console.log('getConversationList', err)
    })
})
</script>

<style scoped lang="scss">
.chat-list-container {
  width: 100%;
  // max-width: 480px;
  background-color: #fff;
  border-radius: 4px;
}

.chat_item {
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
  .avatar_wrapper {
    position: relative;
    padding: 12px;
    box-sizing: border-box;
    .img_box {
      width: 48px;
      height: 48px;
      background-color: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
      .avatar {
        // display: block;
      }
      .avatar_1 {
        width: 100%;
        height: 100%;
      }
      .avatar_234 {
        width: 20px;
        height: 20px;
      }
      .avatar_5-9 {
        width: 13px;
        height: 13px;
      }
    }
    .img_box_mul {
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      gap: 2px;
    }
    // TODO: 聊天项红点
    // .red-dot {
    //   position: absolute;
    //   top: 10px;
    //   right: 10px;
    //   width: 8px;
    //   height: 8px;
    //   background-color: #ed3b31;
    //   border-radius: 50%;
    // }
  }

  .content-wrapper {
    flex: 1;
    min-width: 0;
    border-bottom: 1px solid #f0f0f0;
    padding: 12px 16px 12px 0;
    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .name {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .time {
      font-size: 10px;
      color: #999;
    }

    .bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .message {
      font-size: 13px;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .attachment-icon {
      font-size: 12px;
      color: #999;
      margin-left: 4px;
    }
  }
}




</style>