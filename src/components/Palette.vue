<template>
    <VSwatches v-model="colorChoice" />
</template>

<script setup>
import { ref, watch } from 'vue';
import VSwatches from 'vue3-swatches';

const props = defineProps({
    color: String,
});

const emit = defineEmits(['update:color']);
const colorChoice = ref('#1FBC9C');
emit('update:color', colorChoice.value);

watch(colorChoice, () => {
    emit('update:color', colorChoice.value);
});
</script>
