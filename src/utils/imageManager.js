import { UPNG } from './upmc';
import Klon from '../models/klon';
import Const from '../models/constants';
import { monolith, eraseAllPixel, drawPixel } from '../models/monolith';
import { chunkCreator } from '../utils/web3';

function saveToEthernity() {
    monolithToBase64().then((data) => {
        chunkCreator(data);
    });
}

async function APNGtoMonolith(buffer) {
    new Promise((resolve) => {
        buffer = UPNG.decode(buffer);
        resolve(buffer);
    }).then((buffer) => {
        for (let frame = 0; frame < 51; frame++) {
            let decodedFrame = UPNG.toRGBA8(buffer)[frame];
            setTimeout(() => {
                animBufferOnMonolith({
                    buffer: new Uint8Array(decodedFrame),
                    width: buffer.width,
                    height: buffer.height,
                    x: 5,
                    y: 45,
                    zIndex: 0,
                    paid: 99999,
                });
                eraseAllPixel();
            }, 100 * frame);
        }
    });

    async function animBufferOnMonolith(data) {
        let pixelDrawn = 0;
        let decalage = 0;
        for (let y = data.y; y < 350; y++) {
            for (let x = data.x; x < data.width + data.x; x++) {
                if (pixelDrawn >= data.paid) return;
                if (!monolith[y]?.[x]) continue;
                if (data.buffer[decalage + 3] > 0) {
                    monolith[y][x].color = [
                        data.buffer[decalage] / 255,
                        data.buffer[decalage + 1] / 255,
                        data.buffer[decalage + 2] / 255,
                    ];
                    monolith[y][x].zIndex = data.zIndex;
                    pixelDrawn++;
                }
                decalage += 4;
            }
        }
    }
}

export async function ApngToBuffer(buffer) {
    return new Promise((resolve) => {
        buffer = UPNG.decode(buffer);
        resolve(buffer);
    }).then((buffer) => {
        let framesArray = [];
        let delayArray = [];
        for (let frame = 0; frame < buffer.frames.length; frame++) {
            delayArray.push(buffer.frames[frame].delay);
            framesArray.push(new Uint8Array(UPNG.toRGBA8(buffer)[frame]));
        }
        return {
            decodedYX: new Uint8Array(UPNG.toRGBA8(buffer)[0]),
            frames: framesArray,
            delay: delayArray,
            height: buffer.height,
            width: buffer.width,
        };
    });
}

function pngToBufferToRGBA8(buffer) {
    return new Promise((resolve) => {
        buffer = UPNG.decode(buffer);
        resolve(buffer);
    }).then((buffer) => {
        return { buffer: new Uint8Array(UPNG.toRGBA8(buffer)[0]), width: buffer.width, height: buffer.height };
    });
}

function pngToBufferToRGB(buffer) {
    return new Promise((resolve) => {
        buffer = UPNG.decode(buffer);
        resolve(buffer);
    }).then((buffer) => {
        return { buffer: buffer.data, width: buffer.width, height: buffer.height };
    });
}

async function prepareBufferForApi(data) {
    let rgba8 = await pngToBufferToRGB(data).catch(console.error);
    let pixArray = decode4bitsArray(rgba8.buffer);
    while (pixArray[pixArray.length - 1] === 0) {
        // virer les 0 de la fin
        pixArray.pop();
    }
    if (pixArray.length > rgba8.height * rgba8.width) {
        // corriger le tableau en cas de dernier entier qui coderait une seule valeur
        pixArray[pixArray.length - 2] = pixArray[pixArray.length - 1];
        pixArray[pixArray.length - 1] = 0;
    }
    let colors = [];
    pixArray.forEach((pix) => {
        colors.push(Const.PALETTE[pix]);
    });
    return [colors, rgba8.width, rgba8.height];
}

async function bufferOnMonolith(data) {
    let rgba8 = await pngToBufferToRGB(data.buffer).catch(console.error);
    let pixArray = decode4bitsArray(rgba8.buffer);
    while (pixArray[pixArray.length - 1] === 0) {
        // virer les 0 de la fin
        pixArray.pop();
    }
    if (pixArray.length > rgba8.height * rgba8.width) {
        // corriger le tableau en cas de dernier entier qui coderait une seule valeur
        pixArray[pixArray.length - 2] = pixArray[pixArray.length - 1];
        pixArray[pixArray.length - 1] = 0;
    }
    let pixelDrawn = 0;
    let p = 0;
    for (let y = data.y; y < data.yMaxLegal; y++) {
        for (let x = data.x; x < rgba8.width + data.x; x++) {
            if (y >= data.yMaxLegal) return;
            if (pixelDrawn >= data.paid) return;
            if (!monolith[y]?.[x]) continue;
            if (pixArray[p] > 0) {
                drawPixel(x, y, data.zIndex, Const.PALETTE[pixArray[p]]);
                pixelDrawn++;
            }
            p++;
        }
    }
}

function monolithToBase64() {
    return new Promise((resolve) => {
        let { highLow, nbPix, pixelArray } = gridToArray();
        let firstPix = highLow.lowY * Const.MONOLITH_COLUMNS + highLow.lowX;
        pixelArray = new Uint8Array(pixelArray);
        var png = UPNG.encodeLL([pixelArray.buffer], highLow.longueur, highLow.largeur, 1, 0, 4); // on encode
        let buff = UPNG.decode(png);
        let buffer = bufferToBase64(png); //on passe au format base64
        saveLocally(buffer);

        resolve({ position: firstPix, ymax: highLow.highY, nbPix: nbPix, imgURI: buffer });
    });
}

function bufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function saveLocally(base64) {
    var elementA = document.createElement('a'); //On crée un element vide pour forcer le téléchargement
    elementA.setAttribute('href', 'data:image/png;base64,' + base64); // on met les données au bon format (base64)
    elementA.setAttribute('download', +new Date() + '.png'); // le nom du fichier
    elementA.style.display = 'none'; // on met l'elem invisible
    document.body.appendChild(elementA); //on crée l 'elem
    elementA.click(); // on télécharge
    document.body.removeChild(elementA); // on delete l'elem
}

function base64ToBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function gridToArray() {
    let highLow = getHighLow();
    let pixelArray = [];
    let nbPix = 0;
    for (let i = highLow.lowY; i <= highLow.highY; i++) {
        for (let j = highLow.lowX; j <= highLow.highX; j++) {
            if (monolith[i][j].zIndex == Klon.USERPAINTED) {
                pixelArray.push(...monolith[i][j].color, 255);
                nbPix++;
            } else {
                pixelArray.push(...[0, 0, 0, 0]);
            }
        }
    }
    pixelArray = rgbaToColorArray(pixelArray); // convert array to the paletted format
    pixelArray = encode4bitsArray(pixelArray); // encode array with 4 bits per color
    return { highLow, nbPix, pixelArray };
}

function getHighLow() {
    let lowX = Const.MONOLITH_COLUMNS,
        lowY = Const.MONOLITH_LINES,
        highX = 0,
        highY = 0;

    for (let i = 0; i < Const.MONOLITH_LINES; i++) {
        for (let j = 0; j < Const.MONOLITH_COLUMNS; j++) {
            if (monolith[i][j].zIndex == Klon.USERPAINTED) {
                if (j < lowX) lowX = j;
                if (j > highX) highX = j;
                if (i < lowY) lowY = i;
                if (i > highY) highY = i;
            }
        }
    }
    let longueur = highX - lowX + 1;
    let largeur = highY - lowY + 1;

    return { lowX, lowY, highX, highY, longueur, largeur };
}
function rgbaToColorArray(array){ // [r, g, b, a, r, g, b, a] => [colordId, colorId]
    let converted = [];
    for (let i = 0; i < array.length; i += 4) {
        let rgb = [array[i], array[i + 1], array[i + 2]];
        const eq = (element) => element[0] == rgb[0] && element[1] == rgb[1] && element[2] == rgb[2];
        converted.push(Const.PALETTE.findIndex(eq));
    }
    return converted;
}
function addUintTo4bitArray(array, uint) {
    if (array.length == 0) {
        array.push(uint);
    } else if (array[array.length - 1] == 256) {
        array[array.length - 1] = uint;
    } else {
        array[array.length - 1] = array[array.length - 1] * 16 + uint;
        array.push(256);
    }
}
function encode4bitsArray(array) {
    let encoded = [];
    for(let i = 0; i < array.length; i++)
    {
        addUintTo4bitArray(encoded, array[i]);
    }
    if(array.length % 2 != 0) {
        encoded[Math.ceil(array.length/2) - 1] *= 16;
    } else if (encoded[encoded.length - 1] == 256) encoded[encoded.length - 1] = 0;
    while (encoded.length % 4 != 0) {
        encoded.push(0);
    }
    return encoded;
}
function decode4bitsArray(array) {
    let decoded = [];
    let arrayEnd = array.length - 1;
    while(array[arrayEnd] == 0){
        arrayEnd --;
    }
    for (let i = 0; i <= arrayEnd; i++) {
        decoded.push((array[i] - (array[i] % 16)) / 16);
        decoded.push(array[i] % 16);
    }
    return decoded;
}

export function moveDrawing(x, y) {
    //TODO : À BOUGER DANS TOOLS ?
    const drawing = gridToArray();

    eraseAllPixel();
    // if (outx > 127) outx = 127;
    // if (outx < 0) outx = 0;
    drawBuffer(
        drawing.saveArray,
        x,
        y,
        Const.FREE_DRAWING,
        Const.FREE_DRAWING,
        0,
        drawing.highLow.longueur,
        drawing.highLow.largeur
    );
}

export {
    saveToEthernity,
    base64ToBuffer,
    pngToBufferToRGBA8,
    pngToBufferToRGB,
    prepareBufferForApi,
    bufferOnMonolith,
    APNGtoMonolith,
};
