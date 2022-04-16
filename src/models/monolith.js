import Klon from './klon';
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

const nbColumns = 256;
const nbRows = 400;

// export let monolith = Array.from({ length: nbRows }, () =>
//     Array.from({ length: nbColumns }, () => new Klon([0, 0, 0]))
// );

// console.log('monolith', monolith);
export let monolith = [...Array(nbColumns * nbRows).keys()].map(
    (index) => new Klon([0, 1, 0], undefined, 'monolith', index)
);

export function draw_pixel(pos, zIndex, klon) {
    if (pos > 0 && pos < monolith.length) {
        if (monolith[pos] ? monolith[pos].isEditable(zIndex) : true) {
            if (!klonsAreEqual(monolith[pos], klon)) {
                if (zIndex === 0) addToCurrentEvent(pos, monolith[pos]);
                monolith[pos] = klon;
            }
        }
    }
}

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
        klon1?.type == klon2?.type &&
        klon1?.zIndex == klon2?.zIndex
    );
}

export function getMonolith() {
    return monolith;
}

export function replaceMonolith(newMonolith) {
    monolith = newMonolith;
}

export function moveDrawing(x, y) {
    let highLow, saveArray, nbPix, firstPix;
    let ret = gridToArray(monolith);
    highLow = ret.highLow;
    saveArray = ret.saveArray;
    nbPix = ret.nbPix;
    firstPix = ret.firstPix;
    erase_all_pixel();
    console.log('l', highLow.largeur);
    console.log('L', highLow.longueur);
    console.log('lowx', highLow.lowX);
    let outx = x;
    let outy = y;
    if (outx > 127) outx = 127;
    if (outx < 0) outx = 0;
    displayArrayToImage(saveArray, highLow.largeur, outx, outy, 999999, 999999, 0);
}

export async function displayImageFromArrayBuffer(arrayBuffer, offsetx, offsety, pixelPaid, yMaxLegal, zIndex) {
    let decoded;
    decoded = await decode(arrayBuffer).catch(console.error);
    if (!decoded) return;
    let array = toRGBA8(decoded);
    let width = decoded.width;
    displayArrayToImage(array, width, offsetx, offsety, pixelPaid, yMaxLegal, zIndex);
}

export function displayArrayToImage(array, width, offsetx, offsety, pixelPaid, yMaxLegal, zIndex) {
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
