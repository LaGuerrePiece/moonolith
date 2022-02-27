<template>
  <div id="app">
    <PixelGrid />
    <ToolBar />
    <Twitter v-model="colors" /> 
  </div>
</template>

<script>
import PixelGrid from "./components/PixelGrid.vue";
import ToolBar from "./components/ToolBar.vue";
import { Twitter } from "vue-color";

var colors = { r: 255, g: 0, b: 0 }

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
