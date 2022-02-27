<template>
  <div id="app">
    <PixelGrid/>
    <ToolBar/>
  </div>
</template>

<script>
import PixelGrid from './components/PixelGrid.vue'
import ToolBar from './components/ToolBar.vue'

export default {
  name: 'App',
  components: {
    PixelGrid,
    ToolBar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
