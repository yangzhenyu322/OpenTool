<template>
    <CherryMarkDown style="height:86vh;" :id="id" />
</template>

<script setup>
import CherryMarkDown from './markdowneditor/CherryMarkDown.vue';

const id = 'cherry-markdown'
</script>