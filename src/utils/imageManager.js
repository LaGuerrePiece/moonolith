import UPNG from 'upng-js';
import Klon from '../models/klon';
import Const from '../models/constants';
import { monolith, eraseAllPixel } from '../models/monolith';
import { chunkCreator } from '../utils/web3';

const palette = [
    '#000000',
    '#28282e',
    '#6c5671',
    '#d9c8bf',
    '#f98284',
    '#b0a9e4',
    '#accce4',
    '#b3e3da',
    '#feaae4',
    '#87a889',
    '#b0eb93',
    '#e9f59d',
    '#ffe6c6',
    '#dea38b',
    '#ffc384',
    '#fff7a0',
];

function saveToEthernity() {
    monolithToBase64().then((data) => {
        chunkCreator(data);
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

async function bufferOnMonolith(data) {
    let rgba8 = await pngToBufferToRGBA8(data.buffer).catch(console.error);
    let pixelDrawn = 0;
    let decalage = 0;
    for (let y = data.y; y < data.yMaxLegal; y++) {
        for (let x = data.x; x < rgba8.width + data.x; x++) {
            // if (y >= data.yMaxLegal) return;
            if (pixelDrawn >= data.paid) return;
            if (!monolith[y]?.[x]) continue;
            if (rgba8.buffer[decalage + 3] > 0) {
                monolith[y][x].color = [rgba8.buffer[decalage], rgba8.buffer[decalage + 1], rgba8.buffer[decalage + 2]];
                monolith[y][x].zIndex = data.zIndex;
                pixelDrawn++;
            }
            decalage += 4;
        }
    }
}

function monolithToBase64() {
    return new Promise((resolve) => {
        let { highLow, nbPix, saveArray } = gridToArray();
        let firstPix = highLow.lowY * Const.MONOLITH_COLUMNS + highLow.lowX;
        saveArray = new Uint8Array(saveArray);
        var png = UPNG.encode([saveArray.buffer], highLow.longueur, highLow.largeur, 0);
        let base64 = bufferToBase64(png);
        console.log('base64', base64);
        saveLocally(base64);
        resolve({ position: firstPix, ymax: highLow.highY, nbPix: nbPix, imgURI: base64 });
    });
}

function monolithToBase64But4Bits(grid) {
    return new Promise((resolve) => {
        let { highLow, saveArray, nbPix, firstPix } = encode4bits(grid);

        saveArray = new Uint8Array(saveArray);
        var png = UPNG.encodeLL([saveArray.buffer], highLow.longueur, highLow.largeur, 1, 0, 4); // on encode
        let buffer = _arrayBufferToBase64(png); //on passe au format base64
        saveLocally(buffer);

        resolve({ position: firstPix, ymax: highLow.highY, nbPix: nbPix, imgURI: buffer });
    });
}

function encode4bits(grid) {
    console.log(grid);
    let { highLow, saveArray, nbPix, firstPix } = gridToArray(grid);
    saveArray = new Uint8Array(saveArray);
    console.log(saveArray);
    let encoded = [];
    for (let i = 0; i < saveArray.length; i += 4) {
        console.log(saveArray[i], saveArray[i + 1], saveArray[i + 2]);
        let hex = RGBToHex(saveArray[i] / 255, saveArray[i + 1] / 255, saveArray[i + 2] / 255);
        console.log(hex);
        let c = parseInt(getKeyByValue(palette, hex));
        console.log(c);
        addUintTo4bitArray(encoded, c);
    }
    console.log(encoded);
    return { firstPix: firstPix, highLow: highLow, nbPix: nbPix, saveArray: encoded };
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
    let saveArray = [];
    let nbPix = 0;
    for (let i = highLow.lowY; i <= highLow.highY; i++) {
        for (let j = highLow.lowX; j <= highLow.highX; j++) {
            if (monolith[i][j].zIndex == Klon.USERPAINTED) {
                saveArray.push(...monolith[i][j].color, 255);
                nbPix++;
            } else {
                saveArray.push(...[0, 0, 0, 0]);
            }
        }
    }
    return { highLow, nbPix, saveArray };
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
    console.log(
        `lowX : ${lowX} | lowY : ${lowY} | highX : ${highX} | highY : ${highY} | longueur : ${longueur} | largeur : ${largeur}`
    );
    return { lowX, lowY, highX, highY, longueur, largeur };
}

function RGBToHex(r, g, b) {
    r = Math.floor(r * 255);
    g = Math.floor(g * 255);
    b = Math.floor(b * 255);
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}
function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}
export function moveDrawing(x, y) {
    //TODO : À BOUGER DANS TOOLS ?
    const drawing = gridToArray();
    console.log('x', x, 'y', y, 'drawing', drawing);
    console.log('saveArray', drawing.saveArray);
    console.log('highLow', drawing.highLow);
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

export { saveToEthernity, base64ToBuffer, pngToBufferToRGBA8, bufferOnMonolith };
