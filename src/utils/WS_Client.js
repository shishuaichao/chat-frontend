import { io } from 'socket.io-client';
import mitt from 'mitt';
import { API_BASE_URL } from './constant.js'
import { showToast } from 'vant';

// 1. 创建全局 mitt 事件总线（解耦 Socket 与组件）
export const WS_mitt = mitt();

// 2. 封装 Socket.IO 全局单例
class SocketClient {
  constructor() {
    this.socket = null; // Socket 实例
    this.isConnected = false; // 连接状态
    this.baseUrl = API_BASE_URL; // 替换为实际后端地址（如 http://localhost:3000）
    this.options = {
      // Socket.IO 核心配置
      reconnection: true, // 自动重连（默认开启）
      reconnectionAttempts: 10, // 最大重连次数
      reconnectionDelay: 3000, // 重连间隔（3秒）
      timeout: 10000, // 连接超时时间
      transports: ['websocket', 'polling'], // 优先 WS，降级长轮询
      auth: {
        // 鉴权参数（登录后动态赋值）
        id: '',
        nickname: '',
        avatar: '',
      }
    };
  } 

  // 初始化 Socket 连接 @param {Object} auth - 可选，鉴权参数 { id, nickname, avatar }
  connect(auth = {}) {
    // 1. 更新鉴权参数（登录后传入）
    if (auth.id && auth.nickname && auth.avatar) {
      this.options.auth = auth;
    }
    // 2. 避免重复连接
    if (this.isConnected) {
      console.log('Socket.IO 已连接，无需重复连接');
      return;
    }
    // 3. 创建 Socket 实例并连接
    this.socket = io(this.baseUrl, this.options);
    // ========== 监听 Socket 核心事件 ==========
    const eventListeners = [
      'connect_success', // 连接成功
      'system_msg', // 系统通知
      'message', // 聊天消息
      'online_count', // 在线用户数
      'disconnect', // 连接断开
      'connect_error', // 连接错误
      'join_room', // 加入房间
    ];
    eventListeners.forEach(event => {
      this.socket.on(event, (data) => {
        console.log(`收到事件 ${event}：`, data);
        if (event === 'connect_success') {
          this.isConnected = true;
        }
        WS_mitt.emit(`${event}`, data);
      });
    });
  }

  emit(event, data) {
    console.log(`发送事件 ${event}：`, data);
    this.socket.emit(event, data);
  }

  // 断开 Socket 连接 @param {Object} userInfo - 可选，用户信息 { id, nickname, avatar }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false
    }
  }

  // 发送聊天消息 @param { Object } data - 消息体 { toUserId, content, type }
  sendChatMessage(data) {
    if (!this.isConnected) {
      showToast({ message: '服务链接失败，无法发送消息，请刷新页面', duration: 2000, });
      return;
    }
    // 发送到服务器的「聊天消息」通道
    this.socket.emit('chat:message', {
      ...data,
      timestamp: Date.now(), // 客户端时间戳
      fromUserId: this.options.auth.id // 发送者ID
    });
  }

  

  // 加入指定房间（适配群聊场景）@param {String}  roomId - 房间ID
  joinRoom(roomId) {
    console.log('加入房间', roomId, this.isConnected)
    if (this.isConnected) {
      this.socket.emit('room:join', roomId);
      WS_mitt.emit('room:joined', roomId);
    }
  }
  // 离开指定房间（适配群聊场景）@param {String}  roomId - 房间ID
  leaveRoom(roomId) {
    this.socket.emit('room:leave', roomId);
    WS_mitt.emit('room:left', roomId);
  }
    

}

// 导出全局单例（确保整个项目只有一个 Socket 实例）
export const WS_Client = new SocketClient();

export const linkStart = async () => {
  let auth = {
    id: localStorage.getItem('id'),
    nickname: localStorage.getItem('nickname'),
    avatar: localStorage.getItem('avatar'),
  }
  WS_Client.connect(auth);

  const handleVisibilityChange = () => {
    if (document.hidden) {
      // 切到后台
      // WS_Client.disconnect()
    } else {
      // 切到前台
      // WS_Client.connect(auth);
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

