<template>
    <Twitter v-model="color" :default-colors="[ 
    '#f00', '#00f', '#000', '#fff', '#f00', '#00f', '#000', 
    '#fff','#f00', '#00f', '#000', '#fff','#f00', '#00f', 
    '#000', '#fff','#f00', '#00f', '#000', '#fff',
  ]"/>

</template>

<script setup>
import { ref } from "vue";
import { Twitter } from "@ckpack/vue-color";

const color = ref("#194d33")
</script>

<style>
.vc-twitter-body {
	min-width: 30%;
	width: 300px;
	max-width: 50%;
    padding: 15px 9px 9px 15px;
    position: fixed;
}
</style>