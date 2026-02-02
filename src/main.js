import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import router from './router' // 导入路由配置
import './utils/noScale.js' // 导入禁用缩放的工具函数

import './styles/index.scss' // 导入全局样式
import store from './store' // 导入 Vuex 状态管理
import 'mini-notifier/dist/style.css';
import '@/assets/fonts/iconfont.css'
import NavBar from './views/components/NavBar.vue'



// 注册插件
const app = createApp(App);

app.component('NavBar', NavBar)

app.use(store) // 注册 Vuex 状态管理
app.use(Vant);
app.use(router) // 注册路由
app.mount('#app');