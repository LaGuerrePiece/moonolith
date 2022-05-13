//prettier-ignore
import { twitter, vent0, collision, panneauRainbow, runPlan0, runPlan1, arbre0, vaisseau, introRunB, introRunC, introRunD } from '../assets/base64';
import { renderHeight } from './displayLoop';
import { viewPosX, viewPosY } from './view';
import Const from '../constants';

//prettier-ignore
export let animCatalog = {
    // twitter: { fileName: 'twitter', startX: 0 + 96, startY: 83, display: true, loop: true, layer: 0, base64: twitter },
    panneauRainbow: { fileName: 'panneauRainbow', startX: 227, startY: 183, display: false, loop: false, layer: 1, base64: panneauRainbow },
    arbre0: { fileName: 'arbre0', startX: 25, startY: 0, display: true, loop: true, layer: 0, base64: arbre0 },
    vent0: { fileName: 'vent0', startX: 0, startY: 0, display: true, loop: true, layer: 0, base64: vent0 },
    vaisseau: { fileName: 'vaisseau', startX: 280, startY: 15, display: true, loop: true, layer: 0, base64: vaisseau },

    collision: { type: 'intro', startX: 0, startY: 400, display: false, loop: false, layer: 1, base64: collision },
    runPlan0: { type: 'intro', startX: 187, startY: 33, display: false, loop: false, layer: 0, base64: runPlan0 },
    introRunB: { type: 'intro', startX: 71, startY: 92, display: false, loop: false, layer: 1, base64: introRunB },
    introRunC: { type: 'intro', startX: -25, startY: 1, display: false, loop: false, layer: 1, base64: introRunC },
    introRunD: { type: 'intro', startX: -5, startY: 13, display: false, loop: false, layer: 1, base64: introRunD },
};

function animFrameManager(anim) {
    let thisAnim = animCatalog[anim];
    let currentFrame = thisAnim.currentFrame;
    setTimeout(() => {
        if (thisAnim.currentFrame < thisAnim.frames.length - 1) {
            thisAnim.currentFrame++;
            animFrameManager(anim);
        } else if (thisAnim.loop) {
            thisAnim.currentFrame = 0;
            animFrameManager(anim);
        } else {
            thisAnim.display = false;
        }
    }, thisAnim.delay[currentFrame]);
}

export function launchAnim(anim, endTime) {
    animFrameManager(anim);
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
        const parallaxOffset = Math.floor(thisAnim.parallax * viewPosY);
        thisAnim.y = renderHeight + parallaxOffset + viewPosY - thisAnim.height - thisAnim.startY;
        thisAnim.x = thisAnim.startX - viewPosX;
    }
}

export function drawAnimations(ctx, layer) {
    for (let anim in animCatalog) {
        const thisAnim = animCatalog[anim];
        if (thisAnim.layer !== layer || !thisAnim.display) continue;
        drawFrame(thisAnim.frames[thisAnim.currentFrame], anim, ctx);
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
        thisAnim.canvas = document.createElement('canvas');
        thisAnim.canvas.width = thisAnim.width;
        thisAnim.canvas.height = thisAnim.height;

        thisAnim.parallax = Const.PARALLAX_LAYERS[thisAnim.layer];
        thisAnim.currentFrame = 0;
        if (thisAnim.type !== 'intro') {
            launchAnim(anim);
        }
    }
}
