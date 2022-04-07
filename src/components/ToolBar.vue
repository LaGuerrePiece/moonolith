<template>
    <div class="fab">
        <div class="toolbar">
            <ul class="items">
                <li class="item">
                    <a
                        class="menu-item"
                        :class="{ active: toolUsed === Tool.SMOL }"
                        @click="toggleState(Tool.SMOL)"
                        data-tooltip="Draw"
                        aria-label="Pen"
                    >
                        <span class="material-icons menu-item-icon"> brush </span>
                    </a>
                </li>
                <li>
                    <a
                        class="menu-item"
                        :class="{ active: toolUsed === Tool.BIG }"
                        @click="toggleState(Tool.BIG)"
                        @keyup.tab="toggleState(Tool.BIG)"
                        data-tooltip="Erase"
                        aria-label="Eraser"
                    >
                        <i class="material-icons menu-item-icon"> backspace </i>
                    </a>
                </li>
                <li>
                    <a class="menu-item" :class="{}" @click="emit('saved')" data-tooltip="Save" aria-label="Save">
                        <i class="material-icons menu-item-icon" style="width: 48px"> save_alt </i>
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
                        <i class="material-icons menu-item-icon"> open_with </i>
                    </a>
                </li>
                <li>
                    <a class="menu-item" :class="{}" @click="emit('delete')" data-tooltip="Delete" aria-label="Delete">
                        <i class="material-icons menu-item-icon"> delete </i>
                    </a>
                </li>
                <li>
                    <a class="menu-item" :class="{}" @click="clickOnButton()" data-tooltip="import" aria-label="import">
                        <i class="material-icons menu-item-icon"> publish </i>
                    </a>
                    <input class="hidden" id="fileButton" ref="file" v-on:change="importImage()" type="file" />
                </li>
                <li>
                    <a
                        class="menu-item"
                        :class="{}"
                        @click="emit('placeholder2')"
                        data-tooltip="placeholder2"
                        aria-label="placeholder2"
                    >
                        <i class="material-icons menu-item-icon"> help_outline </i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Tool from '../models/tools';

const file = ref(null);
const showToolbar = ref(false);
const toolUsed = ref(Tool.PEN);
const emit = defineEmits(['toolChanged', 'saved', 'delete', 'import']);

function clickOnButton() {
    document.getElementById('fileButton').click();
}

function importImage() {
    let importedImage = file.value.files[0];

    const readImageBuffer = (img) =>
        new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsArrayBuffer(img);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    readImageBuffer(importedImage).then((res) => {
        // console.log('buffer de ToolBar vers App', res);
        emit('import', res);
    });
}

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
</script>

<style scoped>
.hidden {
    display: none;
}
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
    background-color: #6c5671;
    border-radius: 50%;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
}
.fab-action-button-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 37px !important;
    color: #fff7e4;
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
    width: 750px;
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
    border: 2px solid #6c5671;
    text-align: center;
    /* float: left; */
    display: block;
    width: 90px;
    height: 90px;
    transition: all 0.3s ease;
    background: #fff7e4;
    color: #28282e;
    font-size: 30px;
    cursor: pointer;
    margin-right: 10px;
}
.menu-item:hover {
    background: #6c5671;
}
.menu-item-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.active {
    background-color: #6c5671;
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
    font-size: 62px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    font-feature-settings: normal;
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
