import Klon from './klon';
import Const from './constants';
import { addToCurrentEvent, closeCurrentEvent } from './undoStack';
import {
    decode,
    preEncode,
    _base64ToArrayBuffer,
    toRGBA8,
    gridToArray,
    hexToRGB,
    RGBToHex,
} from '../utils/image-manager';

export let monolith = Array.from({ length: Const.MONOLITH_ROWS }, () =>
    Array.from({ length: Const.MONOLITH_COLUMNS }, () => new Klon(Const.DEFAULT_COLOR))
);

export function draw_pixel(x, y, zIndex, color) {
    if (x < 0 || x >= Const.MONOLITH_COLUMNS || y < 0 || y >= Const.MONOLITH_ROWS) return; //IF OUT OF BOUNDS, return
    if (!monolith[y][x].isEditable(zIndex)) return; //IF IT IS NOT EDITABLE, return
    // if (monolith[y][x].color === color && monolith[y][x].zIndex === zIndex) return; //IF IT IS THE SAME, return
    if (zIndex === 0) addToCurrentEvent(x, y, monolith[y][x]); //IF IT IS BEING DRAW BY USER, ADD TO CURRENT EVENT
    monolith[y][x] = new Klon(color, zIndex);
}

// if (zIndex === monolith[y][x].zIndex && ) return; ////////////////////////////////////TO DO : IF IS THE SAME COLOR, return
// if (!klonsAreEqual(monolith[pos], klon)) {

export function get_color(x, y) {
    console.log('monolith[y][x]', monolith[y][x]);
    return monolith[y][x].color;
}

export function erase_all_pixel() {
    for (let j = 0; j < Const.MONOLITH_ROWS; j++) {
        for (let i = 0; i < Const.MONOLITH_COLUMNS; i++) {
            if (monolith[j][i].zIndex === 0) {
                addToCurrentEvent(i, j, monolith[j][i]);
                monolith[j][i] = new Klon(Const.DEFAULT_COLOR);
            }
        }
    }
    closeCurrentEvent();
    console.log('erase_all_pixel');
    //faire en sorte de call update() à ce moment là
}

export function erase_pixel(x, y) {
    if (monolith[y][x].zIndex === 0) {
        addToCurrentEvent(x, y, monolith[y][x]);
        monolith[y][x] = new Klon(Const.DEFAULT_COLOR);
    }
}

export function convertIndexToXY(number) {
    let x = number % this.nbColumnsMonolith;
    let y = Math.floor(number / this.nbColumnsMonolith);
    return { x, y };
}

export function getMonolithArray(renderWidth, renderHeight, viewPosX, viewPosY) {
    let monolithArray = [];
    const startY = Const.MONOLITH_ROWS + Const.MARGIN_BOTTOM - viewPosY - renderHeight;
    const startX = viewPosX - Const.MARGIN_LEFT;
    // console.log('startY', startY);
    // console.log('startX', startX);
    for (let i = 0; i < renderHeight; i++) {
        for (let j = 0; j < renderWidth; j++) {
            if (monolith[startY + i]?.[startX + j]) {
                monolithArray.push(monolith[startY + i][startX + j].color);
            } else {
                monolithArray.push(undefined);
            }
        }
    }
    //console.log('monolithArray', monolithArray);
    return monolithArray;
}
