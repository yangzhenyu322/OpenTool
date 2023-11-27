<template>
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="editorMode"
        style="border-bottom: 1px solid #ccc;"
    />
    <Editor
        v-model="htmlContent"
        :defaultConfig="editorConfig"
        :mode="editorMode"
        @onCreated="handleCreated"
        style="height: calc(100vh - 131px);"
    />
    <!-- <a-button @click="getToolConfig">config</a-button> -->
</template>

<script setup>
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { DomEditor } from'@wangeditor/editor'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// HTML内容
const htmlContent = ref('<h1>Welcome to WangEditor！</h1><p>WangEditor介绍：<a href="https://www.wangeditor.com/">https://www.wangeditor.com/</p>')
// 编辑器模式: default、simple
const editorMode = 'default'
// 工具栏配置: https://www.wangeditor.com/v5/toolbar-config.html#getconfig
const toolbarConfig = {}
// toolbarConfig.toolbarKeys = [
//   // 菜单 key
//   'bold', 'italic',

//   // 菜单组，包含多个菜单
//   {
//       key: 'group-more-style', // 必填，要以 group 开头
//       title: '更多样式', // 必填
//       iconSvg: '<svg>....</svg>', // 可选
//       menuKeys: ["through", "code", "clearStyle"] // 下级菜单 key ，必填
//   },
// ]
// 编辑器配置:https://www.wangeditor.com/v5/editor-config.html
const editorConfig = {
  placeholder: '请输入内容...' 
}

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
// const getToolConfig = () => {
//   // 通过获取configKeys来自定义工具栏
//   const toolbar = DomEditor.getToolbar(editorRef.value)
//   const curToolbarConfig = toolbar.getConfig()
//   console.log('curToolbarConfig:')
//   console.log(curToolbarConfig.toolbarKeys)
//   console.log('allToolConfigKeys:')
//   console.log(editorRef.value.getAllMenuKeys())
// }

// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //     htmlContent.value = '<p>模拟 Ajax 异步设置内容</p>'
  // }, 1500)
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
</script>