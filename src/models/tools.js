//prettier-ignore
import { windowHeight, windowWidth, renderWidth, renderHeight, changeViewPos, viewPosX, viewPosY, zoom, canvas} from '../main';
import { imageCatalog } from '../assets/imageData';
import { toggleMusic, playSound } from '../assets/sounds';
import { drawPixel, getColor, eraseAllPixel, convertToMonolithPos, increaseMonolithHeight } from './monolith';
import Klon from './klon';
import { closeCurrentEvent, undo, redo } from './undoStack';

import { moveDrawing, bufferOnMonolith, saveToEthernity, APNGtoMonolith } from '../utils/imageManager';
import Const from './constants';
import { parse } from '@ethersproject/transactions';

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
let colorPicked2 = Const.DEFAULT_COLOR;
let button;

let scrollInformation = {
    lastScrollDown: Date.now(),
    lastScrollUp: Date.now(),
    consecutiveDown: 0,
    consecutiveUp: 0,
};

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
    console.log(e.deltaY);
    console.log(scrollInformation);
    let now = Date.now();
    if (e.deltaY > 0) {
        console.log(scrollInformation.lastScrollDown - now);
        if (now - scrollInformation.lastScrollDown < 1000) {
            scrollInformation.consecutiveDown++;
        } else {
            scrollInformation.consecutiveDown = 0;
        }
        scrollInformation.lastScrollDown = now;
        changeViewPos(0, -6 - parseInt(scrollInformation.consecutiveDown / 5) * 2);
        console.log('movment:', -6 - parseInt(scrollInformation.consecutiveUp / 5));
    } else {
        if (now - scrollInformation.lastScrollUp < 1000) {
            scrollInformation.consecutiveUp++;
        } else {
            scrollInformation.consecutiveUp = 0;
        }
        scrollInformation.lastScrollUp = now;
        console.log('movment:', 6 + parseInt(scrollInformation.consecutiveUp / 5));
        changeViewPos(0, 6 + parseInt(scrollInformation.consecutiveUp / 5));
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
        // clicked on GUI

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
    } else if (convertToMonolithPos(mousePos)) {
        // clicked on monolith
        startUsingTool(e, mousePos);
    } else {
        // clicked on landscape
    }
}

function startUsingTool(e, mousePos) {
    //prettier-ignore
    if (e.button == 1) {useColorPicker(mousePos); e.preventDefault(); return;}
    button = e.button;
    useTool(e);
    canvas.onmousemove = useTool;
    canvas.onmouseup = () => {
        closeCurrentEvent();
        canvas.onmousemove = null;
    };
}

function useTool(e) {
    const color = button === 0 ? colorPicked1 : colorPicked2;
    const zIndex =
        color[0] === Const.DEFAULT_COLOR[0] &&
        color[1] === Const.DEFAULT_COLOR[1] &&
        color[2] === Const.DEFAULT_COLOR[2]
            ? undefined
            : 0;

    //If e is passed it's already formated, else it's a mouse event
    const mousePos = e.type ? convertToMonolithPos(mousePosInGrid({ x: e.x, y: e.y })) : e;
    if (!mousePos) return;

    switch (tool) {
        case Tool.SMOL:
            drawPixel(mousePos.x, mousePos.y, zIndex, color);
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, zIndex, color);
                }
            }
            break;
        case Tool.HUGE:
            for (let i = -2; i <= 2; i++) {
                for (let j = -2; j <= 2; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, zIndex, color);
                }
            }
            for (let i = -1; i <= 1; i++) {
                drawPixel(mousePos.x + i, mousePos.y + 3, zIndex, color);
                drawPixel(mousePos.x + i, mousePos.y - 3, zIndex, color);
                drawPixel(mousePos.x + 3, mousePos.y + i, zIndex, color);
                drawPixel(mousePos.x - 3, mousePos.y + i, zIndex, color);
            }
            break;
        case Tool.GIGA:
            for (let i = -20; i <= 20; i++) {
                for (let j = -20; j <= 20; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, zIndex, color);
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

export function mousePosInGrid(e) {
    // console.log('mousePosInGrid', e);
    let x = Math.floor((e.x / windowWidth) * renderWidth);
    let y = Math.floor((e.y / windowHeight) * renderHeight);
    return { x: x, y: y };
}

function useColorPicker(mousePos) {
    const color = getColor(mousePos.x, mousePos.y);
    for (let i = 0; i < Const.GUI_PALETTE.length; i++) {
        if (
            color[0] === Const.GUI_PALETTE[i][0] &&
            color[1] === Const.GUI_PALETTE[i][1] &&
            color[2] === Const.GUI_PALETTE[i][2]
        ) {
            console.log('colorPicked1', color, i);
            colorSwitch({ button: 0 }, i + 1);
            return;
        }
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

export let colorNumber1 = 2;
export let colorNumber2 = 16;
function colorSwitch(e, color) {
    if (e.button == 0) {
        if (color === colorNumber2) {
            colorNumber2 = colorNumber1;
            colorPicked2 = Const.GUI_PALETTE[colorNumber1 - 1];
        }
        colorNumber1 = color;
        colorPicked1 = Const.GUI_PALETTE[color - 1];
    } else if (e.button == 2) {
        if (color === colorNumber1) {
            colorNumber1 = colorNumber2;
            colorPicked1 = Const.GUI_PALETTE[colorNumber2 - 1];
        }
        colorNumber2 = color;
        colorPicked2 = Const.GUI_PALETTE[color - 1];
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

function GUICircle(mousePos, GUIstartY, GUIstartX, y, x, radius) {
    // Coordinates of the center are input in the GUI
    y += GUIstartY;
    x += GUIstartX;
    return Math.floor(mousePos.x - x) ** 2 + Math.floor(mousePos.y - y) ** 2 <= radius ** 2;
}
