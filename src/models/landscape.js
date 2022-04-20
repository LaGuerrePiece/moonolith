import Const from './constants';
import { landscapeBase64 } from '../assets/data.js';
import { renderWidth, renderHeight, viewPosX, viewPosY } from '../main';

export function assembleLandscape() {
    var arrayAssemble = [];
    var arrayFinal = [];

    for (let layer in landscapeBase64) {
        let thisLayer = landscapeBase64[layer];

        let parallaxOffset = Math.floor(thisLayer.parallax * viewPosY);

        if (thisLayer.startY - thisLayer.height - parallaxOffset > viewPosY + renderHeight) continue; // If the layer above render, skip it
        if (Const.LINES - thisLayer.startY + parallaxOffset > Const.LINES - viewPosY) continue; // If the layer under render, skip it

        let offset = (Const.LINES - thisLayer.startY + parallaxOffset) * Const.COLUMNS;
        let buffer = thisLayer.decoded;

        for (let i = 0, iAssemble = 0; i < buffer.length; i += 4, iAssemble++) {
            if (i % 4 === 0 && buffer[i + 3] === 0) continue; // checks 4th array and if it's 0 (transparent), skips the group
            arrayAssemble[iAssemble + offset] = [buffer[i] / 255, buffer[i + 1] / 255, buffer[i + 2] / 255];
        }
    }

    for (let y = 0; y < renderHeight; y++) {
        const currentLinePosStart = (Const.LINES - renderHeight - viewPosY + y) * Const.COLUMNS;
        for (let x = 0; x < renderWidth; x++) {
            const currentColumnPosStart = viewPosX + x;
            arrayFinal.push(arrayAssemble[currentColumnPosStart + currentLinePosStart]);
        }
    }

    // console.log('arrayAssemble', arrayAssemble);
    // console.log('arrayFinal', arrayFinal);

    return arrayFinal;
}
