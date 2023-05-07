import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import * as Icons from '@ant-design/icons-vue';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from './lang';
// import './assets/main.css'

const app = createApp(App)
// 注册组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})


// 添加到全局
app.config.globalProperties.$antIcons = Icons
app.use(Antd).use(ElementPlus).use(router).use(i18n)

app.mount('#app')
