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
        let offset = (Const.LINES - thisLayer.startY + parallaxOffset) * Const.COLUMNS * 4;
        let buffer = thisLayer.decoded;
        for (let i = 0; i < buffer.length; i++) {
            if (i % 4 === 0 && buffer[i + 3] === 0) {
                // checks 4th array and if it's 0 (transparent), skips the group
                i += 3;
                continue;
            }
            landscapeArray[i + offset] = buffer[i];
        }
    }
    return landscapeArray;
}
