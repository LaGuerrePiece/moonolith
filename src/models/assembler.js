import { convertToMonolithPos, monolith } from './monolith';
import { imageCatalog, animationCatalog } from '../assets/imageData';
import Const from './constants';
import { renderHeight, renderWidth, viewPosX, viewPosY, pointer, deviceType } from '../main';
import { tool, Tool } from './tools';

// var previousViewPosY;
// var previousViewPosX;
// var previousLandscape;
let activateOnce = 0;
var clock = 0;
setInterval(() => {
    clock += 100;
}, 100);

function frameInClock(anim) {
    let frame = 0;
    let delaySum = 0;
    while (delaySum < clock % anim.totalDelay) {
        delaySum += anim.frames[frame].delay;
        frame++;
    }
    if (frame >= Object.keys(anim.frames).length) frame = 0;
    return frame;
}

export function assemble() {
    let displayArray = [];
    let layersToDisplay = [];

    //Push animations to layersToDisplay
    for (let animation in animationCatalog) {
        const thisAnim = animationCatalog[animation];
        layersToDisplay.push({
            name: thisAnim.name,
            colorsArray: thisAnim.frames[frameInClock(thisAnim)].buffer,
            startY: thisAnim.startY - viewPosY - renderHeight,
            startX: viewPosX - thisAnim.startX,
        });
    }

    // Add the pointer
    addPointer(displayArray, layersToDisplay);

    activateOnce++;
    return displayArray;
}

function addPointer(displayArray, layersToDisplay) {
    if (tool === Tool.SMOL) {
        whiten(displayArray, pointer.y, pointer.x, layersToDisplay);
    } else if (tool === Tool.BIG) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                whiten(displayArray, pointer.y + j, pointer.x + i, layersToDisplay);
            }
        }
        whiten(displayArray, pointer.y, pointer.x, layersToDisplay);
    } else if (tool === Tool.HUGE) {
        for (let i = -3; i <= 3; i++) {
            for (let j = -1; j <= 1; j++) {
                whiten(displayArray, pointer.y + j, pointer.x + i, layersToDisplay);
                whiten(displayArray, pointer.y + i, pointer.x + j, layersToDisplay);
            }
        }
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) whiten(displayArray, pointer.y + i, pointer.x + j, layersToDisplay);
        }
    } else if (tool === Tool.GIGA) {
        for (let i = -20; i <= 20; i++) {
            for (let j = -20; j <= 20; j++) {
                whiten(displayArray, pointer.y + j, pointer.x + i, layersToDisplay);
            }
        }
        for (let i = -15; i <= 15; i++) {
            for (let j = -15; j <= 15; j++) {
                whiten(displayArray, pointer.y + j, pointer.x + i, layersToDisplay);
            }
        }
        for (let i = -8; i <= 8; i++) {
            for (let j = -5; j <= 5; j++) {
                whiten(displayArray, pointer.y + j, pointer.x + i, layersToDisplay);
                whiten(displayArray, pointer.y + i, pointer.x + j, layersToDisplay);
            }
        }
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) whiten(displayArray, pointer.y + i, pointer.x + j, layersToDisplay);
        }
        whiten(displayArray, pointer.y, pointer.x, layersToDisplay);
    }
}

function whiten(displayArray, y, x, layersToDisplay) {
    if (x < 0 || x >= renderWidth) return;
    const displayPos = (y * renderWidth + x) * 4;
    const monolithPos = convertToMonolithPos({ x: x, y: y });
    // If not on the monolith or being put off the screen during the zoom return
    if (!monolithPos || displayPos > displayArray.length) return;
    // If not editable return
    if (!monolith[monolithPos.y]?.[monolithPos.x].isEditable(0)) return;
    // If on the GUI, return
    for (let layer of layersToDisplay) {
        if (['palette', 'selector1', 'selector2'].includes(layer.name)) {
            if (layer.colorsArray[layer.startY + y]?.[layer.startX + x]) return;
        }
    }
    displayArray[displayPos] += (255 - displayArray[displayPos]) / 3;
    displayArray[displayPos + 1] += (255 - displayArray[displayPos + 1]) / 3;
    displayArray[displayPos + 2] += (255 - displayArray[displayPos + 2]) / 3;
}
