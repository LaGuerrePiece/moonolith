// Imports des composants
import DisplayGrid from './models/displayGrid';
import { initialDecodeLandscape, lateDecodeLandscape } from './assets/imageData';
// Imports des fonctionnalités
import { clickManager, keyManager, scrollManager } from './models/tools';

import Const from './models/constants';
import { initialChunkImport, importNewChunks } from './utils/web3';
import { assemble } from './models/assembler';
import { buildMonolith } from './models/monolith';

let displayGrid;
export let canvas;
export let viewPosY = 0;
export let viewPosX = 0;
let lastCall = 0;
export let displayData;

export const windowHeight = window.innerHeight;
export const windowWidth = window.innerWidth;
export let renderWidth = Const.COLUMNS;
const pixelSize = windowWidth / renderWidth;
export let renderHeight = Math.ceil(windowHeight / pixelSize);
let InitialImports = 13;

async function initApp() {
    let initPerf = performance.now();
    console.log('/////////   INITIALIZING APP   /////////');
    await initialChunkImport();
    initialDecodeLandscape(InitialImports);
    buildMonolith();
    initDisplay();
    lateDecodeLandscape(InitialImports);
    console.log('//         End of init', Math.floor(performance.now() - initPerf), 'ms        //');
    console.log('//////  INITIALIZATION COMPLETE   //////');
    setTimeout(() => {
        update();
    }, 501);
}

initApp();

function initDisplay() {
    displayGrid = new DisplayGrid(renderWidth, renderHeight);
    displayGrid.initialize(document.body);
    canvas = displayGrid.pixels.canvas;
    canvas.onmousedown = clickManager;
    console.log('//      displayGrid initialized       //');
}

export function update() {
    if (new Date() - lastCall < 30) return;
    //data is the array of the displayed klons
    displayData = assemble();
    displayGrid.updateDisplay(displayData);
    lastCall = new Date();
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
    if (viewPosY < -30) viewPosY = -30;
    if (viewPosY + renderHeight > Const.LINES) viewPosY = Const.LINES - renderHeight;
    if (viewPosX < 0) viewPosX = 0;
    if (viewPosX + renderWidth > Const.COLUMNS) viewPosX = Const.COLUMNS - renderWidth;
    update();
}

export function zoom() {
    if (renderWidth == Const.COLUMNS) {
        let zoomFactor = 2;
        console.log(`Zoomed x${zoomFactor} | renderWidth`, renderWidth, 'renderHeight', renderHeight);
        renderWidth = renderWidth / zoomFactor;
        renderHeight = Math.floor((windowHeight / pixelSize + 1) / zoomFactor);
        viewPosX = Math.floor(viewPosX + renderWidth / 2);
        viewPosY = Math.floor(viewPosY + renderHeight / 2);
    } else {
        console.log('unzoomed');
        viewPosX = Math.floor(viewPosX - renderWidth / 2);
        viewPosY = Math.floor(viewPosY - renderHeight / 2);
        renderWidth = Const.COLUMNS;
        renderHeight = Math.ceil(windowHeight / pixelSize);
    }
    document.body.removeChild(displayGrid.pixels.canvas);
    initDisplay();
    setTimeout(() => {
        update();
    }, 50);
}

setInterval(() => {
    importNewChunks();
}, 5000);

// TENTATIVE DE POINTEUR

// let oldColor = [0, 0, 0];
// let oldY = 100;
// let oldX = 100;

// document.addEventListener('mousemove', (e) => {
//     const mousePos = convertToMonolithPos(mousePosInGrid({ x: e.x, y: e.y }));
//     if (!mousePos) return;
//     for (let i = -1; i <= 1; i++) {
//         for (let j = -1; j <= 1; j++) {
//             monolith[oldY + i][oldX + j].color = oldColor;
//         }
//     }

//     oldColor = monolith[mousePos.y][mousePos.x].color;

//     oldY = mousePos.y;
//     oldX = mousePos.x;

//     for (let i = -1; i <= 1; i++) {
//         for (let j = -1; j <= 1; j++) {
//             monolith[mousePos.y + i][mousePos.x + j].color = [1, 1, 1];
//         }
//     }
//console.log('mousePos', mousePos);
// });
