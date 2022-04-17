<script setup>
// Imports pour vue 3
import { reactive, watch, ref } from 'vue';

// Imports des composants
import { draw_pixel, get_color, erase_all_pixel, erase_pixel, monolith} from '../models/monolith';
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
import { assemble, marginBot, marginLeft } from '../models/assembler';
import { nbRows } from '../models/monolith';


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
    (e) => {e.preventDefault()}, false
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
        viewPosY += 1
        update()
    }
});

// SETUP OF DISPLAYGRID
let displayGrid;
let position;
let viewPosY = 0;
let viewPosX = 0;
let lastCall
let displayData

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

canvas.onmouseup = stopUsingTool;
canvas.onmousedown = clickManager;

function clickManager(e) {
    let mousePos = mousePositionInGrid()
    console.log('x', mousePos.x, 'y', mousePos.y)
    if (mousePos.x == 4 && mousePos.y == 4) {
        //CASE GUI
        console.log('clicked on the GUI')
    } else {
        mousePos = convertToMonolithPos(mousePos)
        console.log('converted x', mousePos.x, 'converted y', mousePos.y)
        if (monolith[mousePos.y]?.[mousePos.x]) {
            //CASE MONOLITH
            console.log('clicked on the Monolith')
            startUsingTool(e)
        }
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
    let mousePos = convertToMonolithPos(mousePositionInGrid());
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

function useDeleteTool() {
    let mousePos = mousePositionInGrid();
    // prettier-ignore
    switch (props.tool) {
        case Tool.SMOL:
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
}

function stopUsingTool() {
    closeCurrentEvent();
    canvas.onmousemove = null;
}

function mousePositionInGrid() {
    let x = Math.floor((position.value[0] / width) * nbColonneDisplay);
    let y = Math.floor((position.value[1] / height) * displayGridHeight);
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

function convertToMonolithPos(mousePos) {
    mousePos.y = nbRows + marginBot - viewPosY - displayGridHeight + mousePos.y;
    mousePos.x = viewPosX - marginLeft + mousePos.x;
    return mousePos;
}

</script>

<style>
html, body {
    overflow: hidden;
}
</style>
