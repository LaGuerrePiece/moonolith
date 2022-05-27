// prettier-ignore
import Const from './constants';
import { getChunk, getMetaData } from './utils/web3';
import { initDisplay } from './display/displayLoop';
import { changeViewPos } from './display/view';
import { buildMonolith, increaseMonolithHeight } from './monolith/monolith';
import { addSideMonolith, initClouds } from './display/images';
import { parseAPNG, bufferOnMonolith } from './utils/imageManager';
import { launchIntro, skipIntro } from './intro';
import { hammer } from 'hammerjs';

export let importedChunks = 0;

export let runeNumber;
export let Opensea;
export let firstTime = false;

async function initApp() {
    setRoute();
    firstTime = true
    if (firstTime && !Opensea) {
        await parseAPNG();
        launchIntro();
    } else {
        console.log('route : not first time, no intro');
        await parseAPNG();
        let monoHeightSet = setMonoHeightAndBuildIt();
        changeViewPos(0, 2000);
        initDisplay();
        await chunkImport(true, monoHeightSet);
        skipIntro(true);
    }
}

initApp();

setInterval(() => {
    chunkImport(false);
}, 30000);

function setRoute() {
    Opensea = document.URL.split('OS=')[1];
    runeNumber = parseInt(document.URL.split('rune=')[1]);
    if (Opensea) return;
    if (!document.cookie.includes('visited=true')) {
        console.log('First time visiting');
        const date = new Date();
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        let expires = 'expires=' + date.toUTCString();
        document.cookie = 'visited=true;' + ';' + expires + ';path=/';
        firstTime = true;
    }
}

export async function chunkImport(first, monoHeightSet) {
    let meta = await getMetaData();
    if (monoHeightSet) await monoHeightSet;
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
    if (importedChunks - meta.nbChunks !== 0 && !first)
        increaseMonolithHeight(newMonolithHeight - Const.MONOLITH_LINES);
    importedChunks = meta.nbChunks;
    addSideMonolith(newMonolithHeight);
}

export async function setMonoHeightAndBuildIt() {
    let meta = await getMetaData();
    const monolithHeight = Math.floor(192 + (meta.nbKlon * meta.threshold) / (1000000 * Const.COLUMNS));
    Const.setMonolithHeight(monolithHeight);
    buildMonolith();
    initClouds();
}
