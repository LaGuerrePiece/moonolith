import { GUI, caly0, caly1, caly2, caly3, caly4, caly5, caly6, calySide0, calySide1 } from './base64';
import { base64ToBuffer, pngToBufferToRGBA8 } from '../utils/imageManager';
import Const from '../models/constants';

export var imageCatalog = {
    GUI: { name: 'GUI', type: 'GUI', startX: 0, startY: 0, parallax: 0, base64: GUI },
    caly0: { name: 'caly0', type: 'landscape', startX: 0, startY: 45, parallax: 0, base64: caly0 },
    calySide0: { name: 'calySide0', type: 'side', startX: 47, startY: 17, parallax: 0, base64: calySide0 },
    calySide1: { name: 'calySide1', type: 'side', startX: 196, startY: -310, parallax: 0, base64: calySide1 },
    calySide2: { name: 'calySide2', type: 'side', startX: 196, startY: -526, parallax: 0, base64: calySide1 },
    calySide3: { name: 'calySide3', type: 'side', startX: 196, startY: -742, parallax: 0, base64: calySide1 },
    caly1: { name: 'caly1', type: 'landscape', startX: 0, startY: 85, parallax: 0.1, base64: caly1 },
    caly2: { name: 'caly2', type: 'landscape', startX: 0, startY: 150, parallax: 0.2, base64: caly2 },
    caly3: { name: 'caly3', type: 'landscape', startX: 0, startY: 225, parallax: 0.3, base64: caly3 },
    caly4: { name: 'caly4', type: 'landscape', startX: 0, startY: 290, parallax: 0.4, base64: caly4 },
    caly1b: { name: 'caly1b', type: 'landscape', startX: 0, startY: 343, parallax: 0.5, base64: caly1 },
    caly2b: { name: 'caly2b', type: 'landscape', startX: 0, startY: 420, parallax: 0.6, base64: caly2 },
    caly3b: { name: 'caly3b', type: 'landscape', startX: 0, startY: 500, parallax: 0.7, base64: caly3 },
    caly4b: { name: 'caly4b', type: 'landscape', startX: 0, startY: 590, parallax: 0.8, base64: caly4 },
    caly5: { name: 'caly5', type: 'landscape', startX: 0, startY: 680, parallax: 0.9, base64: caly5 },
    caly6: { name: 'caly6', type: 'landscape', startX: 0, startY: 790, parallax: 1, base64: caly6 },
};

export async function initialDecodeLandscape(numberOfImports, viewPosY) {
    //Imports a few layers of landscape
    let startImport = Date.now();
    let importedLayers = 0;
    let landscape = Object.keys(imageCatalog);

    for (let i = landscape.length - 1; i >= 0; i--) {
        if (importedLayers >= numberOfImports) continue;
        decodeAndFormatLayer(landscape[i]);
        importedLayers++;
    }
    console.log('//     First import of', numberOfImports, ':', Date.now() - startImport, 'ms     //');
}

export async function lateDecodeLandscape(numberOfImports) {
    //Imports the rest of the landscape
    let startImport = Date.now();
    let importedLayers = 0;
    let landscape = Object.keys(imageCatalog);

    for (let i = numberOfImports + 1; i <= landscape.length; i++) {
        if (importedLayers > numberOfImports) continue;
        decodeAndFormatLayer(landscape[landscape.length - i]);
        importedLayers++;
    }
    //prettier-ignore
    console.log('//      Second import of', landscape.length - numberOfImports, ':', Date.now() - startImport, 'ms     //');
}

async function decodeAndFormatLayer(index) {
    let thisLayer = imageCatalog[index];
    let decoded = await pngToBufferToRGBA8(base64ToBuffer(thisLayer.base64)).catch(console.error);
    let buffer = decoded.buffer;
    let width = decoded.width;

    let convertedYX = Array.from({ length: buffer.length / width / 4 }, () => Array.from(Const.COLUMNS));

    for (let y = 0; y < buffer.length / width / 4; y++) {
        for (let x = 0; x < width; x++) {
            if (buffer[(x + y * width) * 4 + 3] === 0) continue;
            convertedYX[y][x] = [
                buffer[(x + y * width) * 4],
                buffer[(x + y * width) * 4 + 1],
                buffer[(x + y * width) * 4 + 2],
                255,
            ];
        }
    }
    thisLayer.decodedYX = convertedYX;
    thisLayer.width = width;
    thisLayer.height = decoded.height;

    if (thisLayer.type === 'side') thisLayer.startY = Const.LINES - Const.MARGIN_TOP + thisLayer.startY;
    if (thisLayer.name == 'GUIMPORT') console.log('GUIMPORT', thisLayer.decodedYX); // NE PAS SUPPRIMER
}
