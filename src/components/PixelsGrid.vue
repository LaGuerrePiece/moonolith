<script setup>
// Imports pour vue 3
import { reactive, watch, ref } from 'vue';

// Imports des composants
import { draw_pixel, get_color, erase_all_pixel, erase_pixel, getMonolith} from '../models/monolith';
import DisplayGrid from '../models/displayGrid';
import Klon from '../models/klon';
import { closeCurrentEvent, undo, redo } from '../models/undoStack';

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
    moveDrawing, displayImageFromArrayBuffer, displayArrayToImage
} from '../utils/image-manager';
import mousePosition from 'mouse-position';
import Tool from '../models/tools';
import { chunkCreator, getChunk, getChunksFromPosition, getSupply, getTotalPixs, getThreshold } from '../utils/web3';
import { assemble } from '../models/assembler.js';


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
    function (e) {e.preventDefault()}, false
);


watch(() => props.onDelete.value,
    (deleteInstance) => {
        if (deleteInstance === 1) erase_all_pixel();
        emit('deleteBack');
    }
);

watch(() => props.importedImage?.value,
    (buffer) => {
        if (buffer) displayImageFromArrayBuffer(buffer, 1, 1, 999999, 99999, 0);
    }
);

document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'z') undo();
    if (e.metaKey && e.key === 'z') undo();
    if (e.ctrlKey && e.key === 'Z') redo();
    if (e.metaKey && e.key === 'Z') redo();
    if (e.ctrlKey && e.key === 'y') redo();
    if (e.metaKey && e.key === 'y') redo();
    if (e.key === 't') {
        viewPos += 1
        update()
    }
});

// SETUP OF DISPLAYGRID
let displayGrid;
let position;
let viewPos = 0;
let lastCall
let data
let diplayData = []

const nbColonneDisplay = 256;
const width = window.innerWidth
const height = window.innerHeight
const pixelSize = width / nbColonneDisplay
const displayGridHeight = Math.floor(height/pixelSize) + 2;

displayGrid = new DisplayGrid(nbColonneDisplay, displayGridHeight);
displayGrid.initialize(document.body);
let canvas = displayGrid.pixels.canvas;

position = ref(mousePosition(canvas));
console.log('displayGrid.length', displayGrid.length)

window.onwheel = function (e) {
    viewPos += e.deltaY * -0.01;
    if (viewPos < 0) {
        viewPos = 0
        return
    }
    update()
};

async function update() {
    if (new Date() - lastCall < 10) return;
    //data is the array of the displayed klons
    data = await assemble(nbColonneDisplay, displayGridHeight, 256, 362, 0, viewPos).then((data) => {
        displayGrid.updateDisplay(data)
        lastCall = new Date()
    })

}

canvas.onmouseup = stopUsingTool;
canvas.onmousedown = clickManager;

function clickManager(e) {
    let mousePos = mousePositionInGrid()
    let pos = mousePos.x + mousePos.y * nbColonneDisplay
    console.log('mousePos', pos)
    console.log('klon at this pos', data[pos])
    if (!data[pos].type) return
    switch (data[pos].type) {
        case 'monolith':
            startUsingTool(e)
            break
        case 'GUI':
            //Trigger GUI
            break
    }

}

function startUsingTool(e) {
    if (e.button == 0) {
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

function useTool() {
    let newMousePosition = mousePositionInGrid();
    let pos = data[newMousePosition.x + newMousePosition.y * nbColonneDisplay].index
    console.log('newMousePosition', newMousePosition)
    console.log('pos', pos)
    // prettier-ignore
    switch (props.tool) {
        case Tool.SMOL:
            draw_pixel(pos, Klon.USERPAINTED, new Klon(hexToRGB(colorPicked), Klon.USERPAINTED, 'Monolith'));
            break;
        // case Tool.BIG:
        //     for (let i = -1; i <= 1; i++) {
        //         for (let j = -1; j <= 1; j++) {
        //             if (newMousePosition.x + i < nbColonneDisplay && newMousePosition.x + i > -1)
        //             draw_pixel(newMousePosition.x + i, newMousePosition.y + j, Klon.USERPAINTED, new Klon(hexToRGB(colorPicked), Klon.USERPAINTED, 'Monolith'));
        //             }
        //     }
        //     break;
        // case Tool.HUGE:
        //     for (let i = -4; i <= 4; i++) {
        //         for (let j = -4; j <= 4; j++) {
        //             if (newMousePosition.x + i < nbColonneDisplay && newMousePosition.x + i > -1)
        //             draw_pixel(newMousePosition.x + i, newMousePosition.y + j, Klon.USERPAINTED, new Klon(hexToRGB(colorPicked), Klon.USERPAINTED, 'Monolith'));
        //             }
        //     }
        //     break;
        // case Tool.MOVE:
        //     moveDrawing(newMousePosition.x, newMousePosition.y);
        //     break;
    }
    update()
}

function useDeleteTool() {
    let newMousePosition = mousePositionInGrid();
    // prettier-ignore
    switch (props.tool) {
        case Tool.SMOL:
            erase_pixel(newMousePosition.x, newMousePosition.y);
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    erase_pixel(newMousePosition.x + i, newMousePosition.y + j);
                }
            }
            break;
        case Tool.HUGE:
            for (let i = -4; i <= 4; i++) {
                for (let j = -4; j <= 4; j++) {
                    erase_pixel(newMousePosition.x + i, newMousePosition.y + j);
                }
            }
            break;
    }
}

function stopUsingTool() {
    closeCurrentEvent();
    canvas.onmousemove = null;
}

function mousePositionInGrid() {
    let screenx = document.documentElement.clientWidth;
    let screeny = document.documentElement.clientHeight;
    let pixelSize = screenx / displayGrid.nbColumns;
    let nbPixely = screeny / pixelSize;
    let x = Math.floor((position.value[0] / screenx) * displayGrid.nbColumns);
    let y = Math.floor((position.value[1] / screeny) * nbPixely);
    return { x, y };
}


// watch(
//     () => props.tool,
//     (code) => {
//         if (code === Tool.DONE) {
//             canvas.onmousedown = null;
//             canvas.onmousemove = null;
//         } else {
//             canvas.onmouseup = stopUsingTool;
//             canvas.onmousedown = startUsingTool;
//         }
//     }
// );

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
            preEncode().then((res) => {
                chunkCreator(res);
            });
        }
    }
);





let colorPicked = '#b3e3da';

function useColorPicker() {
    let newMousePosition = mousePositionInGrid();
    colorPicked = get_color(newMousePosition.x, newMousePosition.y);
    colorPicked = RGBToHex(colorPicked[0], colorPicked[1], colorPicked[2]);
    console.log(colorPicked);
    if (colorPicked !== undefined) {
        emit('changeColor', colorPicked);
    }
}

// getTotalPixs()
//     .then(async (total) => {
//         // let klonSum = total.toNumber();
//         // const offsetFormule = nbColonne * 64;
//         getThreshold().then(async (threshold) => {
//         //     const formuleDeLaMort = offsetFormule + (klonSum * threshold) / 1000000;
//         //     // const nbLine = Math.floor(formuleDeLaMort / nbColonne);
//         //     const nbLine = 362;
//         //     console.log(`nbLine : ${nbLine}, nbColonne : ${nbColonne}`);

//         });
//     })
//     .then((res) => {
//         getSupply().then(async (supply) => {
//             let s = supply.toNumber();
//             //console.log('ici');
//             /* getChunksFromPosition(0, 15).then((chunks) => {
//                 for(let i = 0; i< chunks.length; i++) {
//                     let pixelPaid = chunks[i][2].toNumber();
//                     let index = chunks[i][0].toNumber();
//                     let yMaxLegal = chunks[i][1].toNumber();
//                     let x = index % monolith.nbColumns;
//                     let y = Math.floor(index / monolith.nbColumns);
//                     let arrBuffer = _base64ToArrayBuffer(chunks[i][3]);
//                     displayImageFromArrayBuffer(monolith, arrBuffer, x, y, pixelPaid, yMaxLegal, i);
//                 }
//             });*/

//             // for (let i = 1; i <= s; i++) {
//             //     getChunk(i).then((res) => {
//             //         let pixelPaid = res[2].toNumber();
//             //         let index = res[0].toNumber();
//             //         let yMaxLegal = res[1].toNumber();
//             //         let x = index % monolith.nbColumns;
//             //         let y = Math.floor(index / monolith.nbColumns);
//             //         let arrBuffer = _base64ToArrayBuffer(res[3]);
//             //         displayImageFromArrayBuffer(monolith, arrBuffer, x, y, pixelPaid, yMaxLegal, i);
//             //     });
//             // }
//         });
//     });

</script>

<style>
html, body {
    overflow: hidden;
}
</style>
