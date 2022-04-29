//prettier-ignore
import { selectColorRed, selectColorBlue, caly0, caly1, caly2, caly3, caly4, caly5, caly6, calySide0, calySide1, slug, GUISweetie15, menu, paletteSMOL, paletteBIG, paletteHUGE } from './base64';
import { renderWidth, renderHeight } from '../main';
import { base64ToBuffer, pngToBufferToRGBA8, ApngToBuffer } from '../utils/imageManager';
import Const from '../models/constants';

export var imageCatalog = {
    selector2: { name: 'selector2', type: 'GUI', startX: 0, startY: 0, parallax: 0, base64: selectColorRed },
    selector1: { name: 'selector1', type: 'GUI', startX: 0, startY: 0, parallax: 0, base64: selectColorBlue },
    palette: { name: 'palette', type: 'GUI', startX: 0, startY: 0, parallax: 0, base64: paletteHUGE },
    paletteSMOL: { name: 'paletteSMOL', type: 'GUI', startX: 0, startY: 0, parallax: 0, base64: paletteSMOL },
    paletteBIG: { name: 'paletteBIG', type: 'GUI', startX: 0, startY: 0, parallax: 0, base64: paletteBIG },
    paletteHUGE: { name: 'paletteHUGE', type: 'GUI', startX: 0, startY: 0, parallax: 0, base64: paletteHUGE },
    menu: { name: 'menu', type: 'GUI', startX: 0, startY: 0, parallax: 0, base64: menu },
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

export var animationCatalog = {
    slug: { name: 'slug', type: 'anim', startX: 15, startY: 10, parallax: 0, base64: slug, loop: true },
};

export async function initialDecodeAnim(numberOfImports) {
    //Imports a few layers of animation
    let importedAnimations = 0;
    let animations = Object.keys(animationCatalog);

    for (let i = animations.length - 1; i >= 0; i--) {
        if (importedAnimations >= numberOfImports) continue;
        decodeAndFormatAnimation(animations[i]);
        importedAnimations++;
    }
}

async function decodeAndFormatAnimation(index) {
    let thisAnim = animationCatalog[index];
    let decoded = await ApngToBuffer(base64ToBuffer(thisAnim.base64)).catch(console.error);
    let width = decoded.width;
    let framesObj = {};
    let totalDelay = 0;
    let frames = Array.from({ length: decoded.frames.length }, () =>
        Array.from({ length: decoded.frames[0].length / width / 4 }, () => Array.from(Const.COLUMNS))
    );

    for (let frame in decoded.frames) {
        for (let y = 0; y < decoded.frames[frame].length / width / 4; y++) {
            for (let x = 0; x < width; x++) {
                if (decoded.frames[frame][(x + y * width) * 4 + 3] === 0) continue;
                frames[frame][y][x] = [
                    decoded.frames[frame][(x + y * width) * 4],
                    decoded.frames[frame][(x + y * width) * 4 + 1],
                    decoded.frames[frame][(x + y * width) * 4 + 2],
                ];
            }
        }
        totalDelay += decoded.delay[frame];
        framesObj[frame] = { buffer: frames[frame], delay: decoded.delay[frame] };
    }

    thisAnim.frames = framesObj;
    thisAnim.width = width;
    thisAnim.height = decoded.height;
    thisAnim.totalDelay = totalDelay;
}

export async function initialDecodeLandscape(numberOfImports) {
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
    if (thisLayer.type === 'GUI') {
        if (thisLayer.name === 'selector1') {
            thisLayer.startY = Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) + 1;
            thisLayer.startX = Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) - 64;
        }
        if (thisLayer.name === 'selector2') {
            thisLayer.startY = Math.floor(-(renderHeight - imageCatalog.palette.height) / Const.GUI_RELATIVE_Y) - 7;
            thisLayer.startX = Math.floor(-(renderWidth - imageCatalog.palette.width) / Const.GUI_RELATIVE_X) - 72;
        }

        if (thisLayer.name == 'GUIMPORT') console.log('GUIMPORT', thisLayer.decodedYX); // NE PAS SUPPRIMER
    }
}
