import { monolith } from './monolith';
import { imageCatalog, animationCatalog } from '../assets/imageData';
import Const from './constants';
import { renderHeight, renderWidth, viewPosX, viewPosY } from '../main';

// var previousViewPosY;
// var previousViewPosX;
// var previousLandscape;
// var clock = 0;

var displayMenu = true; // quand true, dezoom et desac draw
let lol = 0;

export function assemble(force) {
    let startAssemble = performance.now();
    let displayArray = [];
    let layersToDisplay = [];

    // if (displayMenu) {
    //     layersToDisplay.push({
    //         name: 'menu',
    //         colorsArray: imageCatalog.menu.decodedYX,
    //         startY: Math.floor(-(renderHeight + viewPosY - imageCatalog.menu.height - 50)),
    //         startX: Math.floor(-(Const.COLUMNS - imageCatalog.menu.width) / 2),
    //     });
    // }

    // Push GUI to layersToDisplay
    layersToDisplay.push({
        name: 'GUI',
        colorsArray: imageCatalog.GUI.decodedYX,
        startY: Math.floor(-(renderHeight - imageCatalog.GUI.height) / Const.GUI_RELATIVE_Y),
        startX: Math.floor(-(renderWidth - imageCatalog.GUI.width) / Const.GUI_RELATIVE_X),
    });

    layersToDisplay.push({
        name: 'select1',
        colorsArray: imageCatalog.select1.decodedYX,
        startY: Math.floor(-(renderHeight - imageCatalog.GUI.height) / Const.GUI_RELATIVE_Y) + 1,
        startX: Math.floor(-(renderWidth - imageCatalog.GUI.width) / Const.GUI_RELATIVE_X) - 42,
    });

    layersToDisplay.push({
        name: 'select2',
        colorsArray: imageCatalog.select2.decodedYX,
        startY: Math.floor(-(renderHeight - imageCatalog.GUI.height) / Const.GUI_RELATIVE_Y) - 7,
        startX: Math.floor(-(renderWidth - imageCatalog.GUI.width) / Const.GUI_RELATIVE_X) - 26,
    });

    // Push animations to layersToDisplay
    // clock++;
    // if (clock > 49) clock = 0;
    // for (let animation in animationCatalog) {
    //     const thisAnim = animationCatalog[animation];
    //     layersToDisplay.push({
    //         name: thisAnim.name,
    //         colorsArray: thisAnim.frames[clock].buffer,
    //         startY: thisAnim.startY - viewPosY - renderHeight,
    //         startX: viewPosX - thisAnim.startX,
    //     });
    // }

    // Push monolith to layersToDisplay
    layersToDisplay.push({
        name: 'monolith',
        colorsArray: monolith,
        startY: Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - viewPosY - renderHeight,
        startX: viewPosX - Const.MARGIN_LEFT,
    });

    // if (previousViewPosY !== viewPosY || previousViewPosX !== viewPosX || force) {
    for (let layer in imageCatalog) {
        const thisLayer = imageCatalog[layer];
        const parallaxOffset = Math.floor(thisLayer.parallax * viewPosY);

        if (thisLayer.type == 'GUI') continue;
        if (thisLayer.startY - thisLayer.height - parallaxOffset > viewPosY + renderHeight) continue; // If the layer above render, skip it
        if (Const.LINES - thisLayer.startY + parallaxOffset > Const.LINES - viewPosY) continue; // If the layer under render, skip it

        layersToDisplay.push({
            name: thisLayer.name,
            colorsArray: thisLayer.decodedYX,
            startY: thisLayer.startY - parallaxOffset - viewPosY - renderHeight,
            startX: viewPosX - thisLayer.startX,
        });
    }
    //     previousViewPosY = viewPosY;
    //     previousViewPosX = viewPosX;
    // } else {
    // If viewPos didn't change, push previous landscape
    // displayArray = previousLandscape;
    // }
    // console.log('layersToDisplay', layersToDisplay);
    for (let y = 0; y < renderHeight; y++) {
        for (let x = 0; x < renderWidth; x++) {
            for (let layer of layersToDisplay) {
                const array = layer.colorsArray;
                const startY = layer.startY;
                const startX = layer.startX;

                if (startY + y < 0 || startX + x < 0) continue; // If pixel is out of bounds in this layer, skip it
                const pixel = array[startY + y]?.[startX + x];
                if (!pixel) continue;
                if (layer.name === 'monolith') displayArray.push(pixel.color[0], pixel.color[1], pixel.color[2], 255);
                else displayArray.push(pixel[0], pixel[1], pixel[2], 255);
                // else displayArray.push(...pixel, 255);
                break;
            }
            // if no color found, set to default sky color
            if (!displayArray[(y * renderWidth + x) * 4]) {
                displayArray.push(...Const.SKY_COLOR, 255);
            }
        }
    }

    if (lol == 0) console.log('displayArray', displayArray);
    lol++;
    // previousLandscape = displayArray;

    return displayArray;
}
