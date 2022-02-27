<template>
  <div id="app">
    <PixelGrid :currentColor="colors"/>
    <ToolBar />
    <Twitter v-model="colors" /> 
  </div>
</template>

<script>
import PixelGrid from "./components/PixelGrid.vue";
import ToolBar from "./components/ToolBar.vue";
import { Twitter } from "vue-color";

var colors = {
  hex: '#194d33',
  hex8: '#194D33A8',
  hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
  hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
  rgba: { r: 25, g: 77, b: 51, a: 1 },
  a: 1
}

export default {
  name: "App",
  components: {
    PixelGrid,
    ToolBar,
    Twitter,
  },
  data() {
    return {
      colors,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.vc-twitter-body {
  padding: 15px 9px 9px 15px;
  position: absolute;
}
</style>
