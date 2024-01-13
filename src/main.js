import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import * as Icons from '@ant-design/icons-vue';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from './lang'
import axios from 'axios'
import axiosConfig from './config/request.js'
import './assets/icons/iconfont.css'
import './assets/icons/iconfont'
import 'cherry-markdown/dist/cherry-markdown.css'
import '@wangeditor/editor/dist/css/style.css'
// import globalConfig from './config/config.js'
import JsonEditorVue from 'json-editor-vue3';
import 'jsoneditor';
import mitt from 'mitt'

const app = createApp(App)
// 注册ant-design组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

// axios全局配置
axios.defaults.baseURL = axiosConfig.baseURL
axios.defaults.timeout = axiosConfig.timeout
axios.defaults.withCredentials = axiosConfig.withCredentials
// axios.interceptors.request.use(config => {
//     const accessToken = "aaa_ACCESS_TOKEN" // 访问令牌
//     if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`
//     }
//     return config
// }, error => {
//     return Promise.reject(error)
// })

// 添加到全局
app.config.globalProperties.$antIcons = Icons
app.config.globalProperties.emitter = mitt()
app.use(Antd).use(ElementPlus).use(router).use(i18n).use(JsonEditorVue)

app.mount('#app')