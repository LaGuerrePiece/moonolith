<template></template>

<script setup>
// Imports pour vue 3
import { reactive, onMounted, toRefs, watch, ref } from 'vue';

// Imports des composants
import Grid from '../models/grid';
import Klon from '../models/klon';

// Imports des fonctionnalités
import { fetchImgur } from '../utils/network';
import { decode, getHighLow, preEncode, _base64ToArrayBuffer, toRGBA8, gridToArray } from '../utils/image-manager';
import mousePosition from 'mouse-position';
import Tool from '../models/tools';
import { chunkCreator, getChunk, getSupply } from '../utils/web3';

// Definition des props
const props = defineProps({
    tool: Number,
    color: String,
    hasBought: Object,
});

const emit = defineEmits(['boughtBack']);

function getPixelTot() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(33000); // ICI VIENDRA LE NOMBRE DE PIXELS PAYES SUR LA BLOCKCHAIN
        }, 500);
    });
}

let grid;
let canvas;
let position;
const nbColonne = 128;
const oldMousePosition = reactive({
    x: null,
    y: null,
});

getPixelTot()
    .then((leNombreMagiqueVenuDeLaBlockchain) => {
        const offsetFormule = nbColonne * 64;
        const pourcentage = 1.3;
        const formuleDeLaMort = offsetFormule + leNombreMagiqueVenuDeLaBlockchain * pourcentage;
        const nbLine = Math.floor(formuleDeLaMort / 128);
        // Gestion de la grille
        grid = new Grid(nbColonne, nbLine);
        grid.initialize(document.body);
        canvas = grid.pixels.canvas;
        position = ref(mousePosition(canvas));

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
                // console.log('boughtInstance AVANT', boughtInstance);
                emit('boughtBack');
                // props.hasBought.value = 0;
                // console.log('props.hasBought.value APRÉ', props.hasBought.value);
            }
        );
    })
    .then((res) => {
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
            grid.draw_pixel(newMousePosition.x, newMousePosition.y, new Klon(hexToRGB(props.color), Klon.PAINTED));
            // console.log('color', props.color)
            // console.log('color', hexToRGB(props.color))
            break;
        case Tool.ERASER:
            grid.erase_pixel(newMousePosition.x, newMousePosition.y);
            break;
        case Tool.TEXT:
            break;
        case Tool.MOVE:
            moveDrawing(newMousePosition.x, newMousePosition.y);
            break;
    }
}

function hexToRGB(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255,
        g = parseInt(hex.slice(3, 5), 16) / 255,
        b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
}

function startUsingTool() {
    // console.log('startUsingTool');
    switch (props.tool) {
        case Tool.MOVE:
            startUsingMove();
            break;
        default:
            useTool();
            break;
    }
    // canvas.onmousedown = restartUsingTool;
    canvas.onmousemove = useTool;
}

// function restartUsingTool() {
//     console.log('restartUsingTool');
//     canvas.onmousemove = useTool;
// }

function stopUsingTool() {
    // console.log('stopUsingTool');
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
let highLow, saveArray, nbPix, firstPix;

function startUsingMove() {
    let ret = gridToArray(grid);
    highLow = ret.highLow;
    saveArray = ret.saveArray;
    nbPix = ret.nbPix;
    firstPix = ret.firstPix;
}

function deleteDrawn() {
    console.log('boum');
}

function moveDrawing(x, y) {
    deleteDrawn();
    displayArrayToImage(saveArray, highLow.longueur, highLow.largeur, grid, x, y);
    console.log('RETOUR', highLow, saveArray, nbPix, firstPix);
}

async function displayImageFromArrayBuffer(grid, arrayBuffer, offsetx, offsety) {
    let decoded;
    // console.log('arrayBuffer du displayImage', arrayBuffer);
    decoded = await decode(arrayBuffer).catch(console.error);
    // console.log('decoded du displayImage', decoded);
    if (!decoded) return
    let array = toRGBA8(decoded);
    let width = decoded.width;
    let height = decoded.height;
    displayArrayToImage(array, width, height, grid, offsetx, offsety);
}

// async function displayImageFromUrl(grid, url, offsetx, offsety) {
// 	// a fix
// 	let image = await fetchImgur(url).catch(console.error);
// 	console.log('image', image);
// 	let decoded;
// 	if (image) decoded = await decode(image).catch(console.error);
// 	displayArrayToImage(decoded, grid, offsetx, offsety);
// }

function displayArrayToImage(array, width, height, grid, offsetx, offsety) {
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

// function displayArrayToImage(decoded, grid, offsetx, offsety) {
//     if (decoded) {
//         let array = toRGBA8(decoded);
//         console.log('arrayPixel RECU', array);
//         let width = decoded.width;
//         let height = decoded.height;
//         for (let y = 0; y < height; y++) {
//             for (let x = 0; x < width; x++) {
//                 let idx = (width * y + x) * 4;
//                 if (array[idx + 3] != 0)
//                     grid.draw_pixel(
//                         x + offsetx,
//                         y + offsety,
//                         new Klon([array[idx] / 255, array[idx + 1] / 255, array[idx + 2] / 255], Klon.PAID)
//                     );
//             }
//         }
//     }
// }
</script>

<style></style>
