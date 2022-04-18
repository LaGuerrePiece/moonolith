import { caly0, caly1, caly2, caly3, caly4, caly5, caly6 } from './base64';
import { preEncodeSpecialK, _base64ToArrayBuffer, decode, toRGBA8 } from '../utils/image-manager';

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
    let startImport = performance.now();
    let importedLayers = 0;

    for (let i = Object.keys(landscapeBase64).length - 1; i >= 0; i--) {
        if (importedLayers >= numberOfImports) continue;
        let thisLayer = landscapeBase64[Object.keys(landscapeBase64)[i]];
        let decoded = await decode(_base64ToArrayBuffer(thisLayer.base64)).catch(console.error);
        decoded = toRGBA8(decoded);
        thisLayer.decoded = decoded;
        importedLayers++;
    }

    let endImport = performance.now();
    // console.log('Initial import : ', Math.floor(endImport - startImport), 'ms');
}

export async function lateImport(numberOfImports) {
    let startImport = performance.now();
    let importedLayers = 0;
    let landscape = Object.keys(landscapeBase64);
    let landscapeLength = landscape.length;
    let remainingImports = landscapeLength - numberOfImports;

    for (let i = numberOfImports + 1; i <= landscapeLength; i++) {
        if (importedLayers > numberOfImports) continue;
        let thisLayer = landscapeBase64[landscape[landscapeLength - i]];
        let decoded = await decode(_base64ToArrayBuffer(thisLayer.base64)).catch(console.error);
        decoded = toRGBA8(decoded);
        thisLayer.decoded = decoded;
        importedLayers++;
    }

    let endImport = performance.now();
    // console.log('Late import : ', Math.floor(endImport - startImport), 'ms');
}
