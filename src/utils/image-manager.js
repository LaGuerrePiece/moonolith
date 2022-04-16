import UPNG from 'upng-js';
import Klon from '../models/klon';
import { getMonolith, replaceMonolith } from '../models/monolith';

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
        console.log(buff.width, buff.height);
        console.log(buff.data);
        resolve(buff);
    });
}
function toRGBA8(buffer) {
    return new Uint8Array(UPNG.toRGBA8(buffer)[0]);
}

function getHighLow(grid) {
    let lowX = grid.persistent.length,
        lowY = grid.persistent.length,
        highX = 0,
        highY = 0;

    for (let i in grid.persistent) {
        if (grid.persistent[i]?.zIndex == Klon.USERPAINTED) {
            if (grid.convertIndexToXY(i).x < lowX) {
                lowX = grid.convertIndexToXY(i).x;
            }
            if (grid.convertIndexToXY(i).x > highX) {
                highX = grid.convertIndexToXY(i).x;
            }
            if (grid.convertIndexToXY(i).y < lowY) {
                lowY = grid.convertIndexToXY(i).y;
            }
            if (grid.convertIndexToXY(i).y > highY) {
                highY = grid.convertIndexToXY(i).y;
            }
        }
    }
    let longueur = highX - lowX + 1;
    let largeur = highY - lowY + 1;
    // console.log(`lowX : ${lowX} | lowY : ${lowY} | highX : ${highX} | highY : ${highY} | `)
    return { lowX, lowY, highX, highY, longueur, largeur };
}

function preEncode() {
    return new Promise((resolve) => {
        let { highLow, saveArray, nbPix, firstPix } = gridToArray(grid);

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

function gridToArray() {
    grid = getMonolith();
    let highLow = getHighLow(grid);
    let saveArray = [];
    let nbPix = 0;
    let firstPix = -1;
    for (
        let i = grid.convertXYToIndex(highLow.lowX, highLow.lowY);
        i <= grid.convertXYToIndex(highLow.highX, highLow.highY);
        i++
    ) {
        if (
            grid.convertIndexToXY(i).x >= highLow.lowX &&
            grid.convertIndexToXY(i).x <= highLow.highX &&
            grid.convertIndexToXY(i).y >= highLow.lowY &&
            grid.convertIndexToXY(i).y <= highLow.highY
        ) {
            if (grid.persistent[i] && grid.persistent[i].zIndex == Klon.USERPAINTED) {
                if (firstPix == -1) firstPix = i;
                saveArray.push(grid.persistent[i].color[0] * 255);
                saveArray.push(grid.persistent[i].color[1] * 255);
                saveArray.push(grid.persistent[i].color[2] * 255);
                saveArray.push(255);
                nbPix++;
            } else {
                saveArray.push(0);
                saveArray.push(0);
                saveArray.push(0);
                saveArray.push(0);
            }
        }
    }
    return { firstPix: firstPix, highLow: highLow, nbPix: nbPix, saveArray: saveArray };
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

export {
    decode,
    getHighLow,
    preEncode,
    preEncodeSpecialK,
    _base64ToArrayBuffer,
    toRGBA8,
    gridToArray,
    hexToRGB,
    RGBToHex,
};
