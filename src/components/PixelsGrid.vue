<template></template>

<script setup>

import { ref } from "@vue/reactivity";
import Grid from "../models/grid";
import Klon from "../models/klon";
 
// const pixelsNoice = ref([]);
// const pixelsData = ref([]);
// const pixels = ref([]);

const grid = new Grid(128, 256)
grid.initialize(document.body)


let arr = new Array(4)
arr.fill(new Klon([0,0,0]))

// grid.update([0, 1, 0, 1, 0, 1])

console.log(grid)
</script>

<style>
</style>