// Imports des composants
import DisplayGrid from './models/displayGrid';
import { initialDecodeLandscape, lateDecodeLandscape } from './assets/imageData';
import { undo, redo } from './models/undoStack';
// Imports des fonctionnalités
import { moveDrawing } from './utils/imageManager';
import { clickManager, mousePosInGrid } from './models/tools';

import Const from './models/constants';
import { importChunks } from './utils/web3';
import { assemble } from './models/assembler';

/**********************************
 ************* DISPLAY ************
 **********************************/

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
export let renderHeight = Math.floor(windowHeight / pixelSize) + 1;
let numberOfImports = 15;

function initApp() {
    importChunks();
    initDisplay();
    initialDecodeLandscape(numberOfImports);
    console.log('initApp done');
    lateDecodeLandscape(numberOfImports);
    setTimeout(() => {
        update();
    }, 100);
}

initApp();

function initDisplay() {
    displayGrid = new DisplayGrid(renderWidth, renderHeight);
    displayGrid.initialize(document.body);
    canvas = displayGrid.pixels.canvas;
    canvas.onmousedown = clickManager;
}

export function update() {
    if (new Date() - lastCall < 20) return;
    //data is the array of the displayed klons
    displayData = assemble();
    displayGrid.updateDisplay(displayData);
    lastCall = new Date();
}

function zoom() {
    if (renderWidth == Const.COLUMNS) {
        let zoomFactor = 2;
        console.log(`Zoomed x${zoomFactor} | renderWidth`, renderWidth, 'renderHeight', renderHeight);
        renderWidth = renderWidth / zoomFactor;
        renderHeight = Math.floor((windowHeight / pixelSize + 1) / zoomFactor);
    } else {
        console.log('unzoomed');
        renderWidth = Const.COLUMNS;
        renderHeight = Math.floor(windowHeight / pixelSize) + 1;
    }
    document.body.removeChild(displayGrid.pixels.canvas);
    initDisplay();
    update();
}

//prettier-ignore
document.addEventListener('contextmenu', (e) => { e.preventDefault(); }, false);
//prettier-ignore
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') undo();
    if (e.metaKey && e.key === 'z') undo();
    if (e.ctrlKey && e.key === 'Z') redo();
    if (e.metaKey && e.key === 'Z') redo();
    if (e.ctrlKey && e.key === 'y') redo();
    if (e.metaKey && e.key === 'y') redo();
    if (e.key === 'u') console.log('COLUMNS', Const.COLUMNS, 'LINES', Const.LINES, 'renderWidth', renderWidth, 'renderHeight', renderHeight, 'viewPosX', viewPosX, 'viewPosY', viewPosY);
    if (e.key === 'a') {
        moveDrawing(50, 400);
        update()
    }
    if (e.key === 'y') zoom();
    if (e.key === 'ArrowUp') { viewPosY -= 3; limitsViewPos(); }
    if (e.key === 'ArrowDown') { viewPosY += 3; limitsViewPos(); }
    if (e.key === 'ArrowLeft') { viewPosX += 3; limitsViewPos(); }
    if (e.key === 'ArrowRight') { viewPosX -= 3; limitsViewPos(); }
});

//prettier-ignore
window.onwheel = function (e) {
    if (e.deltaY > 0) { viewPosY -= 3; } else { viewPosY += 3;} limitsViewPos(); };

function limitsViewPos() {
    if (viewPosY < -30) viewPosY = -30;
    if (viewPosY + renderHeight > Const.LINES) viewPosY = Const.LINES - renderHeight;
    if (viewPosX < 0) viewPosX = 0;
    if (viewPosX + renderWidth > Const.COLUMNS) viewPosX = Const.COLUMNS - renderWidth;
    update();
}

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
