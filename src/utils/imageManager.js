import UPNG from 'upng-js';
import Klon from '../models/klon';
import Const from '../models/constants';
import { monolith, erase_all_pixel } from '../models/monolith';

function hexToRGB(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255,
        g = parseInt(hex.slice(3, 5), 16) / 255,
        b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

function RGBToHex(r, g, b) {
    r = Math.floor(r * 255);
    g = Math.floor(g * 255);
    b = Math.floor(b * 255);
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function decode(buffer) {
    return new Promise((resolve) => {
        let buff = UPNG.decode(buffer);
        // console.log(buff.width, buff.height);
        // console.log(buff.data);
        resolve(buff);
    });
}

function toRGBA8(buffer) {
    return new Uint8Array(UPNG.toRGBA8(buffer)[0]);
}

function preEncode() {
    return new Promise((resolve) => {
        let { highLow, nbPix, saveArray } = gridToArray();
        let firstPix = highLow.lowY * Const.MONOLITH_COLUMNS + highLow.lowX;

        saveArray = new Uint8Array(saveArray);
        var png = UPNG.encode([saveArray.buffer], highLow.longueur, highLow.largeur, 0); // on encode
        let buffer = _arrayBufferToBase64(png); //on passe au format base64
        saveLocally(buffer);
        resolve({ position: firstPix, ymax: highLow.highY, nbPix: nbPix, imgURI: buffer });
    });
}

function preEncodeSpecialK(displayArray, renderWidth, renderHeight) {
    return new Promise((resolve) => {
        displayArray = new Uint8Array(displayArray);
        var png = UPNG.encode([displayArray.buffer], renderWidth, renderHeight, 0); // on encode
        let buffer = _arrayBufferToBase64(png); //on passe au format base64
        saveLocally(buffer);

        resolve({ imgURI: buffer });
    });
}

function saveLocally(buffer) {
    var elementA = document.createElement('a'); //On crée un element vide pour forcer le téléchargement
    elementA.setAttribute('href', 'data:image/png;base64,' + buffer); // on met les données au bon format (base64)
    elementA.setAttribute('download', +new Date() + '.png'); // le nom du fichier
    elementA.style.display = 'none'; // on met l'elem invisible
    document.body.appendChild(elementA); //on crée l 'elem
    elementA.click(); // on télécharge
    document.body.removeChild(elementA); // on delete l'elem
}

function _arrayBufferToBase64(buffer) {
    // fonction pour encoder en base 64 pour pouvoir télécharger l'image ensuite
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function _base64ToArrayBuffer(base64) {
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
                saveArray.push(...monolith[i][j].color.map((a) => a * 255));
                saveArray.push(255);
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

export function moveDrawing(x, y) {
    const drawing = gridToArray();
    console.log('x', x, 'y', y, 'drawing', drawing);
    console.log('saveArray', drawing.saveArray);
    console.log('highLow', drawing.highLow);
    erase_all_pixel();
    // if (outx > 127) outx = 127;
    // if (outx < 0) outx = 0;
    displayArrayToImage(drawing.saveArray, x, y, 999999, 999999, 0, drawing.highLow.longueur, drawing.highLow.largeur);
}

export async function displayImageFromArrayBuffer(arrayBuffer, offsetx, offsety, pixelPaid, yMaxLegal, zIndex) {
    let decoded;
    decoded = await decode(arrayBuffer).catch(console.error);
    if (!decoded) return;
    let array = toRGBA8(decoded);
    let width = decoded.width;
    // console.log('width', decoded.width);
    displayArrayToImage(array, offsetx, offsety, pixelPaid, yMaxLegal, zIndex, width); //SENT WITHOUT WIDTH AND HEIGHT
}

// TAKES A UINT8ARRAY AND DISPLAY IT ON THE MONOLITH
function displayArrayToImage(array, offsetx, offsety, pixelPaid, yMaxLegal, zIndex, width, height = 300) {
    let pixelDrawn = 0;
    let decalage = 0;
    // console.log('displayArrayToImage', array, offsetx, offsety, pixelPaid, yMaxLegal, zIndex, width, height,);
    for (let y = offsety; y < height + offsety; y++) {
        for (let x = offsetx; x < width + offsetx; x++) {
            if (y >= yMaxLegal) return;
            if (pixelDrawn >= pixelPaid) return;
            if (!monolith[y]?.[x]) continue;
            if (array[decalage + 3] > 0) {
                monolith[y][x].color = [array[decalage] / 255, array[decalage + 1] / 255, array[decalage + 2] / 255];
                monolith[y][x].zIndex = zIndex;
                pixelDrawn++;
            }
            decalage += 4;
        }
    }
}

export { decode, preEncode, preEncodeSpecialK, _base64ToArrayBuffer, toRGBA8, hexToRGB, RGBToHex };
