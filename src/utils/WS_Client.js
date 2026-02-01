import { io } from 'socket.io-client';
import mitt from 'mitt';
import { API_BASE_URL } from './constant.js'
import { notify } from 'mini-notifier'

// 1. 创建全局 mitt 事件总线（解耦 Socket 与组件）
export const WS_mitt = mitt();

// 2. 封装 Socket.IO 全局单例
class SocketClient {
  constructor() {
    this.socket = null; // Socket 实例
    this.connectStatus = ''; // 连接状态  connecting 连接中 connected 已连接  
    this.baseUrl = API_BASE_URL; // 替换为实际后端地址（如 http://localhost:3000）
    this.options = {
      // Socket.IO 核心配置
      reconnection: true, // 自动重连（默认开启）
      reconnectionAttempts: 10, // 最大重连次数
      reconnectionDelay: 1000, // 重连间隔（3秒）
      timeout: 10000, // 连接超时时间
      transports: ['websocket', 'polling'], // 优先 WS，降级长轮询
      auth: {
        authToken: ''
      }, 
    };
  } 

  // 初始化 Socket 连接 @param {Object} auth - 可选，鉴权参数 { id, nickname, avatar }
  connect() {
    if (this.connectStatus == 'connecting' || this.connectStatus == 'connected') return
    let authToken = localStorage.getItem('id')
    if (!authToken) return;
    this.options.auth.authToken = authToken
    let auth = {
      id: authToken,
      nickname: localStorage.getItem('nickname'),
      avatar: localStorage.getItem('avatar'),
    }
    this.options.authToken = auth
    // 3. 创建 Socket 实例并连接
    this.socket = io(this.baseUrl, this.options);
    this.connectStatus = 'connecting'  
    const eventListeners = [
      'connect_success', // 连接成功
      'system_msg', // 系统通知
      'message', // 聊天消息
      'online_count', // 在线用户数
      'connect_error', // 连接错误
      'join_room', // 加入房间
      'leave_room', // 离开房间
      'private_message', // 私聊消息
    ];
    eventListeners.forEach(event => {
      this.socket.on(event, (data) => {
        console.log(`收到消息 ${event}：`, data);
        if (event === 'connect_success') {
          this.connectStatus = 'connected';
          notify('服务链接成功', {
            time: 3000,
            style: 'success',
          });
        }
        if (event === 'connect_error') {
          notify('服务连接失败，正在重连...', {
            time: 3000,
            style: 'error',
          });
          this.connect()
        }
        if (event === 'private_message') {
          notify(`收到私聊消息：${data.sender_id} 对你说：${data.content}`, {
            time: 3000,
            style: 'success',
          });
        }
        WS_mitt.emit(`${event}`, data);
      });
    });
  }

  sendMsg(data) {
    console.log(`发送消息: `, data);
    this.socket.emit('message', data);
  }

  sendPrivateMsg(data) {
    console.log(`发送私聊消息: `, data);
    this.socket.emit('private_message', data);
  }
  

  // 加入指定房间
  joinRoom(roomId) {
    console.log(`加入房间 ${roomId}`)
    this.socket.emit('room:join', {
      roomId: roomId,
      userId: localStorage.getItem('id'),
    });
  }
  // 离开指定房间
  leaveRoom(obj) {
    this.socket.emit('room:leave', obj);
  }
}

// 导出全局单例（确保整个项目只有一个 Socket 实例）
export const WS_Client = new SocketClient();


