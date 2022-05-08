import Const from '../constants';
import { renderHeight, renderWidth, runeNumber } from '../main';
import { intro } from '../intro';
import { getChunk } from '../utils/web3';
import { prepareBufferForApi } from '../utils/imageManager';
import { canvas } from '../display/displayLoop';

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
    if (viewPosY + renderHeight + lowY > Const.LINES && !intro) viewPosY = Const.LINES - renderHeight - lowY;
    if (viewPosY < lowY) viewPosY = lowY;
    if (viewPosX < lowX) viewPosX = lowX;
    if (viewPosX + renderWidth + lowX > Const.COLUMNS) viewPosX = Const.COLUMNS - renderWidth - lowX;
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

export function increaseZoom() {
    console.log('increaseZoom');
    if (scaleFactor === 1) zoom(3);
    else if (scaleFactor === 3) zoom(6);
}

export function decreaseZoom() {
    if (scaleFactor === 6) zoom(3);
    else if (scaleFactor === 3) zoom(1);
}

export function toggleZoom() {
    if (scaleFactor === 1) zoom(3);
    else if (scaleFactor === 3) zoom(6);
    else zoom(1);
}

function zoom(factor) {
    canvas.style.transform = `scale(${factor})`;
    scaleFactor = factor;
    if (factor === 1) {
        viewPosX = 0;
        if (viewPosY + renderHeight > Const.LINES) viewPosY = Const.LINES - renderHeight;
        if (viewPosY < 0) viewPosY = 0;
    }
}
