import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import router from './router' // 导入路由配置


// 注册插件
const app = createApp(App);
app.use(Vant);
app.use(router) // 注册路由
app.mount('#app');