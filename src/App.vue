<script setup>
import { ref } from 'vue';

import PixelsGrid from './components/PixelsGrid.vue';
import ToolBar from './components/ToolBar.vue';
import Palette from './components/Palette.vue';
import Draggable from './components/Draggable.vue';

import Tool from './models/tools';

const tool = ref(Tool.PEN);
const color = ref("");
const hasBought = ref(0);
const onDelete = ref(0);
const onAddRow = ref(0);

</script>

<template>
    <Draggable color="white" style="">
        <ToolBar @toolChanged="tool = $event" @saved="hasBought++" @delete="onDelete++" @addRow="onAddRow++"/>
        <Palette v-model:color="color" show-fallback fallback-input-type="color" popover-x="left" style="margin: auto"/>
    </Draggable>
    <PixelsGrid :tool="tool" :color="color" :hasBought="ref(hasBought)" @boughtBack="hasBought = 0" :onDelete="ref(onDelete)" @deleteBack="onDelete = 0" :onAddRow="ref(onAddRow)"/>
    
</template>

<style>


</style>
