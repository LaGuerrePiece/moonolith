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

export const nbColumns = 170;
export const nbRows = 600;

export let monolith = Array.from({ length: nbRows }, () =>
    Array.from({ length: nbColumns }, () => new Klon([1, 0, 0]))
);

console.log('monolith', monolith);

export function draw_pixel(x, y, zIndex, color) {
    if (x < 0 || x >= nbColumns || y < 0 || y >= nbRows) return; //IF OUT OF BOUNDS, return
    if (!monolith[y][x].isEditable(zIndex)) return; //IF IS NOT EDITABLE, return
    //if (zIndex === 0) addToCurrentEvent(x, y, monolith[y][x]);                                    //A faire
    monolith[y][x] = new Klon(color, zIndex);
}

// if (zIndex === monolith[y][x].zIndex && ) return; //IF IS THE SAME COLOR, return
// if (!klonsAreEqual(monolith[pos], klon)) {

export function get_color(x, y) {
    let pos = y * this.nbColumns + x;
    if (this.persistent[pos] !== undefined) {
        return this.persistent[pos].color;
    }
}

export function erase_all_pixel() {
    for (let pos = 0; pos < this.persistent.length; pos++) {
        if (this.persistent[pos] && !this.persistent[pos].zIndex) {
            addToCurrentEvent(pos, this.persistent[pos]);
            this.persistent[pos] = undefined;
        }
    }
    closeCurrentEvent();
    console.log('erase_all_pixel');
}

export function erase_pixel(x, y) {
    let pos = y * this.nbColumns + x;
    if (this.persistent[pos] ? !this.persistent[pos].zIndex : true) {
        if (this.persistent[pos]) addToCurrentEvent(pos, this.persistent[pos]);
        this.persistent[pos] = undefined;
    }
}

export function convertIndexToXY(number) {
    let x = number % this.nbColumns;
    let y = Math.floor(number / this.nbColumns);
    return { x, y };
}

export function addRow(numberOfRow) {
    this.nbRows += numberOfRow;
}

export function klonsAreEqual(klon1, klon2) {
    return (
        klon1?.color[0] == klon2?.color[0] &&
        klon1?.color[1] == klon2?.color[1] &&
        klon1?.color[2] == klon2?.color[2] &&
        klon1?.zIndex == klon2?.zIndex
    );
}

export function getMonolith() {
    return monolith;
}

export function replaceMonolith(newMonolith) {
    monolith = newMonolith;
}

export function getMonolithArray(renderWidth, renderHeight, viewPosX, viewPosY) {
    let monolithArray = [];
    const startY = nbRows + marginBot - viewPosY - renderHeight;
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
