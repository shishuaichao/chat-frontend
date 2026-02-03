

// import { nextTick } from "vue"
import { WS_Client } from '@/utils/WS_Client';
import { getUserInfo } from '@/utils/utils';

// 发送消息 1 私聊 2 群聊
export const sendMsg = (type, msgOpt) => {
  const msgData = { 
    content: msgOpt.content, 
    convId: msgOpt.convId, 
    type: msgOpt.type || 1,  // 文件、图片、视频、语音 文本
    status: msgOpt.status || 1,
    sender_id: getUserInfo().id,
    avatar: getUserInfo().avatar,
    sender_nickname: msgOpt.sender_nickname,
  }
  if (type == 1) {
    WS_Client.sendPrivateMsg({
      ...msgData,
      from: getUserInfo().id,
      to: msgOpt.friendId,
    })
  } else {
    WS_Client.sendMsg(msgData)
  }
}



