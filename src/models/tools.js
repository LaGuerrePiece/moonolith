//prettier-ignore
import { windowHeight, windowWidth, renderWidth, renderHeight, changeViewPos, viewPosX, viewPosY, zoom, canvas} from '../main';
import { imageCatalog } from '../assets/imageData';
import { toggleMusic, playSound } from '../assets/sounds';
import {
    drawPixel,
    getColor,
    eraseAllPixel,
    erasePixel,
    convertToMonolithPos,
    increaseMonolithHeight,
} from './monolith';
import Klon from './klon';
import { closeCurrentEvent, undo, redo } from './undoStack';

import { moveDrawing, bufferOnMonolith, saveToEthernity, APNGtoMonolith } from '../utils/imageManager';
import Const from './constants';

//prettier-ignore
export class Tool {

    static get DONE() { return 0 }
    static get SMOL() { return 1 }
    static get BIG() { return 3 }
    static get HUGE() { return 4 }
    static get GIGA() { return 5 }
    static get PIPETTE() { return 2 }
    static get DELETE() { return 6 }
    static get MOVE() { return 7 }
}

export let tool = Tool.HUGE;
let colorPicked1 = Const.RGB2;
let colorPicked2 = Const.RGB8;

//prettier-ignore
export function keyManager(e){
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {undo(); return}
    if ((e.metaKey || e.ctrlKey ) && (e.key === 'Z' || e.key === 'y')) {redo(); return}
    if (e.key === 'x') eraseAllPixel();
    if (e.key === 'c') console.log('Total H', Const.COLUMNS, 'Total W', Const.LINES, 'render W', renderWidth, 'render H', renderHeight, 'viewPosX', viewPosX, 'viewPosY', viewPosY);
    if (e.key === 'm') { moveDrawing(50, 400) }
    if (e.key === 'e') brushSwitch();
    if (e.key === 'i') importImage();
    if (e.key === 'r') {tool = Tool.GIGA; playSound('kick');}
    if (e.key === 'k') toggleMusic();
    if (e.key === 'p') increaseMonolithHeight(1000)
    if (e.key === 't') { changeViewPos(0, 999999); }

    switch (e.code || e.key || e.keyCode) {
        case 'KeyW':
        case 'ArrowUp':
        case 'Numpad8':
        case 38: // keyCode for arrow up
        changeViewPos(0, 6)
        break;

        case 'KeyA':
        case 'ArrowLeft':
        case 'Numpad4':
        case 37: // keyCode for arrow left
        changeViewPos(-6, 0)
        break;

        case 'KeyS':
        case 'ArrowDown':
        case 'Numpad5':
        case 'Numpad2':
        case 40: // keyCode for arrow down
        changeViewPos(0, -6)
        break;

        case 'KeyD':
        case 'ArrowRight':
        case 'Numpad6':
        case 39: // keyCode for arrow right
        changeViewPos(6, 0)
        break;

        case 'KeyZ':
        zoom();
        playSound('click6');
        break;
      }
}

export function scrollManager(e) {
    if (e.deltaY > 0) {
        changeViewPos(0, -6);
    } else {
        changeViewPos(0, 6);
    }
}

export function clickManager(e) {
    let mousePos = mousePosInGrid(e);
    // console.log('mousePos', mousePos);

    const GUIstartY = Math.floor((renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y);
    const GUIstartX = Math.floor((renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X);
    if (
        mousePos.x > GUIstartX &&
        mousePos.x < GUIstartX + imageCatalog.palette.width &&
        mousePos.y > GUIstartY &&
        mousePos.y < GUIstartY + imageCatalog.palette.height
    ) {
        //CASE : CLICK ON THE GUI

        //BIG
        if (GUICircle(mousePos, GUIstartY, GUIstartX, 7, 7, 8)) {
            saveToEthernity();
            return;
        } // !!! BUTTON
        if (GUICircle(mousePos, GUIstartY, GUIstartX, 7, 91, 8)) {
            brushSwitch();
            return;
        } // ??? BUTTON

        playSound('click6');
        //SMALL
        //FIRST CIRCLE POSITION : 3, 21
        if (GUICircle(mousePos, GUIstartY, GUIstartX, 3, 21, 4)) colorSwitch(e, 1);
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 1, 3, 21, 4)) colorSwitch(e, 2);
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 2, 3, 21, 4)) colorSwitch(e, 3);
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 3, 3, 21, 4)) colorSwitch(e, 4);
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 4, 3, 21, 4)) colorSwitch(e, 5);
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 5, 3, 21, 4)) colorSwitch(e, 6);
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 6, 3, 21, 4)) colorSwitch(e, 7);
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 7, 3, 21, 4)) colorSwitch(e, 8);
        //ROW 2
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX, 3, 21, 4)) colorSwitch(e, 9);
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 1, 3, 21, 4)) colorSwitch(e, 10);
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 2, 3, 21, 4)) colorSwitch(e, 11);
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 3, 3, 21, 4)) colorSwitch(e, 12);
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 4, 3, 21, 4)) colorSwitch(e, 13);
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 5, 3, 21, 4)) colorSwitch(e, 14);
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 6, 3, 21, 4)) colorSwitch(e, 15);
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 7, 3, 21, 4)) colorSwitch(e, 16);
    } else {
        //CASE MONOLITH OR LANDSCAPE
        convertToMonolithPos(mousePos);
        if (mousePos) startUsingTool(e, mousePos);
    }
}

function GUICircle(mousePos, GUIstartY, GUIstartX, y, x, radius) {
    // Coordinates of the center are input in the GUI
    y += GUIstartY;
    x += GUIstartX;
    return Math.floor(mousePos.x - x) ** 2 + Math.floor(mousePos.y - y) ** 2 <= radius ** 2;
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
    if (!mousePos) return;

    switch (tool) {
        case Tool.SMOL:
            drawPixel(mousePos.x, mousePos.y, Klon.USERPAINTED, colorPicked1);
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, Klon.USERPAINTED, colorPicked1);
                }
            }
            break;
        case Tool.HUGE:
            for (let i = -2; i <= 2; i++) {
                for (let j = -2; j <= 2; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, Klon.USERPAINTED, colorPicked1);
                }
            }
            for (let i = -1; i <= 1; i++) {
                drawPixel(mousePos.x + i, mousePos.y + 3, Klon.USERPAINTED, colorPicked1);
                drawPixel(mousePos.x + i, mousePos.y - 3, Klon.USERPAINTED, colorPicked1);
                drawPixel(mousePos.x + 3, mousePos.y + i, Klon.USERPAINTED, colorPicked1);
                drawPixel(mousePos.x - 3, mousePos.y + i, Klon.USERPAINTED, colorPicked1);
            }
            break;
        case Tool.GIGA:
            for (let i = -20; i <= 20; i++) {
                for (let j = -20; j <= 20; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, Klon.USERPAINTED, colorPicked1);
                }
            }
            break;
        case Tool.MOVE:
            moveDrawing(mousePos.x, mousePos.y);
            break;
    }
}

function useDeleteTool(e) {
    //IF E IS PASSED IT'S ALREADY FORMATED, ELSE IT'S A MOUSE EVENT
    const mousePos = e.type ? convertToMonolithPos(mousePosInGrid({ x: e.x, y: e.y })) : e;
    if (!mousePos) return;
    switch (tool) {
        case Tool.SMOL:
            erasePixel(mousePos.x, mousePos.y);
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    erasePixel(mousePos.x + i, mousePos.y + j);
                }
            }
            break;
        case Tool.HUGE:
            for (let i = -2; i <= 2; i++) {
                for (let j = -2; j <= 2; j++) {
                    erasePixel(mousePos.x + i, mousePos.y + j);
                }
            }
            for (let i = -1; i <= 1; i++) {
                erasePixel(mousePos.x + i, mousePos.y + 3);
                erasePixel(mousePos.x + i, mousePos.y - 3);
                erasePixel(mousePos.x + 3, mousePos.y + i);
                erasePixel(mousePos.x - 3, mousePos.y + i);
            }
            break;
        case Tool.GIGA:
            for (let i = -20; i <= 20; i++) {
                for (let j = -20; j <= 20; j++) {
                    erasePixel(mousePos.x + i, mousePos.y + j);
                }
            }
            break;
    }
}

function brushSwitch() {
    switch (tool) {
        case Tool.SMOL:
            playSound('clickB2B');
            console.log('BIG BRUSH');
            imageCatalog.palette.decodedYX = imageCatalog.paletteBIG.decodedYX;
            tool = Tool.BIG;
            break;
        case Tool.BIG:
            playSound('clickB2C');
            console.log('HUGE BRUSH');
            imageCatalog.palette.decodedYX = imageCatalog.paletteHUGE.decodedYX;
            tool = Tool.HUGE;
            break;
        case Tool.HUGE:
            playSound('clickB2');
            console.log('SMOL BRUSH');
            imageCatalog.palette.decodedYX = imageCatalog.paletteSMOL.decodedYX;
            tool = Tool.SMOL;
            break;
        case Tool.GIGA:
            console.log('SMOL BRUSH');
            imageCatalog.palette.decodedYX = imageCatalog.paletteSMOL.decodedYX;
            tool = Tool.SMOL;
            break;
    }
}

function stopUsingTool() {
    closeCurrentEvent();
    canvas.onmousemove = null;
}

export function mousePosInGrid(e) {
    // console.log('mousePosInGrid', e);
    let x = Math.floor((e.x / windowWidth) * renderWidth);
    let y = Math.floor((e.y / windowHeight) * renderHeight);
    return { x: x, y: y };
}

function useColorPicker(mousePos) {
    colorPicked1 = getColor(mousePos.x, mousePos.y);
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
            bufferOnMonolith({
                buffer: importedImage,
                x: 1,
                y: 1,
                paid: Const.FREE_DRAWING,
                yMaxLegal: Const.FREE_DRAWING,
                zIndex: Klon.USERPAINTED,
            });
            APNGtoMonolith(importedImage);

            //! NE PAS SUPPRIMER LES LIGNES CI-DESSOUS !//
            let base64 = btoa(
                new Uint8Array(importedImage).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            console.log('base64', base64);
        };
    };
    input.click();
}

export let colorNumber1, colorNumber2;
function colorSwitch(e, color) {
    if (e.button == 0) {
        colorNumber1 = color;
    } else if (e.button == 2) {
        colorNumber2 = color;
    }

    switch (color) {
        case 1:
            colorPicked1 = Const.RGB1;
            break;
        case 2:
            colorPicked1 = Const.RGB2;
            break;
        case 3:
            colorPicked1 = Const.RGB3;
            break;
        case 4:
            colorPicked1 = Const.RGB4;
            break;
        case 5:
            colorPicked1 = Const.RGB5;
            break;
        case 6:
            colorPicked1 = Const.RGB6;
            break;
        case 7:
            colorPicked1 = Const.RGB7;
            break;
        case 8:
            colorPicked1 = Const.RGB8;
            break;
        case 9:
            colorPicked1 = Const.RGB9;
            break;
        case 10:
            colorPicked1 = Const.RGB10;
            break;
        case 11:
            colorPicked1 = Const.RGB11;
            break;
        case 12:
            colorPicked1 = Const.RGB12;
            break;
        case 13:
            colorPicked1 = Const.RGB13;
            break;
        case 14:
            colorPicked1 = Const.RGB14;
            break;
        case 15:
            colorPicked1 = Const.RGB15;
            break;
        case 16:
            colorPicked1 = Const.RGB16;
            break;
    }
    selectorUpdate();
}

export function selectorUpdate() {
    let offset = 8;

    let xPalette = Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X);
    let yPalette = Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y);

    imageCatalog.selector1.startX = xPalette - offset - colorNumber1 * 8 + Math.floor(colorNumber1 / 9) * 64;
    imageCatalog.selector1.startY = yPalette + 1 - Math.floor(colorNumber1 / 9) * 8;
    imageCatalog.selector2.startX = xPalette - offset - colorNumber2 * 8 + Math.floor(colorNumber2 / 9) * 64;
    imageCatalog.selector2.startY = yPalette + 1 - Math.floor(colorNumber2 / 9) * 8;
}
