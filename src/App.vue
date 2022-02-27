<template>
  <div id="app">
    <PixelGrid/>
  </div>
</template>

<script>
import PixelGrid from './components/PixelGrid.vue'

export default {
  name: 'App',
  components: {
    PixelGrid
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
