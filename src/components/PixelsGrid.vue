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
import { chunkCreator, getChunk, getSupply, getTotalPixs } from '../utils/web3';

// Definition des props
const props = defineProps({
    tool: Number,
    color: String,
    hasBought: Object,
    onDelete: Object,
    onAddRow: Object,
});

const emit = defineEmits(['boughtBack', 'deleteBack']);


watch(
    () => props.onDelete.value,
    (deleteInstance) => {
        if (deleteInstance === 1) {
            console.log('SUPPRESSION!');
            grid.delete_user_pixel();
        }
        emit('deleteBack');
    }
);

watch(
    () => props.onAddRow.value,
    () => {
        console.log('add a row !');
        
        let newGrid = new Grid(nbColonne, grid.nbRows + 1);
        newGrid.initialize(document.body);
        let newCanvas = newGrid.pixels.canvas;
        position = ref(mousePosition(newCanvas));

        newCanvas.style.position = "absolute"
        newCanvas.style.top = "0px"
        newCanvas.style.left = "0px"
        newCanvas.style["z-index"] = "0"

        for (let i = 0; i < grid.length; i++) {
            newGrid.persistent[i] = grid.persistent[i]
        }
        
        setTimeout(function(){
            canvas.remove()
            canvas = newCanvas
            canvas.style["z-index"] = "1"
            grid = newGrid
            canvas.onmouseup = stopUsingTool;
            canvas.onmousedown = startUsingTool;
        }, 1000);

    }
);


let grid;
let canvas;
let position;
const nbColonne = 128;
const oldMousePosition = reactive({
    x: null,
    y: null,
});

getTotalPixs().then(async (total) => {
        let leNombreMagiqueVenuDeLaBlockchain = total.toNumber();
        console.log(leNombreMagiqueVenuDeLaBlockchain)
        const offsetFormule = nbColonne * 64;
        const pourcentage = 1.3;
        const formuleDeLaMort = offsetFormule + leNombreMagiqueVenuDeLaBlockchain * pourcentage;
        const nbLine = Math.floor(formuleDeLaMort / 128);
        // Gestion de la grille
        grid = new Grid(nbColonne, nbLine);
        grid.initialize(document.body);
        canvas = grid.pixels.canvas;

        canvas.style.position = "absolute"
        canvas.style.top = "0px"
        canvas.style.left = "0px"
        canvas.style["z-index"] = "1"
        
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
                emit('boughtBack');
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
    switch (props.tool) {
        case Tool.MOVE:
            startUsingMove();
            break;
        default:
            useTool();
            break;
    }
    canvas.onmousemove = useTool;
}

function stopUsingTool() {
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

function moveDrawing(x, y) {
    grid.delete_user_pixel()
    displayArrayToImage(saveArray, highLow.longueur, highLow.largeur, grid, x, y, 1);
    // console.log('RETOUR', highLow, saveArray, nbPix, firstPix);
}

async function displayImageFromArrayBuffer(grid, arrayBuffer, offsetx, offsety) {
    let decoded;
    decoded = await decode(arrayBuffer).catch(console.error);
    if (!decoded) return;
    let array = toRGBA8(decoded);
    let width = decoded.width;
    let height = decoded.height;
    displayArrayToImage(array, width, height, grid, offsetx, offsety, 2);
}

function displayArrayToImage(array, width, height, grid, offsetx, offsety, author) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let idx = (width * y + x) * 4;
            if (array[idx + 3] != 0)
                grid.draw_pixel(
                    x + offsetx,
                    y + offsety,
                    new Klon([array[idx] / 255, array[idx + 1] / 255, array[idx + 2] / 255], author)
                );
        }
    }
}
</script>

<style></style>
