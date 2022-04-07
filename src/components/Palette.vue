<template>
    <VSwatches v-model="colorChoice" :swatches="customPalette" />
</template>

<script setup>
import { ref, watch } from 'vue';
import VSwatches from 'vue3-swatches';

const props = defineProps({
    color: String,
});

const emit = defineEmits(['update:color']);
const colorChoice = ref('#b3e3da');
const customPalette = [
    '#28282e',
    '#6c5671',
    '#d9c8bf',
    '#f98284',
    '#b0a9e4',
    '#accce4',
    '#b3e3da',
    '#feaae4',
    '#87a889',
    '#b0eb93',
    '#e9f59d',
    '#ffe6c6',
    '#dea38b',
    '#ffc384',
    '#fff7a0',
    '#fff7e4',
];
const customPalette2 = [
    '#53437f',
    '#a89fcc',
    '#ffffff',
    '#ffd9e8',
    '#ff9bb6',
    '#9968e2',
    '#be9bff',
    '#7fceff',
    '#6d81ff',
    '#2c6f99',
    '#00bcaa',
    '#c48f9e',
    '#8e586f',
    '#ff5470',
    '#ff9b71',
    '#ffd9ae',
];
const customPalette3 = [
    '#1a1c2c',
    '#5d275d',
    '#b13e53',
    '#ef7d57',
    '#ffcd75',
    '#a7f070',
    '#38b764',
    '#257179',
    '#29366f',
    '#3b5dc9',
    '#41a6f6',
    '#73eff7',
    '#f4f4f4',
    '#94b0c2',
    '#566c86',
    '#333c57',
];
const customPalette4 = [
    '#00033c',
    '#005260',
    '#009d4a',
    '#0aff52',
    '#003884',
    '#008ac5',
    '#00f7ff',
    '#ff5cff',
    '#ac29ce',
    '#600088',
    '#b10585',
    '#ff004e',
    '#2a2e79',
    '#4e6ea8',
    '#add4fa',
    '#ffffff',
];

emit('update:color', colorChoice.value);

watch(colorChoice, () => {
    emit('update:color', colorChoice.value);
});
</script>
