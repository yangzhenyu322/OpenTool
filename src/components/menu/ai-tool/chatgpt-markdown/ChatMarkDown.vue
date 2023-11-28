<!-- todu: drawIO、自动拼音、chaGpt、copy(等官方更新)、公式显示问题 -->
<template>
    <div :id="props.id" ref="cherrymarkdown" style="text-align:left;padding: 0;margin: 0;" />
</template>
  
<script setup>
import {  onMounted,  watch } from 'vue'

import 'cherry-markdown/dist/cherry-markdown.css';
import Cherry from 'cherry-markdown'

const props = defineProps({
    id: String,
    content: String
})

const initMarkDown = () => {
    const cherrymarkdown = new Cherry({
        id: props.id,
        value: props.content, // 默认文本内容
        editor: {
            codemirror: {
                // markdown主题：default、dark暗黑、light明亮、green清新、red热情、violet淡雅、blue清幽
                theme: 'default',
            },
            // defaultModel 编辑器初始化后的模式：1、edit&preview双栏编辑预览模式（）；2、editOnly纯编辑模式；3、previewOnly预览模式
            defaultModel: 'previewOnly',
            // 书写风格，mormal 普通、typewriter 打字机、focus 专注，默认mormal
            writingStyle: 'typewriter'
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
                    wrap: true, // 超出长度是否换行，false则显示滚动条
                    lineNumber: true, // 默认显示行号
                    editCode: false, // 是否显示“编辑”按钮
                },
                header: {
                    // 标题样式：default 默认样式，前面有锚点；autonumber 标题前面有自增序号锚点；none 标题前面没有锚点
                    anchorStyle: 'none'
                }
            }
        },
    })

    const countSubstrings = (mainString, subString) => {
        let count = 0;
        let position = mainString.indexOf(subString);
        while (position !== -1) {
            count++;
            position = mainString.indexOf(subString, position + 1);
        }
        return count;
    }

    // 更新文本内容
    watch(()=>props.content, (newVal) => {
        // console.log('newVal:' + newVal)
        // 检测代码块是否需要补一个```
        let count = countSubstrings(newVal, "```")
        if (count % 2 == 1) {
            cherrymarkdown.setMarkdown(newVal + '\n```')
        } else {
            cherrymarkdown.setMarkdown(newVal)
        }
    })
}

onMounted(()=>{
    initMarkDown()
})
</script>