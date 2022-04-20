import { caly0, caly1, caly2, caly3, caly4, caly5, caly6 } from './base64';
import { _base64ToArrayBuffer, decode, toRGBA8 } from '../utils/image-manager';
import Const from '../models/constants';

export var landscapeBase64 = {
    caly6: { name: 'caly6', height: 126, startY: 520, parallax: 1.2, base64: caly6, decoded: null },
    caly5: { name: 'caly5', height: 126, startY: 420, parallax: 1, base64: caly5, decoded: null },
    caly4: { name: 'caly4', height: 101, startY: 313, parallax: 0.8, base64: caly4, decoded: null },
    caly3: { name: 'caly3', height: 101, startY: 230, parallax: 0.6, base64: caly3, decoded: null },
    caly2: { name: 'caly2', height: 97, startY: 150, parallax: 0.4, base64: caly2, decoded: null },
    caly1: { name: 'caly1', height: 82, startY: 85, parallax: 0.2, base64: caly1, decoded: null },
    caly0: { name: 'caly0', height: 101, startY: 45, parallax: 0, base64: caly0, decoded: null },
};

export async function initialImport(numberOfImports, viewPosY) {
    //Imports a few layers of landscape
    let importedLayers = 0;
    //console.log('landscapeBase64', landscapeBase64);
    let landscape = Object.keys(landscapeBase64);

    for (let i = landscape.length - 1; i >= 0; i--) {
        if (importedLayers >= numberOfImports) continue;
        importAndFormatLayer(landscape[i]);
        importedLayers++;
    }
}

export async function lateImport(numberOfImports) {
    //Imports the rest of the landscape
    let importedLayers = 0;
    let landscape = Object.keys(landscapeBase64);

    for (let i = numberOfImports + 1; i <= landscape.length; i++) {
        if (importedLayers > numberOfImports) continue;
        importAndFormatLayer(landscape[landscape.length - i]);
        importedLayers++;
    }
}

async function importAndFormatLayer(index) {
    let thisLayer = landscapeBase64[index];
    let decoded = await decode(_base64ToArrayBuffer(thisLayer.base64)).catch(console.error);
    decoded = toRGBA8(decoded);
    let converted = [];
    let convertedYX = Array.from({ length: decoded.length / Const.COLUMNS / 4 }, () => Array.from(Const.COLUMNS));

    for (let y = 0; y < decoded.length / Const.COLUMNS / 4; y++) {
        for (let x = 0; x < Const.COLUMNS; x++) {
            if (decoded[(x + y * Const.COLUMNS) * 4 + 3] === 0) continue;
            convertedYX[y][x] = [
                decoded[(x + y * Const.COLUMNS) * 4] / 255,
                decoded[(x + y * Const.COLUMNS) * 4 + 1] / 255,
                decoded[(x + y * Const.COLUMNS) * 4 + 2] / 255,
            ];
        }
    }
    if (thisLayer.name == 'caly0') console.log(thisLayer.name, convertedYX);
    thisLayer.decodedYX = convertedYX;

    for (let j = 0; j < decoded.length; j += 4) {
        if (decoded[j + 3] === 0) {
            converted.push(undefined);
            continue;
        }
        converted.push([decoded[j] / 255, decoded[j + 1] / 255, decoded[j + 2] / 255]);
    }

    thisLayer.decoded = converted;
}
