import { GUI, caly0, caly1, caly2, caly3, caly4, caly5, caly6, calySide0, calySideRepet } from './base64';
import { base64ToBuffer, pngToBufferToRGBA8 } from '../utils/imageManager';
import Const from '../models/constants';

//prettier-ignore
export var imageCatalog = {
    GUI: { name: 'GUI', height: 15, width: 99, startX: 0, startY: 0, parallax: 0, base64: GUI },
    caly0: { name: 'caly0', height: 101, width: 256, startX: 0, startY: 45, parallax: 0, base64: caly0 },
    calySide0: { name: 'calySide0', height: 335, width: 173, startX: 47, startY: Const.LINES - Const.MARGIN_TOP + 17, parallax: 0, base64: calySide0 },
    calySideRepet: { name: 'calySideRepet', height: 216, width: 19, startX: 196, startY: Const.LINES - Const.MARGIN_TOP - 310, parallax: 0, base64: calySideRepet },
    caly1: { name: 'caly1', height: 82, width: 256, startX: 0, startY: 85, parallax: 0.1, base64: caly1 },
    caly2: { name: 'caly2', height: 97, width: 256, startX: 0, startY: 150, parallax: 0.2, base64: caly2 },
    caly3: { name: 'caly3', height: 101, width: 256, startX: 0, startY: 225, parallax: 0.3, base64: caly3 },
    caly4: { name: 'caly4', height: 101, width: 256, startX: 0, startY: 290, parallax: 0.4, base64: caly4 },
    caly1b: { name: 'caly1b', height: 82, width: 256, startX: 0, startY: 343, parallax: 0.5, base64: caly1 },
    caly2b: { name: 'caly2b', height: 97, width: 256, startX: 0, startY: 420, parallax: 0.6, base64: caly2 },
    caly3b: { name: 'caly3b', height: 101, width: 256, startX: 0, startY: 500, parallax: 0.7, base64: caly3 },
    caly4b: { name: 'caly4b', height: 101, width: 256, startX: 0, startY: 590, parallax: 0.8, base64: caly4 },
    caly5: { name: 'caly5', height: 126, width: 256, startX: 0, startY: 680, parallax: 0.9, base64: caly5 },
    caly6: { name: 'caly6', height: 126, width: 256, startX: 0, startY: 790, parallax: 1, base64: caly6 },
};

export async function initialDecodeLandscape(numberOfImports, viewPosY) {
    //Imports a few layers of landscape
    let importedLayers = 0;
    let landscape = Object.keys(imageCatalog);

    for (let i = landscape.length - 1; i >= 0; i--) {
        if (importedLayers >= numberOfImports) continue;
        decodeAndFormatLayer(landscape[i]);
        importedLayers++;
    }
}

export async function lateDecodeLandscape(numberOfImports) {
    //Imports the rest of the landscape
    let importedLayers = 0;
    let landscape = Object.keys(imageCatalog);

    for (let i = numberOfImports + 1; i <= landscape.length; i++) {
        if (importedLayers > numberOfImports) continue;
        decodeAndFormatLayer(landscape[landscape.length - i]);
        importedLayers++;
    }
}

async function decodeAndFormatLayer(index) {
    let thisLayer = imageCatalog[index];
    let decoded = await pngToBufferToRGBA8(base64ToBuffer(thisLayer.base64)).catch(console.error);
    decoded = decoded.buffer;
    let convertedYX = Array.from({ length: decoded.length / thisLayer.width / 4 }, () => Array.from(Const.COLUMNS));

    for (let y = 0; y < decoded.length / thisLayer.width / 4; y++) {
        for (let x = 0; x < thisLayer.width; x++) {
            if (decoded[(x + y * thisLayer.width) * 4 + 3] === 0) continue;
            convertedYX[y][x] = [
                decoded[(x + y * thisLayer.width) * 4] / 255,
                decoded[(x + y * thisLayer.width) * 4 + 1] / 255,
                decoded[(x + y * thisLayer.width) * 4 + 2] / 255,
            ];
        }
    }

    thisLayer.decodedYX = convertedYX;
    if (thisLayer.name == 'GUIMPORT') console.log('GUIMPORT', thisLayer.decodedYX); // NE PAS SUPPRIMER
}
