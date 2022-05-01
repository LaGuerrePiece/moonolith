// Imports des composants
import { initialDecodeLandscape, lateDecodeLandscape, initialDecodeAnim, imageCatalog } from './assets/imageData';
// Imports des fonctionnalités
import { clickManager, keyManager, scrollManager, mousePosInGrid, selectorUpdate } from './models/tools';
import Const from './models/constants';
import { createApiDisplayPage } from './models/apiDisplayPage';
import { chunkImport, getChunk } from './utils/web3';
import { assemble } from './models/assembler';
import { buildMonolith } from './models/monolith';
import { base64ToBuffer, pngToBufferToRGB, prepareBufferForApi } from './utils/imageManager';

export let canvas;
export let viewPosY = 0;
export let viewPosX = 0;
let myImageData;
let ctx;
export let route;
export let runeNumber;
export let OS;

export const windowHeight = window.innerHeight;
export const windowWidth = window.innerWidth;
export let renderWidth = Const.COLUMNS;
const pixelSize = windowWidth / renderWidth;
export let renderHeight = Math.ceil((windowHeight * renderWidth) / windowWidth);

let InitialImports = 18;

async function initApp() {
    runeNumber = parseInt(document.URL.split('rune=')[1]);
    OS = document.URL.split('OS=')[1];
    // Router
    if (runeNumber && OS === 'false') {
        route = 'Simple API';
        initApiDisplay(runeNumber);
        return;
    } else if (runeNumber && OS === 'true') {
        route = 'Opensea API';
    } else if (runeNumber) {
        route = 'Share specific rune';
    } else {
        route = 'normal';
    }
    await chunkImport();
    initialDecodeLandscape(InitialImports);
    buildMonolith();
    await setInitialViewPosY();
    initialDecodeAnim(InitialImports);
    initDisplay();
    lateDecodeLandscape(InitialImports);
    console.log('route', route);
}

async function setInitialViewPosY() {
    // If runeNumber given, change viewPos to it
    if (runeNumber && OS !== 'false') {
        await getChunk(runeNumber)
            .then((res) => {
                prepareBufferForApi(base64ToBuffer(res[4])).then((data) => {
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
            .catch(() => {
                console.log('error : rune not found');
                // console.log(err);
            });
        // Else, look for a Y in the url
    } else if (route === 'normal') {
        const providedY = parseInt(document.URL.split('y=')[1]);
        if (providedY) changeViewPos(0, providedY);
    }
}

initApp();

function initDisplay() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    // Set canvas dimensions to the ratio of the screen size
    canvas.width = renderWidth;
    canvas.height = renderHeight;
    canvas.onmousedown = clickManager;

    // Set canvas size to size of screen
    canvas.style.width = '100%';
    canvas.style.imageRendering = 'pixelated';
    document.body.style.cssText = 'margin:0;padding:0;';

    // Create image data of size nbColumns * nbRows
    myImageData = ctx.createImageData(renderWidth, renderHeight);
    requestAnimationFrame(update);
}

function initApiDisplay(id) {
    getChunk(id).then((chunk) => {
        console.log('chunk', chunk);
        console.log('base64ToBuffer', base64ToBuffer(chunk[3]));
        prepareBufferForApi(base64ToBuffer(chunk[3])).then((data) => {
            let dataToDisplay = Array.from(data[0]);
            console.log(dataToDisplay.length, data[1], data[2]);

            while (dataToDisplay.length < data[1] * data[2]) {
                dataToDisplay[dataToDisplay.length] = [(0, 0, 0)];
                console.log(dataToDisplay.length, data[1], data[2]);
                console.log('pushed');
            }
            console.log(dataToDisplay, data[1], data[2]);
            while (dataToDisplay.length > data[1] * data[2]) {
                dataToDisplay.pop();
                console.log('poped');
            }
            console.log(dataToDisplay, data[1], data[2]);
            // Convert to Uint8ClampedArray
            dataToDisplay.forEach((x) => x.push(1));
            dataToDisplay = dataToDisplay.flat().map((x) => x * 255);

            // Create canvas and put image data
            createApiDisplayPage(dataToDisplay, data[1], data[2]);
        });
    });
}

function update() {
    myImageData.data.set(assemble(true));
    ctx.putImageData(myImageData, 0, 0);
    requestAnimationFrame(update);
}

//prettier-ignore
document.addEventListener('contextmenu', (e) => { e.preventDefault(); }, false);
//prettier-ignore
document.addEventListener('keydown', (e) => { keyManager(e) });
//prettier-ignore
window.onwheel = function (e) { scrollManager(e) };

export function changeViewPos(inputX, inputY) {
    viewPosX += inputX;
    viewPosY += inputY;
    if (viewPosY + renderHeight > Const.LINES) viewPosY = Const.LINES - renderHeight;
    if (viewPosY < -30) viewPosY = -30;
    if (viewPosX < 0) viewPosX = 0;
    if (viewPosX + renderWidth > Const.COLUMNS) viewPosX = Const.COLUMNS - renderWidth;
}

export function zoom() {
    let zoomFactor = 2.5;
    if (renderWidth === Const.COLUMNS) {
        renderWidth = Math.floor(renderWidth / zoomFactor);
        renderHeight = Math.floor((windowHeight / pixelSize + 1) / zoomFactor);
        console.log(`Zoomed x${zoomFactor} | renderWidth`, renderWidth, 'renderHeight', renderHeight);
        viewPosX = Math.floor(renderWidth / 2);
        viewPosY = Math.floor(viewPosY + renderHeight / 2);
        selectorUpdate();
    } else {
        // console.log('unzoomed');
        renderWidth = Const.COLUMNS;
        renderHeight = Math.ceil((windowHeight * renderWidth) / windowWidth);
        changeViewPos(0, -Math.floor(renderHeight / 4));
        selectorUpdate();
    }
    myImageData = ctx.createImageData(renderWidth, renderHeight);
    canvas.width = renderWidth;
    canvas.height = renderHeight;
}

setInterval(() => {
    chunkImport();
}, 5000);

export let pointer = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    pointer = mousePosInGrid({ x: e.x, y: e.y });
});
