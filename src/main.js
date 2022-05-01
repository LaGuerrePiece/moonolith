// Imports des composants
import { initialDecodeLandscape, lateDecodeLandscape, initialDecodeAnim, imageCatalog } from './assets/imageData';
// Imports des fonctionnalités
import { clickManager, keyManager, scrollManager, mousePosInGrid, selectorUpdate, touchManager } from './models/tools';
import Const from './models/constants';
import { createApiDisplayPage } from './models/apiDisplayPage';
import { chunkImport, getChunk } from './utils/web3';
import { assemble } from './models/assembler';
import { buildMonolith } from './models/monolith';
import { base64ToBuffer, prepareBufferForApi } from './utils/imageManager';
import { PointerListener } from 'contactjs';

export let canvas;
export let viewPosY = 0;
export let viewPosX = 0;
let myImageData;
let ctx;

export const windowHeight = window.innerHeight;
export const windowWidth = window.innerWidth;
export let renderWidth = Const.COLUMNS;
const pixelSize = windowWidth / renderWidth;
export let renderHeight = Math.ceil((windowHeight * renderWidth) / windowWidth);

let InitialImports = 18;

async function initApp() {
    let runeNumber = parseInt(document.URL.split('?rune=')[1]);
    if (runeNumber) initApiDisplay(runeNumber);
    else {
        await chunkImport();
        initialDecodeLandscape(InitialImports);
        buildMonolith();
        initialDecodeAnim(InitialImports);
        initDisplay();
        lateDecodeLandscape(InitialImports);
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

    const providedY = parseInt(window.location.href.split('=')[1]);
    if (providedY) changeViewPos(0, providedY);

    var pointerListener = new PointerListener(canvas);

    document.addEventListener('tap', function (event) {
        // do something on tap
        console.log('tap');
    });

    document.addEventListener('pinch', function (event) {
        // console.log('event', event, Math.floor(event.detail.global.distance), event.detail.global.scale);
        if (event.detail.contact.multipointer.globalParameters.distanceChange > 100) zoom('in');
        else if (event.detail.contact.multipointer.globalParameters.distanceChange < -100) zoom('out');
        console.log('event', event.detail.contact.multipointer.globalParameters.distanceChange);
    });
    /*
    document.addEventListener('pan', function (event) {
        let pointerId = event.detail.contact.primaryPointerId;
        let deltaX = event.detail.contact.pointerInputs[pointerId].globalParameters.deltaX;
        let deltaY = event.detail.contact.pointerInputs[pointerId].globalParameters.deltaY;
        console.log('PAN', Math.floor(deltaX / 30), Math.floor(deltaY / 30));
        changeViewPos(Math.floor(deltaX / -30), Math.floor(deltaY / 30));
    });*/
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

document.addEventListener(
    'touchmove',
    (e) => {
        e.preventDefault();
        // touchManager(e);
    },
    { passive: false }
);
// document.addEventListener('touchend', (e) => {
//     touchManager(e);
// });
// document.addEventListener('touchstart', (e) => {
//     touchManager(e);
// });

export function changeViewPos(inputX, inputY) {
    viewPosX += inputX;
    viewPosY += inputY;
    if (viewPosY + renderHeight > Const.LINES) viewPosY = Const.LINES - renderHeight;
    if (viewPosY < -30) viewPosY = -30;
    if (viewPosX < 0) viewPosX = 0;
    if (viewPosX + renderWidth > Const.COLUMNS) viewPosX = Const.COLUMNS - renderWidth;
}

let toggleZoom = false;
export function zoom(touch) {
    let zoomFactor = 2.5;
    if (renderWidth === Const.COLUMNS || (touch === 'in' && toggleZoom === false)) {
        renderWidth = Math.floor(renderWidth / zoomFactor);
        renderHeight = Math.floor((windowHeight / pixelSize + 1) / zoomFactor);
        console.log(`Zoomed x${zoomFactor} | renderWidth`, renderWidth, 'renderHeight', renderHeight);
        viewPosX = Math.floor(renderWidth / 2);
        viewPosY = Math.floor(viewPosY + renderHeight / 2);
        selectorUpdate();
        toggleZoom = true;
    } else if (renderWidth !== Const.COLUMNS || (touch === 'out' && toggleZoom === true)) {
        console.log('unzoomed');
        renderWidth = Const.COLUMNS;
        renderHeight = Math.ceil((windowHeight * renderWidth) / windowWidth);
        changeViewPos(0, -Math.floor(renderHeight / 4));
        selectorUpdate();
        toggleZoom = false;
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
