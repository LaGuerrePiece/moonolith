<script setup>
import { ref } from 'vue';

import PixelsGrid from './components/PixelsGrid.vue';
import ToolBar from './components/ToolBar.vue';
import Palette from './components/Palette.vue';
import Draggable from './components/Draggable.vue';

import Tool from './models/tools';

const tool = ref(Tool.DONE)
const color = ref("")
const hasBought = ref(0)

</script>

<template>
<Draggable :defaultPosition="{ bottom: `30px`, left: `30px` }" color="white">
    <ToolBar @toolChanged="tool = $event" @saved="hasBought = $event"/>
</Draggable>
<PixelsGrid :tool="tool" :color="color" :hasBought="hasBought"/>
<Palette v-model:color="color"/>
</template>

<style>
</style>
