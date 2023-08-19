<template>
    <JsonEditorVue class="editor" :modelValue="jsonData" @update:modelValue="changeJson" @blur="validate" style="height: 600px;" />
</template>

<script setup>
import { ref } from 'vue'
import JsonEditorVue from 'json-editor-vue3'

// 编辑器的json文本
const jsonData = ref({
    name: "ZenShepp",
    role: "admin"
})

// 校验
const validate = async (editor) => {
    const res = await editor.validate();
    // res 是错误列表，如果是空数组，则表示检测没有错误
    console.log("validate-res:" + res)
}

// json内容更新
const changeJson = json => {
    jsonData.value = json
}
</script>