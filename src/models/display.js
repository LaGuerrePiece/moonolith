import { courgette64, twitter } from '../assets/base64';
import {
    renderHeight,
    renderWidth,
    viewPosX,
    viewPosY,
    deviceType,
    pointer,
    windowHeight,
    pixelSize,
    scaleFactor,
    intro,
    changeViewPos,
} from '../main';
import Const from './constants';
import { convertToMonolithPos, monolith, monolithIndexes } from './monolith';
import { clickManager, colorNumber1, colorNumber2 } from './tools';
import { tool } from './tools';
import { animateMonolith, animateRune } from '../utils/runeAnims';
import { chunksToAnimateInfo } from '../utils/imageManager';
import { getContractAddress } from '../utils/web3';
import { toggleRumble } from '../assets/sounds';
import { paletteCatalog } from '../utils/paletteCatalog';

let monolithDisplayHeightIntro = 0;
let chunkNumber;

export let clock = 0;
setInterval(() => {
    clock += 100;
}, 100);

export let imageCatalog = {
    plan5: { fileName: 'plan5', type: 'landscape', startX: -2, startY: 330, parallax: 0.3, display: true },
    plan4: { fileName: 'plan4', type: 'landscape', startX: -2, startY: 300, parallax: 0.25, display: true },
    plan3: { fileName: 'plan3', type: 'landscape', startX: -2, startY: 250, parallax: 0.2, display: true },
    plan2: { fileName: 'plan2', type: 'landscape', startX: -2, startY: 190, parallax: 0.15, display: true },
    moonolithTop: { fileName: 'moonolithTop', type: 'side', startY: 0, startX: 0, display: true },
    moonolithSide: { fileName: 'moonolithSide', type: 'side', startY: 290, startX: 255, display: true },
    moonolithSide2: { fileName: 'moonolithSide', type: 'side', startY: 758, startX: 255, display: true },
    moonolithSide3: { fileName: 'moonolithSide', type: 'side', startY: 1226, startX: 255, display: true },
    plan1: { fileName: 'plan1', type: 'landscape', startX: -2, startY: 80, parallax: 0, display: true },
    plan0: { fileName: 'plan0', type: 'landscape', startX: -2, startY: 0, parallax: -0.15, display: true },
    panneau: { fileName: 'panneau', type: 'popup', display: false },
    share: { fileName: 'share', type: 'popup', display: false },
    selectorA: { fileName: '/palette/selector1A', type: 'GUI', display: true },
    selectorB: { fileName: '/palette/selector1B', type: 'GUI', display: true },
    palette: { fileName: '/palette/palette1giga', type: 'palette', display: true },
};

//prettier-ignore
export let animCatalog = {
    courgette0: { fileName: 'courgette', type: 'legume', startX: 20, startY: 450, display: true, loop: true, parallax: 0.3, base64: courgette64 },
    courgette1: { fileName: 'courgette', type: 'legume', startX: 100, startY: 1150, display: false, loop: true, parallax: 0, base64: courgette64 },
    twitter: { fileName: 'twitter', type: 'oiseau', startX: 94, startY: 83, display: true, loop: true, parallax: -0.15, base64: twitter },
};

function frameInClock(anim) {
    let frame = 0;
    let delaySum = 0;
    while (delaySum < clock % anim.totalDelay) {
        delaySum += anim.delay[frame];
        frame++;
    }
    if (frame >= anim.frames.length) frame = 0;
    return frame;
}

export let canvas = document.createElement('canvas');

export function initDisplay() {
    canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    // Set canvas dimensions to the ratio of the screen size
    canvas.width = renderWidth;
    canvas.height = renderHeight;
    if (deviceType !== 'mobile') canvas.onmousedown = clickManager;
    // Set canvas size to size of screen
    canvas.style.width = '100%';
    canvas.style.imageRendering = 'pixelated';
    document.body.style.cssText = 'margin:0;padding:0;';

    for (let image in imageCatalog) {
        imageCatalog[image].img = new Image();
        imageCatalog[image].img.src = `/src/assets/images/${imageCatalog[image].fileName}.png`;
    }
    for (let image in paletteCatalog) {
        paletteCatalog[image].img = new Image();
        paletteCatalog[image].img.src = `/src/assets/images/palette/${paletteCatalog[image].fileName}.png`;
    }
    for (let anim in animCatalog) {
        if (animCatalog[anim].display) {
            animCatalog[anim].canvas = document.createElement('canvas');
        }
    }
    requestAnimationFrame(update);

    function update() {
        updateCatalog();
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(196, 130, 127)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let image in imageCatalog) {
            const thisImage = imageCatalog[image];
            if (thisImage.display) ctx.drawImage(thisImage.img, thisImage.x, thisImage.y);
            if (image === 'plan2') drawMonolith(ctx);
            if (image === 'plan0') {
                for (let anim in animCatalog) {
                    const thisAnim = animCatalog[anim];
                    if (thisAnim.display) drawAnim(thisAnim.frames[frameInClock(thisAnim)], anim, ctx);
                }
            }
        }
        requestAnimationFrame(update);
    }
}

function drawAnim(frame, name, ctx) {
    let ctxo = animCatalog[name].canvas.getContext('2d');
    let frameData = ctxo.createImageData(animCatalog[name].width, animCatalog[name].height);
    frameData.data.set(frame);
    ctxo.putImageData(frameData, 0, 0);
    ctx.drawImage(animCatalog[name].canvas, animCatalog[name].x, animCatalog[name].y);
}

function drawMonolith(ctx) {
    const monolithDisplayHeight = intro
        ? monolithDisplayHeightIntro
        : renderHeight -
          Math.max(Const.MARGIN_BOTTOM - viewPosY, 0) -
          Math.max(Const.MARGIN_TOP - (Const.LINES - viewPosY - renderHeight), 0);
    if (monolithDisplayHeight <= 0) return;
    let monolithData = ctx.createImageData(Const.MONOLITH_COLUMNS, monolithDisplayHeight);
    const a = addPointer(monolith.slice());
    monolithData.data.set(cutMonolith(a, monolithDisplayHeight));
    const posY = intro
        ? renderHeight - Const.MARGIN_BOTTOM - monolithDisplayHeightIntro + viewPosY
        : Const.MARGIN_TOP - Const.LINES + viewPosY + renderHeight;
    ctx.putImageData(monolithData, Const.MARGIN_LEFT - viewPosX, Math.max(posY, 0));
}

function cutMonolith(mono, monolithDisplayHeight) {
    const startYCoordinate = intro
        ? Math.max(monolithDisplayHeight + Const.MARGIN_BOTTOM - renderHeight - viewPosY, 0)
        : Math.max(Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - renderHeight - viewPosY, 0);
    const endYCoordinate = Math.min(startYCoordinate + monolithDisplayHeight, Const.MONOLITH_LINES);

    return mono.subarray(Const.MONOLITH_COLUMNS * 4 * startYCoordinate, Const.MONOLITH_COLUMNS * 4 * endYCoordinate);
}

function updateCatalog() {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        if (thisImage.type === 'landscape') {
            const parallaxOffset = Math.floor(thisImage.parallax * viewPosY);
            thisImage.y = renderHeight + parallaxOffset + viewPosY - thisImage.img.height - thisImage.startY;
            thisImage.x = thisImage.startX - viewPosX;
        } else if (thisImage.type === 'palette') {
            const boundingClientRect = canvas.getBoundingClientRect();
            thisImage.y = Math.floor(
                ((windowHeight - boundingClientRect.y) / (pixelSize * scaleFactor) - imageCatalog.palette.img.height) /
                    Const.GUI_RELATIVE_Y
            );
            thisImage.x = Math.floor((renderWidth - imageCatalog.palette.img.width) / Const.GUI_RELATIVE_X);
        } else if (thisImage.type === 'popup') {
            thisImage.y = Math.floor((renderHeight - imageCatalog.panneau.img.height) / 2 - 6);
            thisImage.x = Math.floor((Const.COLUMNS - imageCatalog.panneau.img.width) / 2);
        } else if (image === 'selectorA') {
            const offset = 6;
            thisImage.y = imageCatalog.palette.y - 1 + Math.floor(colorNumber1 / 9) * 15;
            thisImage.x = imageCatalog.palette.x + offset + colorNumber1 * 15 - Math.floor(colorNumber1 / 9) * 120;
        } else if (image === 'selectorB') {
            const offset = 6;
            thisImage.y = imageCatalog.palette.y - 1 + Math.floor(colorNumber2 / 9) * 15;
            thisImage.x = imageCatalog.palette.x + offset + colorNumber2 * 15 - Math.floor(colorNumber2 / 9) * 120;
        } else if (thisImage.type === 'side') {
            thisImage.y = thisImage.startY + renderHeight + viewPosY - Const.MONOLITH_LINES - Const.MARGIN_BOTTOM - 7;
            thisImage.x = thisImage.startX + Const.MARGIN_LEFT - viewPosX;
            if (intro) thisImage.y = thisImage.y + Const.MONOLITH_LINES - monolithDisplayHeightIntro;
        }
    }
    imageCatalog.panneau.display = isInSquare(227, 239, 188, 196, pointer.x, pointer.y) ? true : false;
    imageCatalog.selectorB.display = deviceType === 'mobile' ? false : true;

    for (let anim in animCatalog) {
        const thisAnim = animCatalog[anim];
        // if (thisAnim.type === 'legume') {
        const parallaxOffset = Math.floor(thisAnim.parallax * viewPosY);
        thisAnim.y = renderHeight + parallaxOffset + viewPosY - thisAnim.height - thisAnim.startY;
        thisAnim.x = thisAnim.startX - viewPosX;
        // }
    }

    animateMonolith();

    chunksToAnimateInfo.forEach(([id, y]) => {
        const startY = Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - viewPosY - renderHeight;
        if (y > startY && y < startY + renderHeight) animateRune(id);
    });
}

function isInSquare(xmin, xmax, ymin, ymax, pointerX, pointerY) {
    let pos = absolutePosition(pointerX, pointerY);
    if (pos.x >= xmin && pos.x <= xmax && pos.y >= ymin && pos.y <= ymax) return true;
    return false;
}

function absolutePosition(pointerX, pointerY) {
    return {
        x: viewPosX + pointerX,
        y: renderHeight - pointerY + viewPosY,
    };
}

function addPointer(monolithData) {
    if (tool === 'smol') {
        whiten(monolithData, pointer.y, pointer.x);
    } else if (tool === 'medium') {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
            }
        }
        whiten(monolithData, pointer.y, pointer.x);
    } else if (tool === 'large') {
        for (let i = -3; i <= 3; i++) {
            for (let j = -1; j <= 1; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
                whiten(monolithData, pointer.y + i, pointer.x + j);
            }
        }
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) whiten(monolithData, pointer.y + i, pointer.x + j);
        }
    } else if (tool === 'giga') {
        for (let i = -20; i <= 20; i++) {
            for (let j = -20; j <= 20; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
            }
        }
        for (let i = -15; i <= 15; i++) {
            for (let j = -15; j <= 15; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
            }
        }
        for (let i = -8; i <= 8; i++) {
            for (let j = -5; j <= 5; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
                whiten(monolithData, pointer.y + i, pointer.x + j);
            }
        }
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) whiten(monolithData, pointer.y + i, pointer.x + j);
        }
        whiten(monolithData, pointer.y, pointer.x);
    }
    return monolithData;
}

function whiten(monolithData, y, x) {
    if (x < 0 || x >= renderWidth || y < 0 || y >= renderHeight) return;
    const monolithPos = convertToMonolithPos({ x: x, y: y });
    if (!monolithPos) return; // If not on the monolith

    const posOnMonolith = (monolithPos.y * Const.MONOLITH_COLUMNS + monolithPos.x) * 4;
    if (monolithIndexes[posOnMonolith] > 0) return; // If not editable return

    monolithData[posOnMonolith] += (255 - monolithData[posOnMonolith]) / 3;
    monolithData[posOnMonolith + 1] += (255 - monolithData[posOnMonolith + 1]) / 3;
    monolithData[posOnMonolith + 2] += (255 - monolithData[posOnMonolith + 2]) / 3;
}

export function displayShareScreen(nb) {
    imageCatalog.share.display = true;
    chunkNumber = nb;
}

export function openLink(type) {
    if (type === 'opensea') {
        window.open('https://testnets.opensea.io/assets/' + getContractAddress() + '/' + chunkNumber, '_blank');
    } else if (type === 'twitter') {
        window.open(
            'https://twitter.com/intent/tweet?text=My%20rune%20%3A&url=moonolith.io/rune=' + chunkNumber,
            '_blank'
        );
    }
}

export function monolithGoUpDuringIntro() {
    // grows monolith
    setTimeout(() => {
        for (let rowAdded = 0; rowAdded < Const.MONOLITH_LINES; rowAdded++) {
            let scalingValue = 1000 * Math.log(rowAdded);
            setTimeout(() => {
                monolithDisplayHeightIntro++;
            }, scalingValue);
        }
        shake(Const.MONOLITH_LINES);
    }, 1000);
}

export function shake(newRows) {
    toggleRumble();
    console.log('shake');
    //shake landscapes
    const shakeLandscape = setInterval(() => {
        for (let layer in imageCatalog) {
            const thisLayer = imageCatalog[layer];
            if (thisLayer.type === 'landscape' && layer !== 'plan2') {
                let offset = Math.floor(Math.random() * 3);
                let direction = Math.floor(Math.random() * 2) * 2 - 1; //-1 or 1
                switch (offset) {
                    case 0:
                        thisLayer.startX = -2 + direction;
                        break;
                    case 1:
                    case 2:
                        thisLayer.startX = -2;
                        break;
                }
            }
        }
    }, 60);

    const shakeViewPos = setInterval(() => {
        changeViewPos(Math.floor(Math.random() * 3) - 1, Math.floor(Math.random() * 3) - 1);
    }, 20);

    //clear landscape shake
    setTimeout(() => {
        clearInterval(shakeLandscape);
        clearInterval(shakeViewPos);
        for (let layer in imageCatalog) {
            const thisLayer = imageCatalog[layer];
            if (thisLayer.type === 'landscape') {
                thisLayer.startX = -2;
            }
        }
        toggleRumble();
    }, 2000 + 1000 * Math.log(newRows));
}
