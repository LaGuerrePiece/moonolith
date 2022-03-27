<template>
    <VSwatches v-model="colorChoice" />
</template>

<script setup>

import { ref, watch } from 'vue';
import VSwatches from "vue3-swatches";

const props = defineProps({
    color: String,
});

const emit = defineEmits(['update:color']);
const colorChoice = ref("#1FBC9C");
emit('update:color', colorChoice.value);

watch(colorChoice, () => {
    emit('update:color', colorChoice.value);
});

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