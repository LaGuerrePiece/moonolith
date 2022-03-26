<template></template>

<script setup>
// Imports pour vue 3
import { reactive, onMounted, toRefs, watch, ref } from 'vue';

// Imports des composants
import Grid from '../models/grid';
import Klon from '../models/klon';

// Imports des fonctionnalités
import { fetchImgur } from '../utils/network';
import { decode, getHighLow, preEncode, _base64ToArrayBuffer, toRGBA8 } from '../utils/image-manager';
import mousePosition from 'mouse-position';
import Tool from '../models/tools';
import { chunkCreator, getChunk, getSupply } from '../utils/web3';

// Definition des props
const props = defineProps({
    tool: Number,
    color: Array,
    hasBought: Object,
});
const oldMousePosition = reactive({
    x: null,
    y: null,
});

// Gestion de la grille
let grid = new Grid(128, 256);
grid.initialize(document.body);
let canvas = grid.pixels.canvas;
const position = ref(mousePosition(canvas));

canvas.onmouseup = stopUsingTool;
canvas.onmousedown = startUsingTool;

watch(
    () => props.tool,
    (code) => {
        if (code === Tool.DONE) {
            // stopUsingTool()
            canvas.onmousedown = null;
            canvas.onmousemove = null;
        } else {
            canvas.onmouseup = stopUsingTool;
            canvas.onmousedown = startUsingTool;
        }
    }
);

watch(
    () => props.hasBought.value,
    (boughtInstance) => {
        if (boughtInstance === 1) {
            preEncode(grid).then((res) => {
                chunkCreator(res);
            });
        }
        console.log('boughtInstance AVANT', boughtInstance);
        props.hasBought.value = 0;
        console.log('props.hasBought.value APRÉ', props.hasBought.value);
    }
);

onMounted(async () => {
    getSupply().then(async (supply) => {
        let s = supply.toNumber();
        for (let i = 1; i <= s; i++) {
            getChunk(i).then((res) => {
                let index = res[0].toNumber();
                let x = index % grid.nbColumns;
                let y = Math.floor(index / grid.nbColumns);
                let arrBuffer = _base64ToArrayBuffer(res[3]); // devrait etre equivalent a fetchUr
                displayImageFromArrayBuffer(grid, arrBuffer, x, y);
            });
        }
    });
});

function useTool() {
    if (props.tool === Tool.DONE) return;
    let newMousePosition = mousePositionInGrid();
    if (newMousePosition.x === oldMousePosition.x && newMousePosition.y === oldMousePosition.y) return;

    switch (props.tool) {
        case Tool.PEN:
            grid.draw_pixel(newMousePosition.x, newMousePosition.y, new Klon(props.color, Klon.PAINTED));
            break;
        case Tool.ERASER:
            grid.erase_pixel(newMousePosition.x, newMousePosition.y);
            break;
        case Tool.TEXT:
            break;
    }
}

function startUsingTool() {
    console.log('startUsingTool');
    canvas.onmousedown = restartUsingTool;
    canvas.onmousemove = useTool;
}

function restartUsingTool() {
    console.log('restartUsingTool');
    canvas.onmousemove = useTool;
}

function stopUsingTool() {
    console.log('stopUsingTool');
    // document.onmousedown = null
    canvas.onmousemove = null;
}

function mousePositionInGrid() {
    let screenx = document.documentElement.clientWidth;
    let screeny = document.documentElement.clientHeight;
    let pixelSize = screenx / grid.nbColumns;
    let nbPixely = screeny / pixelSize;
    let x = Math.floor((position.value[0] / screenx) * grid.nbColumns);
    let y = Math.floor((position.value[1] / screeny) * nbPixely);
    return { x, y };
}

async function displayImageFromArrayBuffer(grid, arrayBuffer, offsetx, offsety) {
    let decoded;
    // console.log('arrayBuffer du displayImage', arrayBuffer);
    decoded = await decode(arrayBuffer).catch(console.error);
    // console.log('decoded du displayImage', decoded);
    displayDecodedToImage(decoded, grid, offsetx, offsety);
}

// async function displayImageFromUrl(grid, url, offsetx, offsety) {
// 	// a fix
// 	let image = await fetchImgur(url).catch(console.error);
// 	console.log('image', image);
// 	let decoded;
// 	if (image) decoded = await decode(image).catch(console.error);
// 	displayDecodedToImage(decoded, grid, offsetx, offsety);
// }

function displayDecodedToImage(decoded, grid, offsetx, offsety) {
    if (decoded) {
        let array = toRGBA8(decoded);
        // console.log('arrayPixel RECU', array);
        let width = decoded.width;
        let height = decoded.height;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let idx = (width * y + x) * 4;
                if (array[idx + 3] != 0)
                    grid.draw_pixel(
                        x + offsetx,
                        y + offsety,
                        new Klon([array[idx] / 255, array[idx + 1] / 255, array[idx + 2] / 255], Klon.PAID)
                    );
            }
        }
    }
}
</script>

<style></style>
