import { courgette64, twitter, collision, panneauRainbow, runPlan0, runPlan1 } from '../assets/base64';
import { renderHeight } from '../main';
import { viewPosX, viewPosY } from './view';
import { imageCatalog } from './images';
import Const from '../constants';

//prettier-ignore
export let animCatalog = {
    // courgette0: { fileName: 'courgette', startX: 20, startY: 450, display: true, loop: true, parallax: imageCatalog.plan5.parallax, base64: courgette64 },
    courgette1: { fileName: 'courgette', startX: 100, startY: 100, display: false, loop: true, parallaxLayer: 1, base64: courgette64 },
    twitter: { fileName: 'twitter', startX: 0 + 96, startY: 83, display: true, loop: true, parallaxLayer: 0, base64: twitter },
    panneauRainbow: { fileName: 'panneauRainbow', startX: 227, startY: 183, display: false, loop: false, parallaxLayer: 1, base64: panneauRainbow },
    runPlan0: { type: 'intro', startX: 184, startY: 39, display: false, loop: false, parallaxLayer: 0, base64: runPlan0 },
    runPlan1: { type: 'intro', startX: 0, startY: 100, display: false, loop: false, parallaxLayer: 1, base64: runPlan1 },
    collision: { type: 'intro', startX: 0, startY: 400, display: false, loop: false, parallaxLayer: 1, base64: collision },
};

export let clock = 0;
setInterval(() => {
    clock += 20;
}, 20);

function frameInClock(anim) {
    let frame = 0;
    let delaySum = 0;
    while (delaySum < clock % anim.totalDelay) {
        delaySum += anim.delay[frame];
        frame++;
    }
    if (frame >= anim.frames.length - 1) {
        // le -1 est sale mais sinon la boucle ne rentre pas pour le panneau
        anim.loop ? (frame = 0) : (anim.display = false);
    }
    return frame;
}

export function launchAnim(name, endTime) {
    animCatalog[name].display = true;
    if (endTime) {
        setTimeout(() => {
            animCatalog[name].display = false;
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
    let ctxo = animCatalog[name].canvas.getContext('2d');
    let frameData = ctxo.createImageData(animCatalog[name].width, animCatalog[name].height);
    frameData.data.set(frame);
    ctxo.putImageData(frameData, 0, 0);
    ctx.drawImage(animCatalog[name].canvas, animCatalog[name].x, animCatalog[name].y);
}

export function loadAnims() {
    for (let anim in animCatalog) {
        const thisAnim = animCatalog[anim];
        thisAnim.canvas = document.createElement('canvas');
        thisAnim.canvas.width = thisAnim.width;
        thisAnim.canvas.height = thisAnim.height;
    }
    console.log('animCatalog', animCatalog);
}
