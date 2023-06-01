<template>
    <div id="cherrymarkdown" ref="cherrymarkdown" />
  </template>
  
  <script>
//   import Cherry from 'cherry-markdown/dist/cherry-markdown.core'
import Cherry from 'cherry-markdown'
import { defineComponent, onMounted  } from 'vue'

export default defineComponent({
setup(){
    var cherrymarkdown
    const initMarkDown = () => {
        cherrymarkdown = new Cherry({
            id: 'cherrymarkdown',
            value: '# welcome to cherry editor!',
            editor: {
                codemirror: {
                    theme: 'light',  // 参考 https://codemirror.net/demo/theme.html
                },
                defaultModel: 'edit&preview',
            },
            toolbar:{
                theme: 'light',  // light or dark
                toolbar: ['bold', 'italic', 'underline', 'strikethrough', '|', 'color', 'header', '|', 'list', { insert: ['image', 'link', 'br', 'formula', 'toc', 'table', 'line-table', 'bar-table', 'word'] }, 'settings'],
                bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', '|', 'size', 'color'],
                float: ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'quickTable', 'code'],
                customMenu: []
            },
            engine: {
                syntax: {
                    table: {
                        enableChart: false,
                        externals: ['echart']
                    }
                },
                customSyntax: {}
            },
            externals: {},
            fileUpload(file, callback) {
                console.log(file)
                callback(file)
            }
        })
    }

    onMounted(()=>{
        initMarkDown()
    })

    return {
        cherrymarkdown
    }
}
})
</script>
  