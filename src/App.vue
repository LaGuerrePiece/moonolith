<script setup>
import { ref } from 'vue';

import PixelsGrid from './components/PixelsGrid.vue';
import ToolBar from './components/ToolBar.vue';
import Palette from './components/Palette.vue';
import Draggable from './components/Draggable.vue';

import Tool from './models/tools';

const tool = ref(Tool.DONE)

</script>

<template>
<Draggable :defaultPosition="{ bottom: `30px`, left: `30px` }" color="white">
    <ToolBar @toolChanged="tool = $event"/>
</Draggable>
<PixelsGrid :tool="tool" />
<Palette />
</template>

<style>
</style>
