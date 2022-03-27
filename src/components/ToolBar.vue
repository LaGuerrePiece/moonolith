<template>
    <div class="fab">
        <div class="toolbar">
            <ul class="items">
                <li class="item">
                    <a
                        class="menu-item"
                        :class="{ active: toolUsed === Tool.PEN }"
                        @click="toggleState(Tool.PEN)"
                        data-tooltip="Draw"
                        aria-label="Pen"
                    >
                        <span class="material-icons menu-item-icon"> brush </span>
                    </a>
                </li>
                <li>
                    <a
                        class="menu-item"
                        :class="{ active: toolUsed === Tool.ERASER }"
                        @click="toggleState(Tool.ERASER)"
                        data-tooltip="Erase"
                        aria-label="Eraser"
                    >
                        <i class="material-icons menu-item-icon"> backspace </i>
                    </a>
                </li>
                <li>
                    <a class="menu-item" :class="{}" @click="triggerSave()" data-tooltip="Text" aria-label="Text">
                        <i class="material-icons menu-item-icon"> font_download </i>
                    </a>
                </li>
                <li>
                    <a
                        class="menu-item"
                        :class="{ active: toolUsed === Tool.MOVE }"
                        @click="toggleState(Tool.MOVE)"
                        data-tooltip="Move"
                        aria-label="Move"
                    >
                        <i class="material-icons menu-item-icon"> circle </i>
                    </a>
                </li>
                <li>
                    <a
                        class="menu-item"
                        :class="{ active: toolUsed === Tool.DELETE }"
                        @click="toggleState(Tool.DELETE)"
                        data-tooltip="Delete"
                        aria-label="Delete"
                    >
                        <i class="material-icons menu-item-icon">delete</i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Tool from '../models/tools';

const emit = defineEmits(['toolChanged', 'saved']);

const showToolbar = ref(false);
const toolUsed = ref(Tool.PEN);

function toggleState(tool) {
    if (toolUsed.value === tool) toolUsed.value = Tool.DONE;
    else toolUsed.value = tool;
}

watch(toolUsed, (newVal, oldVal) => {
    if (newVal !== oldVal) emit('toolChanged', toolUsed.value);
});

watch(showToolbar, () => {
    if (!showToolbar.value) toolUsed.value = Tool.DONE;
});

function triggerSave() {
    console.log('acquis de conscience');
    emit('saved', 1);
}
</script>

<style scoped>
.fab {
    position: relative;
    display: flex;
    /* width: 56px; */
    /* left: 3vw;
    bottom: 4vh; */
}
.fab-action-button {
    cursor: pointer;
    position: relative;
    /* bottom: 4vh;
    left: 3vw; */
    display: inline-block;
    width: 56px;
    height: 56px;
    background-color: #2196f3;
    border-radius: 50%;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
}
.fab-action-button-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 37px !important;
    color: white;
}
/** FADE */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
/** DIAL */
/* Barre d'outils sans le fab button */
.toolbar {
    width: 280px;
    position: relative;
    left: 15px;
    /* bottom: 50%; */
    margin-bottom: 2px;
}
.items {
    list-style-type: none;
    display: flex;
}
.menu-item {
    border-radius: 100px;
    border: 2px solid #2196f3;
    text-align: center;
    /* float: left; */
    display: block;
    width: 50px;
    height: 50px;
    transition: all 0.3s ease;
    background: white;
    color: black;
    font-size: 30px;
    cursor: pointer;
    margin-right: 10px;
}
.menu-item:hover {
    background: #2196f3;
}
.menu-item-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.active {
    background-color: #2196f3;
}
.font {
    font-size: 1.25em;
    font-size: 1.25rem;
}
/** ICONS */
@font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: local('Material Icons'), local('MaterialIcons-Regular'),
        url(https://fonts.gstatic.com/s/materialicons/v17/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2)
            format('woff2');
}
.material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
}
ul {
    margin: 0;
    padding: 0;
    font-weight: normal;
}
[data-tooltip] {
    position: relative;
    z-index: 2;
    cursor: pointer;
}
/* Hide the tooltip content by default */
[data-tooltip]:before,
[data-tooltip]:after {
    visibility: hidden;
    -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
    filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
    opacity: 0;
    pointer-events: none;
}
/* Position tooltip above the element */
[data-tooltip]:before {
    position: absolute;
    bottom: 105%;
    left: 50%;
    margin-bottom: 5px;
    margin-left: -80px;
    padding: 7px;
    width: 160px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    background-color: #000;
    background-color: hsla(0, 0%, 20%, 0.9);
    color: #fff;
    content: attr(data-tooltip);
    text-align: center;
    font-size: 14px;
    line-height: 1.2;
}
/* Triangle hack to make tooltip look like a speech bubble */
[data-tooltip]:after {
    position: absolute;
    bottom: 105%;
    left: 50%;
    margin-left: -5px;
    width: 0;
    border-top: 5px solid #000;
    border-top: 5px solid hsla(0, 0%, 20%, 0.9);
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    content: ' ';
    font-size: 0;
    line-height: 0;
}
/* Show tooltip content on hover */
[data-tooltip]:hover:before,
[data-tooltip]:hover:after {
    visibility: visible;
    -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=100)';
    filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
    opacity: 1;
}
</style>
