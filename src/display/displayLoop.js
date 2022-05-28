//prettier-ignore
import { viewPosX, viewPosY, changeViewPos } from './view';
import Const from '../constants';
import { monolith } from '../monolith/monolith';
import { animateMonolith } from '../monolith/monolithAnims';
import { toggleRumble } from '../assets/sounds';
import { addPointer } from './pointer';
import { loadImages, imageCatalog, updateImageCatalog, drawImages } from './images';
import { loadAnims, updateAnimCatalog, drawAnimations } from './animations';
import { loadGUI, updateGUICatalog, drawGUI } from './GUI';
import { monolithDisplayHeightIntro, introState } from '../intro';
import { FAQ, drawFAQ } from './FAQ';

export let windowHeight = window.innerHeight;
export let windowWidth = window.innerWidth;
export let renderWidth = Const.COLUMNS;
export let pixelSize = windowWidth / renderWidth;
export let renderHeight = Math.ceil((windowHeight * renderWidth) / windowWidth);
export let canvas;

export function initDisplay() {
    initCanvas();
    let ctx = canvas.getContext('2d');

    loadImages();
    loadGUI();
    loadAnims();

    requestAnimationFrame(update);

    function update() {
        updateImageCatalog();
        updateAnimCatalog();
        updateGUICatalog();
        if (!introState) animateMonolith();

        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(196, 130, 127)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (FAQ) {
            drawFAQ(ctx);
            requestAnimationFrame(update);
            return;
        }
        drawLayer(ctx, 6);
        drawLayer(ctx, 5);
        drawLayer(ctx, 4);
        drawLayer(ctx, 3.5);
        drawLayer(ctx, 3);
        drawLayer(ctx, 2.5);
        drawLayer(ctx, 2);
        drawLayer(ctx, 1.5);
        drawMonolith(ctx);
        drawLayer(ctx, 1);
        drawLayer(ctx, 0.5);
        drawLayer(ctx, 0);
        drawLayer(ctx, -1);
        drawGUI(ctx);

        requestAnimationFrame(update);
    }
}

function drawLayer(ctx, layer) {
    drawImages(ctx, layer);
    drawAnimations(ctx, layer);
}

export function drawMonolith(ctx) {
    const monolithDisplayHeight = introState
        ? monolithDisplayHeightIntro
        : renderHeight -
          Math.max(Const.MARGIN_BOTTOM - viewPosY, 0) -
          Math.max(Const.MARGIN_TOP - (Const.LINES - viewPosY - renderHeight), 0);
    if (monolithDisplayHeight <= 0) return;
    let monolithData = ctx.createImageData(Const.MONOLITH_COLUMNS, monolithDisplayHeight);
    monolithData.data.set(cutMonolith(addPointer(monolith.slice()), monolithDisplayHeight));
    const posY = introState
        ? renderHeight - Const.MARGIN_BOTTOM - monolithDisplayHeightIntro + viewPosY
        : Const.MARGIN_TOP - Const.LINES + viewPosY + renderHeight;
    ctx.putImageData(monolithData, Const.MARGIN_LEFT - viewPosX, Math.max(posY, 0));
}

function cutMonolith(mono, monolithDisplayHeight) {
    const startYCoordinate = introState
        ? Math.max(monolithDisplayHeight + Const.MARGIN_BOTTOM - renderHeight - viewPosY, 0)
        : Math.max(Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - renderHeight - viewPosY, 0);
    const endYCoordinate = Math.min(startYCoordinate + monolithDisplayHeight, Const.MONOLITH_LINES);

    return mono.subarray(Const.MONOLITH_COLUMNS * 4 * startYCoordinate, Const.MONOLITH_COLUMNS * 4 * endYCoordinate);
}

export function shake(newRows, launchedDuringIntro = false) {
    toggleRumble();
    //shake landscapes
    const shakeLandscape = setInterval(() => {
        if (launchedDuringIntro && !introState) return;
        for (let layer in imageCatalog) {
            const thisLayer = imageCatalog[layer];
            if (thisLayer.type === 'landscape' && layer !== 'plan2') {
                let offset = Math.floor(Math.random() * 3);
                let direction = Math.floor(Math.random() * 2) * 2 - 1; //-1 or 1
                switch (offset) {
                    case 0:
                        thisLayer.shakeX = -direction;
                        break;
                    case 1:
                    case 2:
                        thisLayer.shakeX = 0;
                        break;
                }
            }
        }
    }, 60);

    const shakeViewPos = setInterval(() => {
        if (launchedDuringIntro && !introState) return;
        changeViewPos(Math.floor(Math.random() * 3) - 1, Math.floor(Math.random() * 3) - 1);
    }, 20);

    //clear landscape shake
    setTimeout(() => {
        clearInterval(shakeLandscape);
        clearInterval(shakeViewPos);
        for (let layer in imageCatalog) {
            const thisLayer = imageCatalog[layer];
            if (thisLayer.type === 'landscape') thisLayer.shakeX = 0;
        }
        toggleRumble();
    }, 2000 + 500 * Math.log(newRows));
}

function initCanvas() {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    // Set canvas dimensions to the ratio of the screen size
    canvas.width = renderWidth;
    canvas.height = renderHeight;
    // Set canvas size to size of screen
    canvas.style.width = '100%';
    canvas.style.imageRendering = 'pixelated';
    document.body.style.overflow = 'hidden';
    window.onresize = resizeManager;
}

function resizeManager() {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    pixelSize = windowWidth / renderWidth;
    renderHeight = Math.ceil((windowHeight * renderWidth) / windowWidth);
    canvas.width = renderWidth;
    canvas.height = renderHeight;
}
