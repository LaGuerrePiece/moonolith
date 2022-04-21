import { monolith } from './monolith';
import { GUI } from './GUI';
import { landscapeBase64 } from '../assets/data';
import Const from './constants';
import { renderWidth, renderHeight, viewPosX, viewPosY } from '../main';

var previousViewPosY;
var previousViewPosX;
var previousLandscape;

export function assemble() {
    let startAssemble = performance.now();
    let displayArray = [];
    let layersToDisplay = [];

    // Push GUI and Monolith to layersToDisplay
    layersToDisplay.push({
        name: 'GUI',
        colorsArray: GUI.decodedYX,
        startY: Math.floor((renderHeight - GUI.height) / -1.05),
        startX: Math.floor((renderWidth - GUI.width) / -2),
    });
    layersToDisplay.push({
        name: 'monolith',
        colorsArray: monolith,
        startY: Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - viewPosY - renderHeight,
        startX: viewPosX - Const.MARGIN_LEFT,
    });

    // Push landscape to layersToDisplay if viewPos changed
    if (previousViewPosY !== viewPosY || previousViewPosX !== viewPosX) {
        for (let layer in landscapeBase64) {
            const thisLayer = landscapeBase64[layer];
            const parallaxOffset = Math.floor(thisLayer.parallax * viewPosY);

            if (thisLayer.startY - thisLayer.height - parallaxOffset > viewPosY + renderHeight) continue; // If the layer above render, skip it
            if (Const.LINES - thisLayer.startY + parallaxOffset > Const.LINES - viewPosY) continue; // If the layer under render, skip it

            layersToDisplay.push({
                name: thisLayer.name,
                colorsArray: thisLayer.decodedYX,
                startY: thisLayer.startY - parallaxOffset - viewPosY - renderHeight,
                startX: thisLayer.startX,
            });
        }
        previousViewPosY = viewPosY;
        previousViewPosX = viewPosX;
    } else {
        // If viewPos didn't change, push previous landscape
        displayArray = previousLandscape;
    }

    // Iterate over each pixel and push colors to displayArray
    for (let y = 0; y < renderHeight; y++) {
        for (let x = 0; x < renderWidth; x++) {
            for (let z = 0; z < layersToDisplay.length; z++) {
                const layer = layersToDisplay[z];
                const array = layer.colorsArray;
                const startY = layer.startY;
                const startX = layer.startX;

                if (startY + y < 0 || startX + x < 0) continue; // If pixel is out of bounds in this layer, skip it
                const pixel = array[startY + y]?.[startX + x];
                if (!pixel) continue;

                displayArray[y * renderWidth + x] = pixel.color ? pixel.color : pixel;
                break;
            }
            // if no color found, set to default color
            if (!displayArray[y * renderWidth + x]) {
                displayArray[y * renderWidth + x] = Const.SKY_COLOR;
            }
        }
    }

    previousLandscape = displayArray;
    console.log('render', Math.floor(performance.now() - startAssemble), 'ms');
    return displayArray;
}
