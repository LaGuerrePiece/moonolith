// prettier-ignore
import Const from './constants';
import { getChunk, getMetaData } from './utils/web3';
import { buildMonolith, increaseMonolithHeight } from './monolith/monolith';
import { parseAPNG, prepareBufferForApi } from './utils/imageManager';
import { intro, launchIntro } from './intro';
import { scaleFactor } from './controls/controls';
import { hammer } from 'hammerjs';

export let importedChunks = 0;

export let viewPosY = 0;
export let viewPosX = 0;

export let runeNumber;
export let Opensea;
export let firstTime = false;

export const windowHeight = window.innerHeight;
export const windowWidth = window.innerWidth;
export let renderWidth = Const.COLUMNS;
export const pixelSize = windowWidth / renderWidth;
export let renderHeight = Math.ceil((windowHeight * renderWidth) / windowWidth);

async function initApp() {
    setRoute();
    firstTime = true; // To test
    if (firstTime && !Opensea) {
        console.log('parsing first APNGs before intro...');
        await parseAPNG();
        console.log('parsing done, launching intro');
        launchIntro();
    } else {
        parseAPNG();
        await chunkImport(true);
        buildMonolith();
        await setInitialViewPos();
        initDisplay();
        // lazyParseAPNG();
    }
}

initApp();

export function changeViewPos(inputX, inputY) {
    viewPosX += inputX;
    viewPosY += inputY;
    // Limits :
    const lowY = Math.floor(-renderHeight / 2 + renderHeight / (scaleFactor * 2));
    const lowX = Math.floor(-renderWidth / 2 + renderWidth / (scaleFactor * 2));
    if (!intro) {
        // During intro, we can go in the sky
        if (viewPosY + renderHeight + lowY > Const.LINES) viewPosY = Const.LINES - renderHeight - lowY;
    }
    if (viewPosY < lowY) viewPosY = lowY;
    if (viewPosX < lowX) viewPosX = lowX;
    if (viewPosX + renderWidth + lowX > Const.COLUMNS) viewPosX = Const.COLUMNS - renderWidth - lowX;
}

setInterval(() => {
    chunkImport(false);
}, 30000);

async function setInitialViewPos() {
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
                    intro = false;
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

function setRoute() {
    if (!document.cookie.includes('visited=true')) {
        console.log('First time visiting');
        const d = new Date();
        d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
        let expires = 'expires=' + d.toUTCString();
        document.cookie = 'visited=true;' + ';' + expires + ';path=/';
        firstTime = true;
    }
    runeNumber = parseInt(document.URL.split('rune=')[1]);
    Opensea = document.URL.split('OS=')[1];
}

export async function chunkImport(firstTime) {
    let meta = await getMetaData();
    // console.log(meta);
    if (importedChunks !== meta.nbChunks || importedChunks == 1) {
        for (let i = importedChunks + 1; i <= meta.nbChunks; i++) {
            getChunk(i).then((res) => {
                // console.log(res);
                bufferOnMonolith({
                    buffer: res[4],
                    x: res[0].toNumber() % Const.MONOLITH_COLUMNS,
                    y: Math.floor(res[0].toNumber() / Const.MONOLITH_COLUMNS),
                    paid: res[3].toNumber(),
                    yMaxLegal: res[2].toNumber() / 1000000,
                    zIndex: i,
                });
            });
        }
    }
    const newMonolithHeight = Math.floor(192 + (meta.nbKlon * meta.threshold) / (1000000 * Const.COLUMNS));
    if (importedChunks - meta.nbChunks !== 0 && !firstTime)
        increaseMonolithHeight(newMonolithHeight - Const.MONOLITH_LINES);
    importedChunks = meta.nbChunks;
}

export async function setMonoHeight() {
    let meta = await getMetaData();
    // console.log(meta);
    const monolithHeight = Math.floor(192 + (meta.nbKlon * meta.threshold) / (1000000 * Const.COLUMNS));
    Const.setMonolithHeight(monolithHeight);
}
