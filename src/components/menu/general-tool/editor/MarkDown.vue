<template>
    <CherryMarkDown style="height: calc(100vh - 90px);" :id="id" />
</template>

<script setup>
import CherryMarkDown from './markdowneditor/CherryMarkDown.vue';

const id = 'cherry-markdown'
</script>