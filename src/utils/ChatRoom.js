

// import { nextTick } from "vue"
import { WS_Client } from '@/utils/WS_Client';
import { getUserInfo } from '@/utils/utils';
// # userId // 发送者id
//   # content // 消息内容
//   # msgType // 消息类型 1: 文本 2: 图片 3: 语音 4: 视频 5: 文件 6: 位置 7: 链接 8: 系统消息
//   # convId // 会话id
//   # convType  // 会话类型 1: 单聊 2: 群聊
//   # to  // 单聊接收者id
// 发送消息 1 私聊 2 群聊
export const sendMsg = (msgOpt) => {
  const msgData = {
    userId: getUserInfo().id,
    content: msgOpt.content,
    msgType: msgOpt.msgType || 1,
    convId: msgOpt.convId,
    convType: msgOpt.convType,
    to: msgOpt.to,
  }
  WS_Client.sendMsg(msgData)
}



