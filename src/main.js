import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import router from './router' // 导入路由配置
import './utils/noScale.js' // 导入禁用缩放的工具函数
import { linkStart } from './utils/WS_Client';
import './styles/index.scss' // 导入全局样式

// 注册插件
const app = createApp(App);

linkStart()

app.use(Vant);
app.use(router) // 注册路由
app.mount('#app');