<template>
  <div class="chat-list-container">
    <!-- 单个聊天项 -->
    <div class="chat_item" v-for="(item, index) in chatList" :key="index" @click="onClickChat(item)">
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
import { ref } from 'vue';


const chatList = ref([
  {
    avatar: ['https://picsum.photos/30/30?image=12'],
    name: '张三',
    message: '[动画表情]',
    time: '昨天 11:31',
    hasRedDot: false,
    hasAttachment: false
  },
  {
    avatar: [
      'https://picsum.photos/30/30?image=16',
      'https://picsum.photos/30/30?image=17',
      'https://picsum.photos/30/30?image=18',
    ],
    name: '李四',
    message: '来吧',
    time: '星期五',
    hasRedDot: false,
    hasAttachment: false
  },
  {
    avatar: [
      'https://picsum.photos/30/30?image=116',
      'https://picsum.photos/30/30?image=117',
      'https://picsum.photos/30/30?image=118',
      'https://picsum.photos/30/30?image=119',
      'https://picsum.photos/30/30?image=120',
      'https://picsum.photos/30/30?image=121',
      'https://picsum.photos/30/30?image=122',
    ],
    name: 'QQ Mail',
    message: 'ChatGPT: Write faster with ChatGPT',
    time: '星期五',
    hasRedDot: true,
    hasAttachment: true
  },
  {
    avatar: [
      'https://picsum.photos/30/30?image=216',
      'https://picsum.photos/30/30?image=217',
      'https://picsum.photos/30/30?image=218',
      'https://picsum.photos/30/30?image=219',
      'https://picsum.photos/30/30?image=220',
      'https://picsum.photos/30/30?image=221',
      'https://picsum.photos/30/30?image=222',
      'https://picsum.photos/30/30?image=223',
      'https://picsum.photos/30/30?image=214',
    ],
    name: '12月20日遇见7周年活动群',
    message: '勇爸: [链接] 冬天零下5度跑步，是一场双向博弈',
    time: '星期五',
    hasRedDot: true,
    hasAttachment: true
  },
  {
    avatar: [
      'https://picsum.photos/30/30?image=126',
      'https://picsum.photos/30/30?image=127',
      'https://picsum.photos/30/30?image=128',
      'https://picsum.photos/30/30?image=129',
      'https://picsum.photos/30/30?image=220',
    ],
    name: '有知有行金钱魔法师🐍',
    message: '[2条] "夏天" recalled a message',
    time: '星期四',
    hasRedDot: true,
    hasAttachment: false
  },
  {
    avatar: [
      'https://picsum.photos/30/30?image=16',
      'https://picsum.photos/30/30?image=17',
      'https://picsum.photos/30/30?image=18',
      'https://picsum.photos/30/30?image=20',
    ],
    name: '有知有行金钱魔法师🐍',
    message: '[2条] "夏天" recalled a message',
    time: '星期四',
    hasRedDot: true,
    hasAttachment: false
  },
]);
// 点击聊天项
const emit = defineEmits(['clickChat'])
const onClickChat = (item) => {
  emit('clickChat', item)
}
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