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
        let decodedLayer = thisLayer.decoded;

        for (let i = 0; i < decodedLayer.length; i++) {
            if (decodedLayer[i] === undefined) continue;
            arrayAssemble[i + offset] = decodedLayer[i];
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
