<script setup>
import { ref } from 'vue';

import PixelsGrid from './components/PixelsGrid.vue';
import ToolBar from './components/ToolBar.vue';
import Palette from './components/Palette.vue';
import Draggable from './components/Draggable.vue';

import Tool from './models/tools';

const tool = ref(Tool.HUGE);
const color = ref('');
const hasBought = ref(0);
const onDelete = ref(0);
const importedImage = ref();

</script>

<template>
    <Draggable color="white">
        <ToolBar
            @toolChanged="tool = $event"
            @import="importedImage = $event"
            @saved="hasBought++"
            @delete="onDelete++"
        />
        <Palette
            v-model:color="color"
            show-fallback
            fallback-input-type="color"
            popover-x="left"
            style="margin: auto"
        />
    </Draggable>
    <PixelsGrid
        @contextmenu.prevent
        :tool="tool"
        :color="color"
        :importedImage="ref(importedImage)"
        :hasBought="ref(hasBought)"
        @boughtBack="hasBought = 0"
        :onDelete="ref(onDelete)"
        @deleteBack="onDelete = 0"
        v-model:changeColor="color"
    />
</template>

<style></style>
