// prettier-ignore
import Const from './constants';
import { getChunk, getMetaData, getAllChunks } from './utils/web3';
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
    // firstTime = true;
    if (firstTime && !Opensea) {
        await parseAPNG();
        launchIntro();
    } else {
        await parseAPNG();
        let monoHeightSet = setMonoHeightAndBuildIt();
        changeViewPos(0, 2000);
        initDisplay();
        await chunkImport(monoHeightSet);
        skipIntro(true);
    }
}

initApp();

setInterval(() => {
    importNewChunks();
}, 30000);

function setRoute() {
    Opensea = document.URL.split('OS=')[1];
    runeNumber = parseInt(document.URL.split('mark=')[1]);
    if (Opensea) return;
    if (!document.cookie.includes('visited=true')) {
        const date = new Date();
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        let expires = 'expires=' + date.toUTCString();
        document.cookie = 'visited=true;' + ';' + expires + ';path=/';
        firstTime = true;
    }
}

export async function chunkImport(monoHeightSet) {
    if (monoHeightSet) await monoHeightSet;
    getAllChunks().then((res) => {
        res.forEach((chunk) => {
            bufferOnMonolith({
                buffer: chunk.image,
                x: chunk.position.toNumber() % Const.MONOLITH_COLUMNS,
                y: Math.floor(chunk.position.toNumber() / Const.MONOLITH_COLUMNS),
                paid: chunk.nbpix.toNumber(),
                yMaxLegal: chunk.ymaxLegal.toNumber() / 1000000,
                zIndex: chunk.id.toNumber(),
            });
        });
    });
    let meta = await getMetaData();
    importedChunks = meta.nbChunks;
}

export async function importNewChunks() {
    let meta = await getMetaData();
    if (importedChunks !== meta.nbChunks) {
        for (let i = importedChunks + 1; i <= meta.nbChunks; i++) {
            getChunk(i).then((chunk) => {
                bufferOnMonolith({
                    buffer: chunk[4],
                    x: chunk[0].toNumber() % Const.MONOLITH_COLUMNS,
                    y: Math.floor(chunk[0].toNumber() / Const.MONOLITH_COLUMNS),
                    paid: chunk[3].toNumber(),
                    yMaxLegal: chunk[2].toNumber() / 1000000,
                    zIndex: i,
                });
            });
        }
    }
    const newMonolithHeight = Math.floor(192 + (meta.nbKlon * meta.threshold) / 1000000);
    if (importedChunks - meta.nbChunks !== 0) increaseMonolithHeight(newMonolithHeight - Const.MONOLITH_LINES);
    importedChunks = meta.nbChunks;
    addSideMonolith(newMonolithHeight);
}

export async function setMonoHeightAndBuildIt() {
    let meta = await getMetaData();
    const monolithHeight = Math.floor(192 + (meta.nbKlon * meta.threshold) / 1000000);
    Const.setMonolithHeight(monolithHeight);
    buildMonolith();
    initClouds();
}
