import {
    courgette64,
    twitter,
    collision,
    panneauRainbow,
    runPlan0,
    runPlan1,
    arbre0,
    vaisseau,
} from '../assets/base64';
import { renderHeight } from '../main';
import { viewPosX, viewPosY } from './view';
import { imageCatalog } from './images';
import Const from '../constants';

//prettier-ignore
export let animCatalog = {
    collision: { type: 'intro', startX: 0, startY: 400, display: false, loop: false, parallaxLayer: 1, base64: collision },
    runPlan0: { type: 'intro', startX: 184, startY: 39, display: false, loop: false, parallaxLayer: 0, base64: runPlan0 },
    runPlan1: { type: 'intro', startX: 0, startY: 100, display: false, loop: false, parallaxLayer: 1, base64: runPlan1 },
    twitter: { fileName: 'twitter', startX: 0 + 96, startY: 83, display: true, loop: true, parallaxLayer: 0, base64: twitter },
    panneauRainbow: { fileName: 'panneauRainbow', startX: 227, startY: 183, display: false, loop: false, parallaxLayer: 1, base64: panneauRainbow },
    arbre0: { fileName: 'arbre0', startX: 0, startY: 20, display: true, loop: true, parallaxLayer: 0, base64: arbre0 },
    vaisseau: { fileName: 'vaisseau', startX: 280, startY: 0, display: true, loop: true, parallaxLayer: 0, base64: vaisseau },
};

export let clock = 0;
setInterval(() => {
    clock += 20;
}, 20);

function frameInClock(anim) {
    let frame = 0;
    let delaySum = 0;
    let currentClock = clock - anim.startClock;
    while (delaySum < currentClock % anim.totalDelay) {
        delaySum += anim.delay[frame];
        frame++;
    }
    if (anim.fileName == 'arbre0') {
        console.log('frameInClock', anim.frames.length, frame);
    }
    if (frame >= anim.frames.length - 1) {
        console.log('Animation', anim.fileName, 'finished');
        anim.loop ? (anim.startClock = clock) : (anim.display = false);
        return anim.frames.length - 1;
    }
    return frame;
}

export function launchAnim(anim, endTime) {
    animCatalog[anim].startClock = clock;
    animCatalog[anim].display = true;
    if (endTime) {
        setTimeout(() => {
            animCatalog[anim].display = false;
        }, endTime);
    }
}

export function updateAnimCatalog() {
    for (let anim in animCatalog) {
        const thisAnim = animCatalog[anim];
        const parallaxOffset = Math.floor(imageCatalog['plan' + thisAnim.parallaxLayer].parallax * viewPosY);
        thisAnim.y = renderHeight + parallaxOffset + viewPosY - thisAnim.height - thisAnim.startY;
        thisAnim.x = thisAnim.startX - viewPosX;
    }
}

export function drawAnimations(ctx) {
    for (let anim in animCatalog) {
        const thisAnim = animCatalog[anim];
        if (thisAnim.display) drawFrame(thisAnim.frames[frameInClock(thisAnim)], anim, ctx);
    }
}

function drawFrame(frame, name, ctx) {
    let thisAnim = animCatalog[name];
    let ctxo = thisAnim.canvas.getContext('2d');
    let frameData = ctxo.createImageData(thisAnim.width, thisAnim.height);
    frameData.data.set(frame);
    ctxo.putImageData(frameData, 0, 0);
    ctx.drawImage(thisAnim.canvas, thisAnim.x, thisAnim.y);
}

export function loadAnims() {
    for (let anim in animCatalog) {
        const thisAnim = animCatalog[anim];
        thisAnim.startClock = clock;
        thisAnim.canvas = document.createElement('canvas');
        thisAnim.canvas.width = thisAnim.width;
        thisAnim.canvas.height = thisAnim.height;
    }
}
