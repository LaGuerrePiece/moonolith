import Const from './constants';
import { landscapeBase64 } from '../assets/data.js';
import { renderWidth, renderHeight, viewPosX, viewPosY } from '../main';

export function assembleLandscape() {
    var landscapeArray = [];
    for (let layer in landscapeBase64) {
        let thisLayer = landscapeBase64[layer];
        let parallaxOffset = Math.floor(thisLayer.parallax * viewPosY);
        if (thisLayer.startY - thisLayer.height - parallaxOffset > viewPosY + renderHeight) continue; // If the layer above render, skip it
        if (Const.LINES - thisLayer.startY + parallaxOffset > Const.LINES - viewPosY) continue; // If the layer under render, skip it
        let offset = (Const.LINES - thisLayer.startY + parallaxOffset) * Const.COLUMNS;
        let buffer = thisLayer.decoded;
        let j = 0;
        for (let i = 0; i < buffer.length; i += 4) {
            if (i % 4 === 0 && buffer[i + 3] === 0) {
                // checks 4th array and if it's 0 (transparent), skips the group
                j++;
                continue;
            }
            landscapeArray[j + offset] = [buffer[i] / 255, buffer[i + 1] / 255, buffer[i + 2] / 255];
            j++;
        }
    }
    return landscapeArray;
}
