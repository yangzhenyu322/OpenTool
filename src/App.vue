<template>
  <LayoutPage/>
  <!-- <Live2D /> -->
</template>

<script>
import LayoutPage from './components/layout/LayoutPage.vue';
import Live2D from './components/live2D/Live2D.vue';

export default {
  name: 'App',
  components: {
    LayoutPage,
    Live2D
  }
}
</script>

<style>
/* 将 html 和 body 的高度设置为 100% */
html,body {
    margin: 0;
}

/* 设置 #app 元素的高度为 100%，并且去除内外边距 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
