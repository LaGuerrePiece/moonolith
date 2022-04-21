import UPNG from 'upng-js';
import Klon from '../models/klon';
import Const from '../models/constants';
import { monolith, eraseAllPixel } from '../models/monolith';
import { chunkCreator } from '../utils/web3';

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

function saveLocally(base64) {
    var elementA = document.createElement('a'); //On crée un element vide pour forcer le téléchargement
    elementA.setAttribute('href', 'data:image/png;base64,' + base64); // on met les données au bon format (base64)
    elementA.setAttribute('download', +new Date() + '.png'); // le nom du fichier
    elementA.style.display = 'none'; // on met l'elem invisible
    document.body.appendChild(elementA); //on crée l 'elem
    elementA.click(); // on télécharge
    document.body.removeChild(elementA); // on delete l'elem
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
    //TODO : À BOUGER DANS TOOLS
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

async function bufferOnMonolith(arrayBuffer, offsetx, offsety, pixelPaid, yMaxLegal, zIndex) {
    let res = await pngToBufferToRGBA8(arrayBuffer).catch(console.error);
    let pixelDrawn = 0;
    let decalage = 0;
    for (let y = offsety; y < res.height + offsety; y++) {
        for (let x = offsetx; x < res.width + offsetx; x++) {
            if (y >= yMaxLegal) return;
            if (pixelDrawn >= pixelPaid) return;
            if (!monolith[y]?.[x]) continue;
            if (res.buffer[decalage + 3] > 0) {
                monolith[y][x].color = [
                    res.buffer[decalage] / 255,
                    res.buffer[decalage + 1] / 255,
                    res.buffer[decalage + 2] / 255,
                ];
                monolith[y][x].zIndex = zIndex;
                pixelDrawn++;
            }
            decalage += 4;
        }
    }
}

export { saveToEthernity, base64ToBuffer, pngToBufferToRGBA8, bufferOnMonolith };
