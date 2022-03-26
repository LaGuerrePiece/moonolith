<template>
    <Twitter v-model="colorChoice" />
</template>

<script setup>
import { ref, watch } from 'vue';
import { Twitter } from '@ckpack/vue-color';

const props = defineProps({
    color: Array,
});
const emit = defineEmits(['update:color']);

const colorChoice = ref(props.color);

watch(colorChoice, () => {
    emit('update:color', rgbaToArray(colorChoice.value.rgba));
});

function rgbaToArray(rgba) {
    return [rgba.r / 255, rgba.g / 255, rgba.b / 255];
}
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
