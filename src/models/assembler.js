import { monolith } from './monolith';
import { GUI } from './GUI';
import { landscapeBase64 } from '../assets/data';
import Const from './constants';
import { renderWidth, renderHeight, viewPosX, viewPosY } from '../main';

var previousViewPosY;
var previousViewPosX;
var previousLandscape;

export function assemble() {
    const monolithStartY = Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - viewPosY - renderHeight;
    const monolithStartX = viewPosX - Const.MARGIN_LEFT;
    let startAssemble = performance.now();

    let layersToDisplay = [];
    //PUSH GUI AND MONOLITH TO LAYERSTODISPLAY ARRAY
    layersToDisplay.push({ name: 'GUI', colorsArray: GUI, startX: 0, startY: 0 });
    layersToDisplay.push({ name: 'monolith', colorsArray: monolith, startX: monolithStartY, startY: monolithStartX });

    //IF THE VIEWPOS HAS CHANGED, PUSH THE NEW LAYERS TO LAYER ARRAY
    if (previousViewPosY !== viewPosY || previousViewPosX !== viewPosX) {
        //FOR EACH LAYER, IF CONDITIONS ARE MET, PUSH TO LAYERTODISPLAY
        for (let layer in landscapeBase64) {
            const thisLayer = landscapeBase64[layer];

            ////////////////////////////////////////////////////   HELL   ////////////////////////////////////////////////////////////
            // let parallaxOffset = Math.floor(thisLayer.parallax * viewPosY);

            // if (thisLayer.startY - thisLayer.height - parallaxOffset > viewPosY + renderHeight) continue; // If the layer above render, skip it
            // if (Const.LINES - thisLayer.startY + parallaxOffset > Const.LINES - viewPosY) continue; // If the layer under render, skip it

            // let offset = (Const.LINES - thisLayer.startY + parallaxOffset) * Const.COLUMNS;

            const startX = 0;
            const startY = 0;

            ////////////////////////////////////////////////////   HELL   ////////////////////////////////////////////////////////////

            layersToDisplay.push({
                name: thisLayer.name,
                colorsArray: thisLayer.decoded,
                startX: startX,
                startY: startY,
            });
        }
        previousViewPosY = viewPosY;
        previousViewPosX = viewPosX;
    } else {
        // ELSE, JUST PUSH PREVIOUSLANDSCAPE AT 0, 0
        layersToDisplay.push({ name: 'previousLandscape', colorsArray: previousLandscape, startX: 0, startY: 0 });
    }

    let displayArray = [];
    for (let i = 0; i < renderHeight; i++) {
        for (let j = 0; j < renderWidth; j++) {
            //FOR EACH LAYER, PUSH COLOR IF PRESENT
            for (let k = 0; k < layersToDisplay.length; k++) {
                const currentLayer = layersToDisplay[k];
                if (currentLayer.colorsArray[currentLayer.startY + i]?.[currentLayer.startX + j]) {
                    displayArray.push(currentLayer.colorsArray[currentLayer.startY + i][currentLayer.startX + j]);
                    break;
                }
            }

            //IF NO COLOR HAS BEEN PUSHED, PUSH THE DEFAULT COLOR
            if (!displayArray[i * renderWidth + j]) {
                displayArray.push([0.9764, 0.5098, 0.5176]);
            }
        }
    }

    previousLandscape = displayArray;
    console.log('Assemble = ', Math.floor(performance.now() - startAssemble), 'ms');
    return displayArray;
}
