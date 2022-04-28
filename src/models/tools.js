//prettier-ignore
import { windowHeight, windowWidth, renderWidth, renderHeight, changeViewPos, viewPosX, viewPosY, zoom, canvas} from '../main';
import { imageCatalog } from '../assets/imageData';
import { playSound } from '../assets/sounds';
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
    static get PIPETTE() { return 2 }
    static get MOVE() { return 5 }
    static get DELETE() { return 6 }
}

export let tool = Tool.HUGE;
let colorPicked1 = Const.RGB2;
let colorPicked2 = Const.RGB8;

//prettier-ignore
export function keyManager(e){
    if (e.ctrlKey && e.key === 'z') undo();
    if (e.metaKey && e.key === 'z') undo();
    if (e.ctrlKey && e.key === 'Z') redo();
    if (e.metaKey && e.key === 'Z') redo();
    if (e.ctrlKey && e.key === 'y') redo();
    if (e.metaKey && e.key === 'y') redo();
    if (e.key === 'x') eraseAllPixel();
    if (e.key === 'c') console.log('Total H', Const.COLUMNS, 'Total W', Const.LINES, 'render W', renderWidth, 'render H', renderHeight, 'viewPosX', viewPosX, 'viewPosY', viewPosY);
    if (e.key === 'm') { moveDrawing(50, 400) }
    // if (e.key === 'e') zoom();
    if (e.key === 'i') importImage();
    if (e.key === 'p') increaseMonolithHeight(1000)
    // if (e.key === 'ArrowUp') { changeViewPos(0, 6); }
    // if (e.key === 'ArrowDown') { changeViewPos(0, -6); }
    // if (e.key === 'ArrowLeft') { changeViewPos(-6, 0); }
    // if (e.key === 'ArrowRight') { changeViewPos(6, 0); }
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
        zoom()
        break;

        case 'KeyE':
        brushSwitch()
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
    console.log('mousePos', mousePos);

    const GUIstartY = Math.floor((renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y);
    const GUIstartX = Math.floor((renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X);
    if (
        mousePos.x > GUIstartX &&
        mousePos.x < GUIstartX + imageCatalog.palette.width &&
        mousePos.y > GUIstartY &&
        mousePos.y < GUIstartY + imageCatalog.palette.height
    ) {
        //CASE : CLICK ON THE GUI
        // console.log('GUI!!');
        console.log(e);

        //BIG
        if (GUICircle(mousePos, GUIstartY, GUIstartX, 7, 7, 8)) saveToEthernity(); // !!! BUTTON
        if (GUICircle(mousePos, GUIstartY, GUIstartX, 7, 91, 8)) brushSwitch(); // ??? BUTTON

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

        playSound('click');
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
    //console.log('mousePos', mousePos);
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
    }
}

function brushSwitch() {
    switch (tool) {
        case Tool.SMOL:
            console.log('BIG BRUSH');
            imageCatalog.palette.decodedYX = imageCatalog.paletteBIG.decodedYX;
            tool = Tool.BIG;
            break;
        case Tool.BIG:
            console.log('HUGE BRUSH');
            imageCatalog.palette.decodedYX = imageCatalog.paletteHUGE.decodedYX;
            tool = Tool.HUGE;
            break;
        case Tool.HUGE:
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

function colorSwitch(e, color) {
    if (e.button == 0) {
        switch (color) {
            case 1:
                colorPicked1 = Const.RGB1;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 18;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 2:
                colorPicked1 = Const.RGB2;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 26;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;

            case 3:
                colorPicked1 = Const.RGB3;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 34;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 4:
                colorPicked1 = Const.RGB4;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 42;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 5:
                colorPicked1 = Const.RGB5;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 50;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 6:
                colorPicked1 = Const.RGB6;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 58;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 7:
                colorPicked1 = Const.RGB7;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 66;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 8:
                colorPicked1 = Const.RGB8;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 74;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 9:
                colorPicked1 = Const.RGB9;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 18;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 10:
                colorPicked1 = Const.RGB10;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 26;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 11:
                colorPicked1 = Const.RGB11;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 34;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 12:
                colorPicked1 = Const.RGB12;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 42;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 13:
                colorPicked1 = Const.RGB13;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 50;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 14:
                colorPicked1 = Const.RGB14;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 58;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 15:
                colorPicked1 = Const.RGB15;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 66;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 16:
                colorPicked1 = Const.RGB16;
                imageCatalog.select1.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 74;
                imageCatalog.select1.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
        }
    } else if (e.button == 2) {
        switch (color) {
            case 1:
                colorPicked2 = Const.RGB1;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 18;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 2:
                colorPicked2 = Const.RGB2;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 26;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;

            case 3:
                colorPicked2 = Const.RGB3;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 34;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 4:
                colorPicked2 = Const.RGB4;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 42;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 5:
                colorPicked2 = Const.RGB5;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 50;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 6:
                colorPicked2 = Const.RGB6;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 58;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 7:
                colorPicked2 = Const.RGB7;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 66;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 8:
                colorPicked2 = Const.RGB8;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 74;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
                break;
            case 9:
                colorPicked2 = Const.RGB9;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 18;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 10:
                colorPicked2 = Const.RGB10;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 26;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 11:
                colorPicked2 = Const.RGB11;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 34;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 12:
                colorPicked2 = Const.RGB12;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 42;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 13:
                colorPicked2 = Const.RGB13;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 50;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 14:
                colorPicked2 = Const.RGB14;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 58;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 15:
                colorPicked2 = Const.RGB15;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 66;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
            case 16:
                colorPicked2 = Const.RGB16;
                imageCatalog.select2.startX =
                    Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) + 2 - 74;
                imageCatalog.select2.startY =
                    Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
                break;
        }
    }
}
