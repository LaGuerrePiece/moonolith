import Const from '../constants';
import { runeNumber } from '../main';
import { introState } from '../intro';
import { getChunk } from '../utils/web3';
import { prepareBufferForApi } from '../utils/imageManager';
import { canvas, renderHeight, renderWidth } from '../display/displayLoop';
import { updatePalette } from './GUI';
import { imageCatalog } from './images';

export let scaleFactor = 1;
export let viewPosY = 0;
export let viewPosX = 0;

export function changeViewPos(inputX, inputY) {
    viewPosX += inputX;
    viewPosY += inputY;
    // Limits :
    const lowY = Math.floor(-renderHeight / 2 + renderHeight / (scaleFactor * 2));
    const lowX = Math.floor(-renderWidth / 2 + renderWidth / (scaleFactor * 2));

    // During intro, we can go in the sky
    if (viewPosY + renderHeight + lowY > Const.LINES && !introState) viewPosY = Const.LINES - renderHeight - lowY;
    if (viewPosY < lowY) viewPosY = lowY;
    if (viewPosX < lowX) viewPosX = lowX;
    if (viewPosX + renderWidth + lowX > Const.COLUMNS) viewPosX = Const.COLUMNS - renderWidth - lowX;
}

export function changeViewPosSmoothly(inputY, inverseSpeed) {
    const sign = inputY > 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(inputY); i++) {
        setTimeout(function () {
            changeViewPos(0, sign);
        }, i * inverseSpeed);
    }
}

export async function setInitialViewPos() {
    // If runeNumber given, change viewPos to it
    if (runeNumber) {
        await getChunk(runeNumber)
            .then((res) => {
                prepareBufferForApi(res[4]).then((data) => {
                    const viewY = Math.floor(
                        Const.MARGIN_BOTTOM +
                            Const.MONOLITH_LINES -
                            res[0].toNumber() / Const.MONOLITH_COLUMNS -
                            data[2] / 2 -
                            renderHeight / 2
                    );
                    changeViewPos(0, viewY);
                    console.log('changed viewPos to :', viewY);
                });
            })
            .catch((err) => {
                console.log('error : rune not found');
            });
        // Else, look for a Y in the url
    } else {
        const providedY = parseInt(document.URL.split('y=')[1]);
        if (providedY) {
            changeViewPos(0, providedY);
        }
    }
}

export function increaseZoom(x = 0.2) {
    console.log('increaseZoom');
    zoom(scaleFactor + x);
}

export function decreaseZoom(x = 0.2) {
    zoom(scaleFactor - x);
}

export function toggleZoom() {
    if (scaleFactor === 1) zoom(3);
    else if (scaleFactor === 3) zoom(6);
    else zoom(1);
}

function zoom(factor) {
    if (factor < 1) factor = 1;
    if (factor > 6.6) factor = 6.6;
    canvas.style.transform = `scale(${factor})`;
    if (factor === 1) {
        viewPosX = 0;
        if (viewPosY + renderHeight > Const.LINES) viewPosY = Const.LINES - renderHeight;
        if (viewPosY < 0) viewPosY = 0;
    }
    if (factor > 1) imageCatalog.planLogos.display = false;
    else imageCatalog.planLogos.display = true;
    scaleFactor = factor;
    console.log('scaleFactor', scaleFactor);
    updatePalette();
}
