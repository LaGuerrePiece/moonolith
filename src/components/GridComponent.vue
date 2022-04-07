<template>
    <h1>Hi ! It's grid</h1>
</template>

<script setup>
import { ref, watch } from 'vue';
import Grid from '../models/grid';
import Klon from '../models/klon';

const nbColonne = 128;
const gridsHeight = 100;

const grid = new Grid(nbColonne, gridsHeight, 3);
grid.initialize(document);
const canvas = grid.pixels.canvas
canvas.classList.add("canvas");
canvas.style.display = "flex"

</script>


<style>


</style>