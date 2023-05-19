import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import * as Icons from '@ant-design/icons-vue';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import i18n from './lang';
// import './assets/main.css'

const app = createApp(App)
// 注册ant-design组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

// 注册element-plus组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 添加到全局
app.config.globalProperties.$antIcons = Icons
app.use(Antd).use(ElementPlus).use(router).use(i18n)

app.mount('#app')
