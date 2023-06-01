<template>
    <CherryMarkDown style="height:85vh;text-align: left;" />
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