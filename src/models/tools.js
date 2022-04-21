import { update, canvas, windowHeight, windowWidth, renderWidth, renderHeight } from '../main';
import { imageCatalog } from '../assets/imageData';
import { draw_pixel, get_color, erase_all_pixel, erase_pixel, convertToMonolithPos, monolith } from './monolith';
import Klon from './klon';
import { closeCurrentEvent, undo, redo } from './undoStack';
import { chunkCreator } from '../utils/web3';

import {
    _base64ToArrayBuffer,
    toRGBA8,
    moveDrawing,
    displayImageFromArrayBuffer,
    preEncode,
} from '../utils/imageManager';
import Const from './constants';

//prettier-ignore
class Tool {

    static get DONE() { return 0 }
    static get SMOL() { return 1 }
    static get PIPETTE() { return 2 }
    static get BIG() { return 3 }
    static get HUGE() { return 4 }
    static get MOVE() { return 5 }
    static get DELETE() { return 6 }

}

let tool = Tool.HUGE;
let colorPicked = Const.RGB7;

export function clickManager(e) {
    let mousePos = mousePosInGrid(e);
    //console.log('mousePos', mousePos);
    const GUIstartY = Math.floor((renderHeight - imageCatalog.GUI.height) / Const.GUI_RELATIVE_Y);
    const GUIstartX = Math.floor((renderWidth - imageCatalog.GUI.width) / Const.GUI_RELATIVE_X);
    if (
        mousePos.x > GUIstartX &&
        mousePos.x < GUIstartX + imageCatalog.GUI.width &&
        mousePos.y > GUIstartY &&
        mousePos.y < GUIstartY + imageCatalog.GUI.height
    ) {
        //CASE : CLICK ON THE GUI
        // console.log('GUI!!');

        //BIG
        if (GUICircle(mousePos, GUIstartY, GUIstartX, 7, 7, 8)) console.log('!!!');
        if (GUICircle(mousePos, GUIstartY, GUIstartX, 7, 91, 8)) console.log('???');

        //SMALL
        //FIRST CIRCLE POSITION : 3, 21
        if (GUICircle(mousePos, GUIstartY, GUIstartX, 3, 21, 3)) colorPicked = Const.HEX1;
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 1, 3, 21, 3)) colorPicked = Const.HEX2;
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 2, 3, 21, 3)) colorPicked = Const.HEX3;
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 3, 3, 21, 3)) colorPicked = Const.HEX4;
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 4, 3, 21, 3)) colorPicked = Const.HEX6;
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 5, 3, 21, 3)) colorPicked = Const.HEX5;
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 6, 3, 21, 3)) colorPicked = Const.HEX1;
        if (GUICircle(mousePos, GUIstartY, GUIstartX + 8 * 7, 3, 21, 3)) colorPicked = Const.HEX1;
        //ROW 2
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX, 3, 21, 3)) colorPicked = Const.HEX1;
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 1, 3, 21, 3)) colorPicked = Const.HEX2;
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 2, 3, 21, 3)) colorPicked = Const.HEX3;
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 3, 3, 21, 3)) colorPicked = Const.HEX4;
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 4, 3, 21, 3)) colorPicked = Const.HEX6;
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 5, 3, 21, 3)) colorPicked = Const.HEX5;
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 6, 3, 21, 3)) colorPicked = Const.HEX1;
        if (GUICircle(mousePos, GUIstartY + 8, GUIstartX + 8 * 7, 3, 21, 3)) colorPicked = Const.HEX1;

        console.log('colorPicked', colorPicked);
        if (mousePos.x >= 30 && mousePos.x < 35) tool = Tool.SMOL;
        if (mousePos.x >= 35 && mousePos.x < 40) tool = Tool.BIG;
        if (mousePos.x >= 40 && mousePos.x < 45) tool = Tool.HUGE;
        if (mousePos.x >= 45 && mousePos.x < 50) {
            console.log('send To the blockchain!');
            preEncode().then((res) => {
                chunkCreator(res);
            });
        }
        if (mousePos.x >= 50 && mousePos.x < 55) {
            console.log('move! (not working now)');
            moveDrawing(50, 500);
            update();
        }
        if (mousePos.x >= 55 && mousePos.x < 60) {
            erase_all_pixel();
            update();
        }
        if (mousePos.x >= 60 && mousePos.x < 65) importImage();
    } else {
        //CASE MONOLITH OR LANDSCAPE
        mousePos = convertToMonolithPos(mousePos);
        if (mousePos) startUsingTool(e, mousePos);
    }
}

function GUICircle(mousePos, GUIstartY, GUIstartX, y, x, radius) {
    // Coordinates of the center are input in the GUI
    y += GUIstartY;
    x += GUIstartX;
    return Math.floor((mousePos.x - x) ** 2) + Math.floor((mousePos.y - y) ** 2) <= radius ** 2;
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
            draw_pixel(mousePos.x, mousePos.y, Klon.USERPAINTED, colorPicked);
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (mousePos.x + i < renderWidth && mousePos.x + i > -1)
                        draw_pixel(mousePos.x + i, mousePos.y + j, Klon.USERPAINTED, colorPicked);
                }
            }
            break;
        case Tool.HUGE:
            for (let i = -15; i <= 15; i++) {
                for (let j = -15; j <= 15; j++) {
                    if (mousePos.x + i < renderWidth && mousePos.x + i > -1)
                        draw_pixel(mousePos.x + i, mousePos.y + j, Klon.USERPAINTED, colorPicked);
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
    if (!mousePos) return;
    switch (tool) {
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
            for (let i = -15; i <= 15; i++) {
                for (let j = -15; j <= 15; j++) {
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

export function mousePosInGrid(e) {
    // console.log('mousePosInGrid', e);
    let x = Math.floor((e.x / windowWidth) * renderWidth);
    let y = Math.floor((e.y / windowHeight) * renderHeight);
    return { x: x, y: y };
}

function useColorPicker(mousePos) {
    colorPicked = get_color(mousePos.x, mousePos.y);
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
            displayImageFromArrayBuffer(importedImage, 1, 400, 999999, 99999, 0);

            //! NE PAS SUPPRIMER LES LIGNES CI-DESSOUS !//
            let base64 = btoa(
                new Uint8Array(importedImage).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            console.log('base64', base64);
        };
    };
    input.click();
}
