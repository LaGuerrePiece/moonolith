// Imports des composants
import { draw_pixel, get_color, erase_all_pixel, erase_pixel, monolith } from './models/monolith';
import DisplayGrid from './models/displayGrid';
import Klon from './models/klon';
import { closeCurrentEvent, undo, redo } from './models/undoStack';

// Imports des fonctionnalités
import { fetchImgur } from './utils/network';
import {
    decode,
    preEncode,
    _base64ToArrayBuffer,
    toRGBA8,
    gridToArray,
    hexToRGB,
    RGBToHex,
    moveDrawing,
    displayImageFromArrayBuffer,
} from './utils/image-manager';
import Tool from './models/tools';
import Const from './models/constants';
import { chunkCreator, getChunk, getChunksFromPosition, getSupply, getTotalPixs, getThreshold } from './utils/web3';
import { assemble, marginBot, marginLeft } from './models/assembler';

document.addEventListener(
    'contextmenu',
    (e) => {
        e.preventDefault();
    },
    false
);

document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key === 'z') undo();
    if (e.metaKey && e.key === 'z') undo();
    if (e.ctrlKey && e.key === 'Z') redo();
    if (e.metaKey && e.key === 'Z') redo();
    if (e.ctrlKey && e.key === 'y') redo();
    if (e.metaKey && e.key === 'y') redo();
    if (e.key === 'u') console.log('CONST', Const);
    if (e.key === 't') {
        update();
    }
});

/**********************************
 ************* DISPLAY ************
 **********************************/

let displayGrid;
let viewPosY = 0;
let viewPosX = 0;
let lastCall = 0;
let displayData;

const height = window.innerHeight;
const width = window.innerWidth;
const renderWidth = 256;
const pixelSize = width / renderWidth;
const renderHeight = Math.floor(height / pixelSize) + 2;

displayGrid = new DisplayGrid(renderWidth, renderHeight);
displayGrid.initialize(document.body);
let canvas = displayGrid.pixels.canvas;

window.onwheel = function (e) {
    if (e.deltaY > 0) {
        viewPosY -= 3;
    } else {
        viewPosY += 3;
    }

    if (viewPosY < 0) {
        viewPosY = 0;
        return;
    }
    update();
};

async function update() {
    if (new Date() - lastCall < 30) return;
    //data is the array of the displayed klons
    await assemble(renderWidth, renderHeight, 0, viewPosY).then((data) => {
        displayData = data;
        displayGrid.updateDisplay(displayData);
        lastCall = new Date();
    });
}

/**********************************
 ************* TOOLS **************
 **********************************/

let tool = Tool.HUGE;

canvas.onmousedown = clickManager;

function clickManager(e) {
    let mousePos = mousePosInGrid(e);
    if (mousePos.y > renderHeight - 6 && mousePos.x < 65) {
        //CASE GUI
        if (mousePos.x < 30) {
            colorPicked =
                mousePos.x < 5
                    ? Const.HEX1
                    : mousePos.x < 10
                    ? Const.HEX2
                    : mousePos.x < 15
                    ? Const.HEX10
                    : mousePos.x < 20
                    ? Const.HEX4
                    : mousePos.x < 25
                    ? Const.HEX5
                    : Const.HEX6;
            console.log('colorPicked', colorPicked);
        }
        if (mousePos.x >= 30 && mousePos.x < 35) tool = Tool.SMOL;
        if (mousePos.x >= 35 && mousePos.x < 40) tool = Tool.BIG;
        if (mousePos.x >= 40 && mousePos.x < 45) tool = Tool.HUGE;
        if (mousePos.x >= 45 && mousePos.x < 50) console.log('save!');
        if (mousePos.x >= 50 && mousePos.x < 55) console.log('move!');
        if (mousePos.x >= 55 && mousePos.x < 60) {
            erase_all_pixel();
            update();
        }
        if (mousePos.x >= 60 && mousePos.x < 65) importImage();
    } else {
        //CASE MONOLITH
        mousePos = convertToMonolithPos(mousePos);
        if (
            mousePos.x < 0 ||
            mousePos.x >= Const.MONOLITH_COLUMNS ||
            mousePos.y < 0 ||
            mousePos.y >= Const.MONOLITH_ROWS
        )
            return; // out of bounds
        startUsingTool(e, mousePos);
    }
}

function importImage() {
    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (res) => {
            let importedImage = res.target.result; // this is the content!
            console.log('importedImage', importedImage);

            displayImageFromArrayBuffer(importedImage, 1, 1, 999999, 99999, 0).then((res) => {
                console.log('decoded', res);
                displayArrayToImage(res.array, res.width, 1, 1, 999999, 99999, 0);
            });

            // convert res to base64
            let base64 = btoa(
                new Uint8Array(importedImage).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            console.log('base64', base64);
        };
    };
    input.click();
}

function displayArrayToImage(array, width, offsetx, offsety, pixelPaid, yMaxLegal, zIndex) {
    console.log('FONCTION A REFAIRE MARCHER, DUPLICATE DANS IMAGE-MANAGER');
    let pixelDrawn = 0;
    let decalage = 0;
    for (let y = 0; y < yMaxLegal; y++) {
        for (let x = 0; x < width; x++) {
            let idx = (width * y + x) * 4;
            if (array[idx + 3] != 0 && array[idx + 3] != 0 && pixelDrawn < pixelPaid) {
                if (pixelDrawn === 0) decalage = x;
                draw_pixel(
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

function startUsingTool(e, mousePos) {
    if (e.button == 0) {
        useTool(mousePos);
        canvas.onmousemove = useTool;
        canvas.onmouseup = stopUsingTool;
    }
    if (e.button == 2) {
        useDeleteTool(mousePos);
        canvas.onmousemove = useDeleteTool;
        canvas.onmouseup = stopUsingTool;
    }
    if (e.button == 1) {
        useColorPicker(mousePos);
    }
}

function useTool(e) {
    //IF E IS PASSED IT'S ALREADY FORMATED, ELSE IT'S A MOUSE EVENT
    const mousePos = e.type ? convertToMonolithPos(mousePosInGrid({ x: e.x, y: e.y })) : e;
    switch (tool) {
        case Tool.SMOL:
            draw_pixel(mousePos.x, mousePos.y, Klon.USERPAINTED, hexToRGB(colorPicked));
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (mousePos.x + i < renderWidth && mousePos.x + i > -1)
                        draw_pixel(mousePos.x + i, mousePos.y + j, Klon.USERPAINTED, hexToRGB(colorPicked));
                }
            }
            break;
        case Tool.HUGE:
            for (let i = -4; i <= 4; i++) {
                for (let j = -4; j <= 4; j++) {
                    if (mousePos.x + i < renderWidth && mousePos.x + i > -1)
                        draw_pixel(mousePos.x + i, mousePos.y + j, Klon.USERPAINTED, hexToRGB(colorPicked));
                }
            }
            break;
        case Tool.MOVE:
            moveDrawing(mousePos.x, mousePos.y);
            break;
    }
    update();
}

function useDeleteTool(e) {
    //IF E IS PASSED IT'S ALREADY FORMATED, ELSE IT'S A MOUSE EVENT
    const mousePos = e.type ? convertToMonolithPos(mousePosInGrid({ x: e.x, y: e.y })) : e;
    switch (tool) {
        case Tool.SMOL:
            console.log('delete pixel');
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
    update();
}

function stopUsingTool() {
    closeCurrentEvent();
    canvas.onmousemove = null;
}

function mousePosInGrid(e) {
    return { x: Math.floor((e.x / width) * renderWidth), y: Math.floor((e.y / height) * renderHeight) };
}

let colorPicked = '#b3e3da';

function useColorPicker(mousePos) {
    colorPicked = get_color(mousePos.x, mousePos.y);
    colorPicked = RGBToHex(colorPicked[0], colorPicked[1], colorPicked[2]);
    console.log(colorPicked);
    if (colorPicked !== undefined) {
        emit('changeColor', colorPicked);
    }
}

setTimeout(() => {
    update();
}, 200);

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
    mousePos.y = Const.MONOLITH_ROWS + marginBot - viewPosY - renderHeight + mousePos.y;
    mousePos.x = viewPosX - marginLeft + mousePos.x;
    return mousePos;
}
