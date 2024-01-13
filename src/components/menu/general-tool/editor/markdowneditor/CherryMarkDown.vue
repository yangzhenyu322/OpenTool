<!-- todu: drawIO、自动拼音、chaGpt、copy(等官方更新)、公式显示问题 -->
<template>
    <div :id="props.id" ref="cherrymarkdown" style="text-align:left;" />
</template>
  
<script setup>
import { onMounted, defineProps } from 'vue'
// import { uploadApi } from '@/utils/file/FileUtil.js'

import 'cherry-markdown/dist/cherry-markdown.css';
import Cherry from 'cherry-markdown'

const props = defineProps({
    id: String
})

var defaultContent = '# welcome to cherry editor!\n' +
    'github: [https://github.com/Tencent/cherry-markdown/blob/main/README.CN.md](https://github.com/Tencent/cherry-markdown/blob/main/README.CN.md)\n\n' +
    '使用说明：[https://tencent.github.io/cherry-markdown/examples/index.html](https://tencent.github.io/cherry-markdown/examples/index.html) '
// 定义cherry-markdown示例中的回调函数
// const callbacks = reactive({
//     fileUpload: (file, callback) => {
//         console.log('file:' + JSON.stringify(file))
//         // url: 是你文件存储的位置
//         // api.post(file).then(url => {
//         //   callback(url) 
//         // })
//         uploadApi({
//             file: file,
//             route: '/imageEdit/upload',
//             onUploadProgress: ev => {
//                 console.log('开始上传：' + ev)
//             }
//         }).then(res => {
//             // callback(url,config): url是图像url，config是配置图像在markdown的显示样式
//             callback(res.data.data, {
//                 name: `${file.name.replace(/\.[^.]+$/, '')}`,
//                 isBorder: true, // 是否显示边框，默认false
//                 isShadow: true, // 是否显示阴影，默认false
//                 isRadius: false, // 是否显示圆角，默认false
//                 width: '60%', // 图片的宽度，默认100%，可配置百分比，也可以配置像素值
//                 height: 'auto', // 图片的高度，默认auto
//             })
//         }).catch(err => {
//             console.log('文件上传失败：' + err)
//         })
//     },
//     afterChange: '',
//     afterInit: '',
//     beforeImageMounted: ''
// })

const initMarkDown = () => {
    const cherrymarkdown = new Cherry({
        id: props.id,
        value: defaultContent, // 默认文本内容
        /**
         * 配置主题，第三方可以自行扩展主题
         */
        theme: [
            { className: 'default', label: '默认' },
            { className: 'dark', label: '暗黑' },
            { className: 'light', label: '明亮' },
            { className: 'green', label: '清新' },
            { className: 'red', label: '热情' },
            { className: 'violet', label: '淡雅' },
            { className: 'blue', label: '清幽' },
        ],
        editor: {
            // markdown主题：default、dark暗黑、light明亮、green清新、red热情、violet淡雅、blue清幽
            theme: 'dark',
            codemirror: {
                // 是否自动focus 默认为true
                autofocus: true,
            },
            // defaultModel 编辑器初始化后的模式：1、edit&preview双栏编辑预览模式（）；2、editOnly纯编辑模式；3、previewOnly预览模式
            defaultModel: 'edit&preview',
        },
        toolbars:{
            // 工具栏主题：light or dark（默认）
            theme: 'default',
            // 是否展示顶部工具栏：true展示(默认)；false不展示
            showToolbar: true,
            // 工具栏功能设置：自定义
            toolbar: ['undo', 'redo', '|', 'color', 'size', 'justify', 'bold', 'italic', 'underline', 'strikethrough', 'ruby', '|', 'header', 'quote', '|', 'list', { insert: ['table', 'code','image', 'audio', 'video', 'link', 'br', 'formula', 'toc', 'pdf', 'word'] }, 'graph'],
            // 右侧工具栏
            toolbarRight: ['fullScreen', 'togglePreview', 'switchModel', 'export', 'codeTheme'],
            // 侧边工具栏
            sidebar: ['settings', 'theme', 'mobilePreview'],
            // 选中时工具栏
            bubble: [ 'size', 'color', 'justify', '|', 'bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup'],
            // 浮动工具栏
            float: ['h1', 'h2', 'h3', '|', 'quote', 'quickTable', 'code', 'image', 'drawIo'],
        },
        // 解锁引擎配置
        engine: {
            // 全局配置
            global: {
                // 是否启用经典换行逻辑: true一个换行会被忽略，两个以上连续换行会分割成段落；false(默认)一个换行会转成<br>，两个会分割成段落，三个会转成<br>并分割段落
                classicBr: false,
            },
            // 内置语法配置
            syntax: {
                codeBlock: {
                    theme: 'dark', //默认为dark深色主题, default、dark、funky、okaidia、twilight、coy、(solarized light、tomorrow night, 这两个主题还不可用，不知道为什么)
                    wrap: false, // 超出长度是否换行，false则显示滚动条
                    lineNumber: true, // 默认显示行号
                },
                header: {
                    // 标题样式：default 默认样式，前面有锚点；autonumber 标题前面有自增序号锚点；none 标题前面没有锚点
                    anchorStyle: 'default'
                }
            }
        },
        // 打开draw.io编辑页的url，如果为空则drawio按钮失效(访问被拒绝了，不知道什么原因，待解决)
        drawioIframeUrl: 'https://app.diagrams.net/#Hyangzhenyu322%2FdrawIo%2Fmain%2Fopentool.drawio',
        // 文件上传：默认以base64编码存储，也可以以图片的形式存储，但需要将文件存储的url在callback返回，fileUpload(file, callback)
        // fileUpload: callbacks.fileUpload,

        // callback: {
        //     afterChange: callbacks.afterChange,
        //     afterInit: callbacks.afterInit,
        //     beforeImageMounted: callbacks.beforeImageMounted,
        // },

        // chatGpt的openai配置
        openai: {
            apiKey: 'sk-CMAaXEQfolbfguToC0E89d26626645CfAc8eD3D700CdE266', // apiKey
            proxy: {
              host: 'https://api.qqslyx.com/',
              port: '7890',
            }, // http & https代理配置
            ignoreError: false, // 是否忽略请求失败，默认忽略
        }
    })
}

onMounted(()=>{
    initMarkDown()
})

// CherryMarkDown API：https://tencent.github.io/cherry-markdown/examples/api.html
// const markdownContent = ref('')
// 获取MarkDown文本内容
// const getContent = () => {
//     markdownContent.value = cherrymarkdown.getMarkdown()
//     console.log('content:' + cherrymarkdown.getMarkdown())
// }
// 获取渲染后的Html文本内容
// const getHtml = () => {
//     return cherrymarkdown.getHtml()
// }
// 设置文本内容
// const setContent = (content) => {
//     cherrymarkdown.setMarkdown(content)
// }
// 清除文本内容
// const clearContent = () => {
//     cherrymarkdown.setMarkdown('')
// }
// 导出预览区内容，type: {'pdf'|'markdown'}
// 导出pdf
// const exportPDF = () => {
//     cherrymarkdown.export('pdf')
// }
// 导出markdown
// const exportMarkDown = () => {
//     cherrymarkdown.export('markdown')
// }
// 导出html
// const exportHtml = () => {
//     cherrymarkdown.export('html')
// }
</script>