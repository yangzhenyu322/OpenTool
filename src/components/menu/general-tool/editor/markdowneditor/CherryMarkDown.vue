<template>
    <div>
       <div id="cherry-markdown" ref="cherrymarkdown" style="text-align: left;" />
       <a-button @click="getContent">获取content</a-button>
       <a-button @click="clearContent">清除content</a-button>
       <a-button @click="exportPDF">导出PDF</a-button>
       <a-button @click="exportMarkDown">导出MarkDown</a-button>
       <a-button @click="exportHtml">导出Html</a-button>
    </div>
</template>
  
<script>
import { defineComponent, onMounted, ref } from 'vue'
// import { uploadApi } from '@/utils/file/FileUtil.js'

import 'cherry-markdown/dist/cherry-markdown.css';
import Cherry from 'cherry-markdown'
// import Cherry from 'cherry-markdown/dist/cherry-markdown.core';
// import CherryMermaidPlugin from 'cherry-markdown/dist/addons/cherry-code-block-mermaid-plugin';
// import mermaid from 'mermaid';

export default defineComponent({
setup(){
    var cherrymarkdown
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
    //             callback(res.data.data)
    //         }).catch(err => {
    //             console.log('文件上传失败：' + err)
    //         })
    //     },
    //     afterChange: '',
    //     afterInit: '',
    //     beforeImageMounted: ''
    // })

    const initMarkDown = () => {
        // // 插件注册必须在Cherry实例化之前完成
        // Cherry.usePlugin(CherryMermaidPlugin, {
        //     mermaid, // 传入mermaid引用
        //     // mermaidAPI: mermaid.mermaidAPI, // 也可以传入mermaid API
        //     // 同时可以在这里配置mermaid的行为，可参考mermaid官方文档
        //     // theme: 'neutral',
        //     // sequence: { useMaxWidth: false, showSequenceNumbers: true }
        // });

        cherrymarkdown = new Cherry({
            id: 'cherry-markdown',
            value: '# welcome to cherry editor!', // 默认文本内容
            editor: {
                codemirror: {
                    // depend on codemirror theme name: https://codemirror.net/demo/theme.html
                    // manual import theme: `import 'codemirror/theme/<theme-name>.css';`
                    theme: 'default',
                },
                // height: '100%',
                // defaultModel 编辑器初始化后的默认模式，一共有三种模式：1、双栏编辑预览模式；2、纯编辑模式；3、预览模式
                // edit&preview: 双栏编辑预览模式
                // editOnly: 纯编辑模式（没有预览，可通过toolbar切换成双栏或预览模式）
                // previewOnly: 预览模式（没有编辑框，toolbar只显示“返回编辑”按钮，可通过toolbar切换成编辑模式）
                // defaultModel: 'edit&preview',
                defaultModel: 'edit&preview',
            },
            toolbar:{
                theme: 'dark',  // light or dark
                toolbar: ['bold', 'italic', 'underline', 'strikethrough', '|', 'color', 'header', '|', 'list', { insert: ['image', 'audio', 'video', 'link', 'br', 'code', 'formula', 'toc', 'table', 'line-table', 'bar-table', 'pdf', 'word'] }, 'graph', 'settings'],
                bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', '|', 'size', 'color'],
                float: ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'quickTable', 'code'],
                customMenu: []
            },
            // 文件上传，需要将文件存储的url在callback返回，fileUpload(file, callback)
            // fileUpload: callbacks.fileUpload,
            // callback: {
            //     afterChange: callbacks.afterChange,
            //     afterInit: callbacks.afterInit,
            //     beforeImageMounted: callbacks.beforeImageMounted,
            // },
        })
    }

    onMounted(()=>{
        initMarkDown()
    })

    // CherryMarkDown API：https://tencent.github.io/cherry-markdown/examples/api.html
    const markdownContent = ref('')
    // 获取MarkDown文本内容
    const getContent = () => {
        markdownContent.value = cherrymarkdown.getMarkdown()
        console.log('content:' + cherrymarkdown.getMarkdown())
        // return cherrymarkdown.getContent
    }
    // 获取渲染后的Html文本内容
    // const getHtml = () => {
    //     return cherrymarkdown.getHtml()
    // }
    // 设置文本内容
    // const setContent = (content) => {
    //     cherrymarkdown.setMarkdown(content)
    // }
    // 清除文本内容
    const clearContent = () => {
        cherrymarkdown.setMarkdown('')
    }
    // 导出预览区内容，type: {'pdf'|'markdown'}
    // 导出pdf
    const exportPDF = () => {
        cherrymarkdown.export('pdf')
    }
    // 导出markdown
    const exportMarkDown = () => {
        cherrymarkdown.export('markdown')
    }
    // 导出html
    const exportHtml = () => {
        cherrymarkdown.export('html')
    }

    return {
        cherrymarkdown,
        getContent,
        clearContent,
        exportPDF,
        exportMarkDown,
        exportHtml
    }
}
})
</script>