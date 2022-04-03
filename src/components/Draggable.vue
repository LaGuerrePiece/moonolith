<template>
    <div
        :id="id"
        class="draggable"
        ref="draggable"
        :class="{ grabbing: dragging }"
        :style="{ ...position, display: 'flex', zIndex: '2'}"
    >
        <!-- @mouseup="stopDragging" -->
        <span
            class="material-icons drag-icon"
            :class="[dragging ? 'grabbing' : 'grabbable']"
            @mousedown="startDragging"
        >
            <svg width="20px" height="20px" viewBox="0 0 48 48" color="white" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" fill="white" fill-opacity="0.01" />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19 10.3075C19 12.6865 17.2091 14.615 15 14.615C12.7909 14.615 11 12.6865 11 10.3075C11 7.92854 12.7909 6 15 6C17.2091 6 19 7.92854 19 10.3075ZM15 28.615C17.2091 28.615 19 26.6865 19 24.3075C19 21.9285 17.2091 20 15 20C12.7909 20 11 21.9285 11 24.3075C11 26.6865 12.7909 28.615 15 28.615ZM15 42.615C17.2091 42.615 19 40.6865 19 38.3075C19 35.9285 17.2091 34 15 34C12.7909 34 11 35.9285 11 38.3075C11 40.6865 12.7909 42.615 15 42.615Z"
                    :fill="color"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M37 10.3075C37 12.6865 35.2091 14.615 33 14.615C30.7909 14.615 29 12.6865 29 10.3075C29 7.92854 30.7909 6 33 6C35.2091 6 37 7.92854 37 10.3075ZM33 28.615C35.2091 28.615 37 26.6865 37 24.3075C37 21.9285 35.2091 20 33 20C30.7909 20 29 21.9285 29 24.3075C29 26.6865 30.7909 28.615 33 28.615ZM33 42.615C35.2091 42.615 37 40.6865 37 38.3075C37 35.9285 35.2091 34 33 34C30.7909 34 29 35.9285 29 38.3075C29 40.6865 30.7909 42.615 33 42.615Z"
                    :fill="color"
                />
            </svg>
        </span>
        <slot></slot>
    </div>
</template>

<script setup>
import { reactive, ref, toRefs, watch } from 'vue';

const props = defineProps({
    active: Boolean,
    id: String,
    color: String,
});

// const id = ref(props.id)
const id = ref(props.id ?? generateID(4));
const defaultPosition = {
        bottom: 30 + 'px',
        left: (window.innerWidth/2 - 140) + 'px',
    };
const position = ref(defaultPosition);
const draggable = ref(null);
const dragging = ref(false);

const startPosition = reactive({
    x: null,
    y: null,
});

let offset = reactive({
    x: null,
    y: null,
});

function generateID(multiple5 = 1) {
    let id = '';
    for (let i = 0; i < multiple5; i++)
        id += Math.random()
            .toString(25)
            .replace(/[^a-z]+/g, '')
            .substring(0, 5);
    return id;
}

function startDragging(e) {
    e = e || window.event;
    // console.log("startDragging", e);
    dragging.value = true;
    e.preventDefault();

    offset.x = -12; 
    offset.y = -28;

    //console.log('offset.x', offset.x);
    //console.log('offset.y', offset.y);

    startPosition.x = e.clientX;
    startPosition.y = e.clientY;

    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag;
}

function stopDragging(e) {
    //console.log(e);
    e = e || window.event;
    // console.log("stopDragging", e);
    e.preventDefault();
    dragging.value = false;

    document.onmouseup = null;
    document.onmousemove = null;
}

function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();

    let currentPosition = { x: e.clientX + offset.x, y: e.clientY + offset.y };
    // console.log(draggable.value?.offsetLeft, draggable.value?.offsetTop, currentPosition)

    // console.log(window.innerHeight, window.innerWidth)
    if (currentPosition.x > window.innerWidth - 120) currentPosition.x = window.innerWidth - 120;
    else if (currentPosition.x < 20) currentPosition.x = 20;

    if (currentPosition.y > window.innerHeight - 80) currentPosition.y = window.innerHeight - 80;
    else if (currentPosition.y < 20) currentPosition.y = 20;

    position.value = {
        top: currentPosition.y + 'px',
        left: currentPosition.x + 'px',
    };
}
</script>

<style scoped>
.draggable {
    position: fixed;
}
.grabbable {
    cursor: grab;
}
.grabbing {
    cursor: grabbing;
}

.drag-icon {
    align-self: center;
}
</style>
