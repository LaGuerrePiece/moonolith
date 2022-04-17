<script setup>
// Imports pour vue 3
import { watch, ref } from 'vue';

// Imports des composants
import { draw_pixel, get_color, erase_all_pixel, erase_pixel, monolith, nbColumnsMonolith, nbRowsMonolith} from '../models/monolith';
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
import Tool from '../models/tools';
import { chunkCreator, getChunk, getChunksFromPosition, getSupply, getTotalPixs, getThreshold } from '../utils/web3';
import { assemble, marginBot, marginLeft } from '../models/assembler';

/**********************************
 ************* VUE ****************
 **********************************/

const props = defineProps({
    tool: Number,
    color: String,
    hasBought: Object,
    onDelete: Object,
    importedImage: Object,
});

const emit = defineEmits(['boughtBack', 'deleteBack', 'changeColor']);

document.addEventListener(
    'contextmenu',
    (e) => {e.preventDefault()}, false
);

watch(() => props.onDelete.value,
    (deleteInstance) => {
        if (deleteInstance === 1) erase_all_pixel()
        emit('deleteBack');
    }
);

watch(() => props.importedImage?.value,
    (buffer) => {
        if (buffer) displayImageFromArrayBuffer(buffer, 1, 1, 999999, 99999, 0);
    }
);

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


document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'z') undo();
    if (e.metaKey && e.key === 'z') undo();
    if (e.ctrlKey && e.key === 'Z') redo();
    if (e.metaKey && e.key === 'Z') redo();
    if (e.ctrlKey && e.key === 'y') redo();
    if (e.metaKey && e.key === 'y') redo();
    if (e.key === 't') {
        update({monolithOnly: true})
    }
});

/**********************************
 ************* DISPLAY ************
 **********************************/

let displayGrid;
let viewPosY = 0;
let viewPosX = 0;
let lastCall = 0
let displayData

const nbColonneDisplay = 256;
const width = window.innerWidth
const height = window.innerHeight
const pixelSize = width / nbColonneDisplay
const displayGridHeight = Math.floor(height/pixelSize) + 2;

displayGrid = new DisplayGrid(nbColonneDisplay, displayGridHeight);
displayGrid.initialize(document.body);
let canvas = displayGrid.pixels.canvas;

console.log('displayGrid.length', displayGrid.length)

window.onwheel = function (e) {
    if (e.deltaY > 0) {
        viewPosY -= 3;
    } else {
        viewPosY += 3;
    }

    if (viewPosY < 0) {
        viewPosY = 0
        return
    }
    update()
};

async function update() {
    if (new Date() - lastCall < 30) return;
    //data is the array of the displayed klons
    await assemble(nbColonneDisplay, displayGridHeight, 256, 362, 0, viewPosY).then((data) => {
        displayData = data
        displayGrid.updateDisplay(displayData)
        lastCall = new Date()
    })
}

/**********************************
 ************* TOOLS **************
 **********************************/

canvas.onmousedown = clickManager;

function clickManager(e) {
    let mousePos = mousePosInGrid(e)
    console.log('x', mousePos.x, 'y', mousePos.y)
    console.log('displayGridHeight', displayGridHeight)
    if (mousePos.y > displayGridHeight - 6 && mousePos.x < 60) {
        //CASE GUI
        console.log('clicked on the GUI')
        colorPicked = mousePos.x < 5 ? '#FF0000'
                    : mousePos.x < 10 ? '#00FF00'
                    : mousePos.x < 15 ? '#0000FF'
                    : mousePos.x < 20 ? '#FFFF00'
                    : mousePos.x < 25 ? '#FF00FF'
                    : mousePos.x < 30 ? '#00FFFF'
                    : '#000000'
        console.log('colorPicked', colorPicked)
    } else {
        //CASE MONOLITH
        mousePos = convertToMonolithPos(mousePos)
        if (mousePos.x < 0 || mousePos.x >= nbColumnsMonolith || mousePos.y < 0 || mousePos.y >= nbRowsMonolith) return; // out of bounds
        startUsingTool(e, mousePos)
    }
}

function startUsingTool(e, mousePos) {
    if (e.button == 0) {
        useTool(mousePos)
        canvas.onmousemove = useTool
        canvas.onmouseup = stopUsingTool
    }
    if (e.button == 2) {
        useDeleteTool(mousePos)
        canvas.onmousemove = useDeleteTool
        canvas.onmouseup = stopUsingTool
    }
    if (e.button == 1) {
        useColorPicker(mousePos);
    }
}

function useTool(e) {
    //IF E IS PASSED IT'S ALREADY FORMATED, ELSE IT'S A MOUSE EVENT
    const mousePos = e.type ? convertToMonolithPos(mousePosInGrid({x: e.x, y: e.y})) : e
    switch (props.tool) {
        case Tool.SMOL:
            draw_pixel(mousePos.x, mousePos.y, Klon.USERPAINTED, hexToRGB(colorPicked));
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (mousePos.x + i < nbColonneDisplay && mousePos.x + i > -1)
                    draw_pixel(mousePos.x + i, mousePos.y + j, Klon.USERPAINTED, hexToRGB(colorPicked));
                    }
            }
            break;
        case Tool.HUGE:
            for (let i = -4; i <= 4; i++) {
                for (let j = -4; j <= 4; j++) {
                    if (mousePos.x + i < nbColonneDisplay && mousePos.x + i > -1)
                    draw_pixel(mousePos.x + i, mousePos.y + j, Klon.USERPAINTED, hexToRGB(colorPicked));
                    }
            }
            break;
        case Tool.MOVE:
            moveDrawing(mousePos.x, mousePos.y);
            break;
    }
    update()
}

function useDeleteTool(e) {
    //IF E IS PASSED IT'S ALREADY FORMATED, ELSE IT'S A MOUSE EVENT
    const mousePos = e.type ? convertToMonolithPos(mousePosInGrid({x: e.x, y: e.y})) : e
    switch (props.tool) {
        case Tool.SMOL:
            console.log('delete pixel')
            erase_pixel(mousePos.x, mousePos.y);
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    erase_pixel(mousePos.x + i, mousePos.y + j);
                }
            }
            break;
        case Tool.HUGE:
            for (let i = -4; i <= 4; i++) {
                for (let j = -4; j <= 4; j++) {
                    erase_pixel(mousePos.x + i, mousePos.y + j);
                }
            }
            break;
    }
    update()
}

function stopUsingTool() {
    closeCurrentEvent();
    canvas.onmousemove = null;
}

function mousePosInGrid(e) {
    return { x: Math.floor((e.x / width) * nbColonneDisplay), y: Math.floor((e.y / height) * displayGridHeight) };
}



let colorPicked = '#b3e3da';

function useColorPicker(mousePos) {
    console.log('colorPicker mousePos', mousePos);
    colorPicked = get_color(mousePos.x, mousePos.y);
    colorPicked = RGBToHex(colorPicked[0], colorPicked[1], colorPicked[2]);
    console.log(colorPicked);
    if (colorPicked !== undefined) {
        emit('changeColor', colorPicked);
    }
}

setTimeout(() => {update()}, 200);

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

function convertToMonolithPos(mousePos) {
    mousePos.y = nbRowsMonolith + marginBot - viewPosY - displayGridHeight + mousePos.y;
    mousePos.x = viewPosX - marginLeft + mousePos.x;
    return mousePos;
}

</script>

<style>
html, body {
    overflow: hidden;
}
</style>
