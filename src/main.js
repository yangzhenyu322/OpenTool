import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import * as Icons from '@ant-design/icons-vue';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from './lang'
import './assets/icons/iconfont.css'
import './assets/icons/iconfont'
import 'cherry-markdown/dist/cherry-markdown.css'
import '@wangeditor/editor/dist/css/style.css'
import axios from 'axios'
import globalConfig from './config/config.js'
import JsonEditorVue from 'json-editor-vue3';
import 'jsoneditor';

const app = createApp(App)
// 注册ant-design组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

// 注册element-plus组件
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }

// 添加到全局
app.config.globalProperties.$antIcons = Icons
app.use(Antd).use(ElementPlus).use(router).use(i18n).use(JsonEditorVue)

// 设置全局配置
axios.defaults.baseURL = globalConfig.baseURL
axios.defaults.timeout = globalConfig.timeout

app.mount('#app')