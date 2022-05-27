//prettier-ignore
import { twitter, vent0, collision, panneauRainbow, duck, runPlan0, arbre0, arbre1, vaisseau, introRunB, introRunC, introRunD, postMonolith, autourDuFeu, discordOn, discordOff, gitOn, gitOff, bookOn, bookOff} from '../assets/base64';
import { renderHeight } from './displayLoop';
import { viewPosX, viewPosY } from './view';
import { introState } from '../intro';
import Const from '../constants';

//prettier-ignore
export let animCatalog = {
    panneauRainbow: { type: 'postIntro', startX: 292, startY: 178, display: false, loop: false, layer: 1, base64: panneauRainbow },
    arbre0: { type: 'continual', startX: 25, startY: 0, display: true, loop: true, layer: 0, base64: arbre0 },
    arbre1: { type: 'continual', startX: 0, startY: 82, display: true, loop: true, layer: 1, base64: arbre1 },
    vent0: { type: 'continual', startX: 0, startY: 0, display: true, loop: true, layer: 0, base64: vent0 },
    vaisseau: { type: 'intro', startX: 280, startY: 15, display: true, loop: true, layer: 0, base64: vaisseau },
    collision: { type: 'intro', startX: 0, startY: 0, display: false, loop: false, layer: 1, base64: collision },
    runPlan0: { type: 'intro', startX: 187, startY: 33, display: false, loop: false, layer: 0, base64: runPlan0 },
    introRunB: { type: 'intro', startX: 71, startY: 92, display: false, loop: false, layer: 1, base64: introRunB },
    introRunC: { type: 'intro', startX: -25, startY: 1, display: false, loop: false, layer: 1, base64: introRunC },
    introRunD: { type: 'intro', startX: -5, startY: 13, display: false, loop: false, layer: 1, base64: introRunD },
    postMonolith: { type: 'intro', startX: 71, startY: -5, display: false, loop: false, layer: 1, base64: postMonolith },
    autourDuFeu: { type: 'postIntro', startX: 67, startY: -9, display: false, loop: true, layer: 1, base64: autourDuFeu },
    twitter: { type: 'continual', startX: 121, startY: 83, display: true, loop: true, layer: 0, base64: twitter },
    duck: { type: 'continual', startX: 0, startY: 750, display: true, loop: true, layer: 0, base64: duck },
    discordOn: { type: 'onMouse', startX: 38, startY: 46, display: false, loop: false, layer: -1, base64: discordOn },
    discordOff: { type: 'onMouse', startX: 38, startY: 46, display: false, loop: false, layer: -1, base64: discordOff },
    gitOn: { type: 'onMouse', startX: 41, startY: 7, display: false, loop: false, layer: -1, base64: gitOn },
    gitOff: { type: 'onMouse', startX: 41, startY: 7, display: false, loop: false, layer: -1, base64: gitOff },
    bookOn: { type: 'onMouse', startX: 74, startY: 29, display: false, loop: false, layer: -1, base64: bookOn },
    bookOff: { type: 'onMouse', startX: 74, startY: 29, display: false, loop: false, layer: -1, base64: bookOff },
};

function animFrameManager(anim) {
    let thisAnim = animCatalog[anim];
    if (thisAnim.type === 'intro' && !introState) thisAnim.display = false;
    let currentFrame = thisAnim.currentFrame;
    setTimeout(() => {
        if (thisAnim.currentFrame < thisAnim.frames.length - 1) {
            thisAnim.currentFrame++;
            animFrameManager(anim);
        } else if (thisAnim.loop) {
            thisAnim.currentFrame = 0;
            animFrameManager(anim);
        } else {
            thisAnim.currentFrame = 0;
            thisAnim.display = false;
        }
    }, thisAnim.delay[currentFrame]);
}

export function launchAnim(anim) {
    animCatalog[anim].display = true;
    animFrameManager(anim);
}

export function updateAnimCatalog() {
    for (let anim in animCatalog) {
        const thisAnim = animCatalog[anim];
        const parallaxOffset = Math.floor(thisAnim.parallax * viewPosY);
        thisAnim.y = renderHeight + parallaxOffset + viewPosY - thisAnim.height - thisAnim.startY;
        thisAnim.x = thisAnim.startX - viewPosX;
        if (anim === 'postMonolith' || anim === 'autourDuFeu') {
            thisAnim.y -= Const.MONOLITH_LINES + Const.MARGIN_BOTTOM;
            thisAnim.x += Const.MARGIN_LEFT;
        }
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
        if (thisAnim.type === 'continual') {
            launchAnim(anim);
        }
        if (anim === 'collision') thisAnim.startY = Math.floor(renderHeight / 2) - 140;
    }
}
