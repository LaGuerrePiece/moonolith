import UPNG from 'upng-js';
import Klon from '../models/klon';
import Const from '../models/constants';
import { monolith, eraseAllPixel } from '../models/monolith';
import { chunkCreator } from '../utils/web3';

const palette = [
    '#000000',
    '#fff7e4',
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
   // '#28282e' 
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

function pngToBufferToRGB(buffer) {
    return new Promise((resolve) => {
        buffer = UPNG.decode(buffer);
        resolve(buffer);
    }).then((buffer) => {
        return { buffer: buffer.data, width: buffer.width, height: buffer.height };
    });
}

async function prepareBufferForApi(data)
{
    let rgba8 = await pngToBufferToRGB(data).catch(console.error);
    //console.log("Data from image:", rgba8);
    let pixArray = decode4bitsArray(rgba8.buffer);
    while(pixArray[pixArray.length-1] === 0){ // virer les 0 de la fin
        pixArray.pop();
    }
    if(pixArray.length > rgba8.height * rgba8.width) // corriger le tableau en cas de dernier entier qui coderait une seule valeur
    {
        pixArray[pixArray.length - 2] = pixArray[pixArray.length - 1];
        pixArray[pixArray.length - 1] = 0;
    }
    let colors = [];
    pixArray.forEach(pix => {
        colors.push(hexToRgb(palette[pix]));
    });
    return [colors, rgba8.width, rgba8.height];
}

async function bufferOnMonolith(data) {
    let rgba8 = await pngToBufferToRGB(data.buffer).catch(console.error);
    //console.log("Data from image:", rgba8);
    let pixArray = decode4bitsArray(rgba8.buffer);
    while(pixArray[pixArray.length-1] === 0){ // virer les 0 de la fin
        pixArray.pop();
    }
    if(pixArray.length > rgba8.height * rgba8.width) // corriger le tableau en cas de dernier entier qui coderait une seule valeur
    {
        pixArray[pixArray.length - 2] = pixArray[pixArray.length - 1];
        pixArray[pixArray.length - 1] = 0;
    }
    //console.log("Decoded data:", pixArray);
    let pixelDrawn = 0;
    let p = 0;
    for (let y = data.y; y < data.yMaxLegal; y++) {
        for (let x = data.x; x < rgba8.width + data.x; x++) {
            // if (y >= data.yMaxLegal) return;
            if (pixelDrawn >= data.paid) return;
            if (!monolith[y]?.[x]) continue;
            if (pixArray[p] > 0) {
                monolith[y][x].color = hexToRgb(palette[pixArray[p]])
                monolith[y][x].zIndex = data.zIndex;
                pixelDrawn++;
            }
            p++;
        }
    }
}

function monolithToBase64() {
    return new Promise((resolve) => {
        let { highLow, nbPix, encoded } = gridToArray();
        let firstPix = highLow.lowY * Const.MONOLITH_COLUMNS + highLow.lowX;
        encoded = new Uint8Array(encoded);
        //console.log("data avant encodage:", encoded);
        var png = UPNG.encode([encoded.buffer], highLow.longueur, highLow.largeur, 1, 0, 4); // on encode
       // console.log("data encoded", png);
        let buff = UPNG.decode(png);
        //console.log("data apres decodage", buff);
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

function gridToArray()
{
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
    let encoded = [];
    let raw = [];
    for(let i = 0; i< saveArray.length; i+=4)
    {
        //console.log(saveArray[i], saveArray[i+1],  saveArray[i+2]);
        let hex = RGBToHex(saveArray[i]/255, saveArray[i+1]/255,  saveArray[i+2]/255);
        //console.log('color:', hex)
        let c = parseInt(getKeyByValue(palette, hex));
        //console.log("Un entier:", c);
        addUintTo4bitArray(encoded, c);
        raw.push(c);
    }
    if(encoded[encoded.length - 1] == 256){
        encoded[encoded.length - 1] = 0;
    }
    while(encoded.length % 4 != 0){
        encoded.push(0);
    }
    //console.log("From drawing raw data:", raw)
    //console.log(encoded);
    return { highLow, nbPix, encoded};
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
    /*console.log(
        `lowX : ${lowX} | lowY : ${lowY} | highX : ${highX} | highY : ${highY} | longueur : ${longueur} | largeur : ${largeur}`
    );*/
    return { lowX, lowY, highX, highY, longueur, largeur };
}
function addUintTo4bitArray(array, uint)
{
    if(array.length == 0){
        array.push(uint); 
    } else if(array[array.length - 1] == 256){
        array[array.length - 1] = uint;
    } else {
        array[array.length - 1] = array[array.length - 1] * 16 + uint;
        array.push(256);
    }
}
function decode4bitsArray(array){
    let decoded = [];
    for(let i = 0; i < array.length; i++){
        decoded.push((array[i] - array[i] % 16) / 16 );
        decoded.push(array[i] % 16);

    }
    return decoded;
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
    return Object.keys(object).find(key => object[key] === value);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16)/255,
      parseInt(result[2], 16)/255,
      parseInt(result[3], 16)/255
     ] : null;
  }

export function moveDrawing(x, y) {
    //TODO : À BOUGER DANS TOOLS ?
    const drawing = gridToArray();
    //console.log('x', x, 'y', y, 'drawing', drawing);
    //console.log('saveArray', drawing.saveArray);
    //console.log('highLow', drawing.highLow);
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

export { saveToEthernity, base64ToBuffer, pngToBufferToRGBA8, pngToBufferToRGB, prepareBufferForApi, bufferOnMonolith };
