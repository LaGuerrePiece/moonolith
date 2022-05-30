import Const from '../constants';
import { Opensea, runeNumber } from '../main';
import { introState } from '../intro';
import { getChunk } from '../utils/web3';
import { getWidthAndHeight } from '../utils/imageManager';
import { canvas, renderHeight, renderWidth } from '../display/displayLoop';
import { FAQ, FAQType } from '../display/FAQ';
import { updatePalette } from './GUI';
import { imageCatalog } from './images';

export let scaleFactor = 1;
export let viewPosY = 0;
export let viewPosX = 0;
export let FAQviewPosY = 0;

export function changeViewPos(inputX, inputY) {
    if (FAQ) {
        changeFAQViewPos(inputY);
        return;
    }

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

function changeFAQViewPos(inputY) {
    const FAQHeight = FAQType === 'FAQ' ? imageCatalog.FAQ.img.height : imageCatalog.faqTextMetamask.img.height;
    FAQviewPosY += inputY;
    if (FAQviewPosY < renderHeight - FAQHeight) FAQviewPosY = renderHeight - FAQHeight;
    if (FAQviewPosY > 0) FAQviewPosY = 0;
}

export function changeViewPosSmoothly(inputY, inverseSpeed) {
    // https://stackoverflow.com/questions/30007853/simple-easing-function-in-javascript
    // const pi = Math.PI;
    // (cos(pi*x) + 1) / 2
    const sign = inputY > 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(inputY); i++) {
        setTimeout(() => {
            if (!introState) return;
            changeViewPos(0, sign);
        }, i * inverseSpeed);
    }
}

export async function setInitialViewPos() {
    if (runeNumber) {
        // If runeNumber given, change viewPos to it
        await getChunk(runeNumber)
            .then((chunk) => {
                const y = Math.floor(chunk[0].toNumber() / Const.MONOLITH_COLUMNS);
                getWidthAndHeight(chunk[4]).then(([width, height]) => {
                    const viewY = Math.floor(
                        Const.MARGIN_BOTTOM + Const.MONOLITH_LINES - y - height / 2 - renderHeight / 2
                    );
                    viewPosY = viewY;
                    if (Opensea) {
                        setInitialOpenseaZoom(width, height);
                        const x = chunk[0].toNumber() % Const.MONOLITH_COLUMNS;
                        const viewX = Math.floor(Const.MARGIN_LEFT + x + width / 2 - renderWidth / 2);
                        changeViewPos(viewX, 0);
                    } else {
                        changeViewPos(0, 0);
                    }
                });
            })
            .catch(() => {
                console.log('error getting chunk');
                changeViewPos(0, -9999);
            });
    } else {
        // Else, look for a Y in the url
        const providedY = parseInt(document.URL.split('y=')[1]);
        if (providedY) {
            viewPosY = providedY;
            changeViewPos(0, 0);
        } else {
            changeViewPos(0, -9999);
        }
    }
}

export function increaseZoom(x = 0.1) {
    // console.log('increaseZoom');
    zoom(scaleFactor * (1 + x));
}

export function decreaseZoom(x = 0.1) {
    zoom(scaleFactor * (1 - x));
}

export function toggleZoom() {
    if (scaleFactor === 1) zoom(3);
    else if (scaleFactor === 3) zoom(6);
    else zoom(1);
}

function setInitialOpenseaZoom(width, height) {
    const scale1 = Const.COLUMNS / 1.5 / width;
    const scale2 = renderHeight / 1.5 / height;
    const min = Math.min(scale1, scale2);
    zoom(min);
}

export function zoom(factor) {
    if (FAQ) return;

    const limit = 6.6;
    if (factor < 1) factor = 1;
    if (factor > limit) factor = limit;

    if (factor === 1) {
        viewPosX = 0;
        if (viewPosY + renderHeight > Const.LINES) viewPosY = Const.LINES - renderHeight;
        if (viewPosY < 0) viewPosY = 0;
    }
    if (factor > 1) imageCatalog.planLogos.display = false;
    else imageCatalog.planLogos.display = true;

    canvas.style.transform = `scale(${factor})`;
    scaleFactor = factor;

    updatePalette();
}
