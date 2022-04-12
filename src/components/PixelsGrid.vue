<script setup>
// Imports pour vue 3
import { reactive, watch, ref } from 'vue';

// Imports des composants
import Grid from '../models/grid';
import Klon from '../models/klon';
import { addGridToCurrentEvent, closeCurrentEvent, undo, redo} from '../models/stack';

// Imports des fonctionnalités
import { fetchImgur } from '../utils/network';
import {
    decode,
    preEncode,
    _base64ToArrayBuffer,
    toRGBA8,
    gridToArray,
    hexToRGB,
    RGBToHex,
} from '../utils/image-manager';
import mousePosition from 'mouse-position';
import Tool from '../models/tools';
import { chunkCreator, getChunk, getSupply, getTotalPixs, getThreshold } from '../utils/web3';

// Definition des props
const props = defineProps({
    tool: Number,
    color: String,
    hasBought: Object,
    onDelete: Object,
    importedImage: Object,
});

const emit = defineEmits(['boughtBack', 'deleteBack', 'changeColor']);

// DISABLE RIGHT CLICK
document.addEventListener(
    'contextmenu',
    function (e) {
        e.preventDefault();
    },
    false
);

watch(
    () => props.onDelete.value,
    (deleteInstance) => {
        if (deleteInstance === 1) {
            addGridToCurrentEvent(structuredClone(grid.persistent))
            grid.erase_all_pixel()
        }
        emit('deleteBack');
    }
);

watch(
    () => props.importedImage?.value,
    (buffer) => {
        if (buffer) {
            displayImageFromArrayBuffer(grid, buffer, 1, 1, 999999, 0);
        }
    }
);

let grid;
let canvas;
let position;
const nbColonne = 170;
const oldMousePosition = reactive({
    x: null,
    y: null,
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'z') {
        grid = undo(grid)
    }
    if (e.ctrlKey && e.key === 'Z') {
        grid = redo(grid)
    }
});

getTotalPixs()
    .then(async (total) => {
        let klonSum = total.toNumber();
        const offsetFormule = nbColonne * 64;
        getThreshold().then(async (threshold) => {
            const formuleDeLaMort = offsetFormule + (klonSum * threshold) / 1000000;
            const nbLine = Math.floor(formuleDeLaMort / nbColonne);
            //const nbLine = 107;
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
                        canvas.onmousedown = null;
                        canvas.onmousemove = null;
                    } else {
                        canvas.onmouseup = stopUsingTool;
                        canvas.onmousedown = startUsingTool;
                    }
                }
            );

            watch(
                () => props.color,
                (color) => {
                    console.log(color);
                    colorPicked = props.color;
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
                }
            );
        });
    })
    .then((res) => {
        getSupply().then(async (supply) => {
            let s = supply.toNumber();
            for (let i = 1; i <= s; i++) {
                getChunk(i).then((res) => {
                    let pixelPaid = res[2].toNumber();
                    let index = res[0].toNumber();
                    let yMaxLegal = res[1].toNumber();
                    let x = index % grid.nbColumns;
                    let y = Math.floor(index / grid.nbColumns);
                    let arrBuffer = _base64ToArrayBuffer(res[3]);
                    displayImageFromArrayBuffer(grid, arrBuffer, x, y, pixelPaid, yMaxLegal, i);
                });
            }
        });
    });

function useTool() {
    let newMousePosition = mousePositionInGrid();
    if (newMousePosition.x === oldMousePosition.x && newMousePosition.y === oldMousePosition.y) return;
    // prettier-ignore
    switch (props.tool) {
        case Tool.SMOL:
            grid.draw_pixel(newMousePosition.x, newMousePosition.y, Klon.USERPAINTED, new Klon(hexToRGB(colorPicked), Klon.USERPAINTED));
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (newMousePosition.x + i < nbColonne && newMousePosition.x + i > -1)
                    grid.draw_pixel(newMousePosition.x + i, newMousePosition.y + j, Klon.USERPAINTED, new Klon(hexToRGB(colorPicked), Klon.USERPAINTED));
                    }
            }
            break;
        case Tool.HUGE:
            for (let i = -4; i <= 4; i++) {
                for (let j = -4; j <= 4; j++) {
                    if (newMousePosition.x + i < nbColonne && newMousePosition.x + i > -1)
                    grid.draw_pixel(newMousePosition.x + i, newMousePosition.y + j, Klon.USERPAINTED, new Klon(hexToRGB(colorPicked), Klon.USERPAINTED));
                    }
            }
            break;
        case Tool.MOVE:
            moveDrawing(newMousePosition.x, newMousePosition.y);
            break;
    }
}

function useDeleteTool() {
    let newMousePosition = mousePositionInGrid();
    if (newMousePosition.x === oldMousePosition.x && newMousePosition.y === oldMousePosition.y) return;
    // prettier-ignore
    switch (props.tool) {
        case Tool.SMOL:
            grid.erase_pixel(newMousePosition.x, newMousePosition.y);
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    grid.erase_pixel(newMousePosition.x + i, newMousePosition.y + j);
                    }
            }
            break;
        case Tool.HUGE:
            for (let i = -4; i <= 4; i++) {
                for (let j = -4; j <= 4; j++) {
                    grid.erase_pixel(newMousePosition.x + i, newMousePosition.y + j);
                    }
            }
            break;
    }
}

let colorPicked = '#b3e3da';

function useColorPicker() {
    let newMousePosition = mousePositionInGrid();
    colorPicked = grid.get_color(newMousePosition.x, newMousePosition.y, grid);
    colorPicked = RGBToHex(colorPicked[0], colorPicked[1], colorPicked[2]);
    console.log(colorPicked);
    if (colorPicked !== undefined) {
        emit('changeColor', colorPicked);
    }
}

function startUsingTool(e) {
    if (e.button == 0) {
        // if (props.tool === Tool.MOVE) addGridToCurrentEvent(grid)
        useTool();
        canvas.onmousemove = useTool;
    }
    if (e.button == 2) {
        useDeleteTool();
        canvas.onmousemove = useDeleteTool;
    }
    if (e.button == 1) {
        useColorPicker();
        canvas.onmousemove = useColorPicker;
    }
}

function stopUsingTool() {
    closeCurrentEvent()
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

function moveDrawing(x, y) {
    let highLow, saveArray, nbPix, firstPix;
    let ret = gridToArray(grid);
    highLow = ret.highLow;
    saveArray = ret.saveArray;
    nbPix = ret.nbPix;
    firstPix = ret.firstPix;
    grid.erase_all_pixel();
    console.log('l', highLow.largeur);
    console.log('L', highLow.longueur);
    console.log('lowx', highLow.lowX);
    let outx = x;
    let outy = y;
    if (outx > 127) outx = 127;
    if (outx < 0) outx = 0;
    displayArrayToImage(saveArray, highLow.largeur, grid, outx, outy, 999999, 999999, 0);
}

async function displayImageFromArrayBuffer(grid, arrayBuffer, offsetx, offsety, pixelPaid, yMaxLegal, zIndex) {
    let decoded;
    decoded = await decode(arrayBuffer).catch(console.error);
    if (!decoded) return;
    let array = toRGBA8(decoded);
    let width = decoded.width;
    displayArrayToImage(array, width, grid, offsetx, offsety, pixelPaid, yMaxLegal, zIndex);
}

function displayArrayToImage(array, width, grid, offsetx, offsety, pixelPaid, yMaxLegal, zIndex) {
    let pixelDrawn = 0;
    let decalage = 0;
    for (let y = 0; y < yMaxLegal; y++) {
        for (let x = 0; x < width; x++) {
            let idx = (width * y + x) * 4;
            if (array[idx + 3] != 0 && array[idx + 3] != 0 && pixelDrawn < pixelPaid) {
                if (pixelDrawn === 0) decalage = x;
                grid.draw_pixel(
                    x + offsetx - decalage,
                    y + offsety,
                    zIndex,
                    new Klon([array[idx] / 255, array[idx + 1] / 255, array[idx + 2] / 255], zIndex)
                );
                pixelDrawn++;
            }
        }
    }
}

</script>


<style></style>
