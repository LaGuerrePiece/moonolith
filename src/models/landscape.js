import Const from './constants';
import { landscapeBase64 } from '../assets/data.js';
import { renderWidth, renderHeight, viewPosX, viewPosY } from '../main';

export function assembleLandscape() {
    var arrayAssemble = [];
    var arrayFinal = [];

    for (let layer in landscapeBase64) {
        let thisLayer = landscapeBase64[layer];

        let buffer = thisLayer.decoded;

        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] === undefined) continue;
            arrayAssemble[i + offset] = buffer[i];
        }
    }

    for (let y = 0; y < renderHeight; y++) {
        const currentLinePosStart = (Const.LINES - renderHeight - viewPosY + y) * Const.COLUMNS;
        for (let x = 0; x < renderWidth; x++) {
            const currentColumnPosStart = viewPosX + x;
            arrayFinal.push(arrayAssemble[currentColumnPosStart + currentLinePosStart]);
        }
    }

    return arrayFinal;
}
