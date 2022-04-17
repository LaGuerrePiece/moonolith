import Klon from './klon';
import { addToCurrentEvent, closeCurrentEvent } from './undoStack';
import { marginBot, marginLeft } from './assembler';
import {
    decode,
    preEncode,
    _base64ToArrayBuffer,
    toRGBA8,
    gridToArray,
    hexToRGB,
    RGBToHex,
} from '../utils/image-manager';

export const nbColumnsMonolith = 170;
export const nbRowsMonolith = 600;
const backgroundColor = [1, 0, 0];

export let monolith = Array.from({ length: nbRowsMonolith }, () =>
    Array.from({ length: nbColumnsMonolith }, () => new Klon(backgroundColor))
);

console.log('monolith', monolith);

export function draw_pixel(x, y, zIndex, color) {
    if (x < 0 || x >= nbColumnsMonolith || y < 0 || y >= nbRowsMonolith) return; //IF OUT OF BOUNDS, return
    if (!monolith[y][x].isEditable(zIndex)) return; //IF IT IS NOT EDITABLE, return
    if (zIndex === 0) addToCurrentEvent(x, y, monolith[y][x]);
    monolith[y][x] = new Klon(color, zIndex);
}

// if (zIndex === monolith[y][x].zIndex && ) return; ////////////////////////////////////TO DO : IF IS THE SAME COLOR, return
// if (!klonsAreEqual(monolith[pos], klon)) {

export function get_color(x, y) {
    console.log('monolith[y][x]', monolith[y][x]);
    return monolith[y][x].color;
}

export function erase_all_pixel() {
    for (let j = 0; j < nbRowsMonolith; j++) {
        for (let i = 0; i < nbColumnsMonolith; i++) {
            if (monolith[j][i].zIndex === 0) {
                addToCurrentEvent(i, j, monolith[j][i]);
                monolith[j][i] = new Klon(backgroundColor);
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
        monolith[y][x] = new Klon(backgroundColor);
    }
}

export function convertIndexToXY(number) {
    let x = number % this.nbColumnsMonolith;
    let y = Math.floor(number / this.nbColumnsMonolith);
    return { x, y };
}

export function addRow(numberOfRow) {
    this.nbRowsMonolith += numberOfRow;
}

export function klonsAreEqual(klon1, klon2) {
    return (
        klon1?.color[0] == klon2?.color[0] &&
        klon1?.color[1] == klon2?.color[1] &&
        klon1?.color[2] == klon2?.color[2] &&
        klon1?.zIndex == klon2?.zIndex
    );
}

export function getMonolithArray(renderWidth, renderHeight, viewPosX, viewPosY) {
    let monolithArray = [];
    const startY = nbRowsMonolith + marginBot - viewPosY - renderHeight;
    const startX = viewPosX - marginLeft;
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
