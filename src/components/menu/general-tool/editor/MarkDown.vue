<template>
    <CherryMarkDown style="height:86vh;"/>
</template>

<script>
import { defineComponent } from 'vue'
import CherryMarkDown from './markdowneditor/CherryMarkDown.vue';

export default defineComponent({
  components: { CherryMarkDown },
  setup(){
  }
})
</script>