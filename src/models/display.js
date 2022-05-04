import { courgette64 } from '../assets/base64';
import { renderHeight, renderWidth, viewPosX, viewPosY, deviceType, pointer } from '../main';
import Const from './constants';
import { convertToMonolithPos, monolith, monolithIndexes } from './monolith';
import { clickManager, colorNumber1, colorNumber2 } from './tools';
import { tool, Tool } from './tools';

var clock = 0;
setInterval(() => {
    clock += 100;
}, 100);

export let imageCatalog = {
    plan5: { fileName: 'plan5', type: 'landscape', startX: -2, startY: 250, parallax: 0.9, display: true },
    plan4: { fileName: 'plan4', type: 'landscape', startX: -2, startY: 200, parallax: 0.4, display: true },
    plan3: { fileName: 'plan3', type: 'landscape', startX: -2, startY: 150, parallax: 0.3, display: true },
    plan2: { fileName: 'plan2', type: 'landscape', startX: -2, startY: 100, parallax: 0.2, display: true },
    // calySide3: { fileName: 'calySideRepet', type: 'side', startX: 0, startY: 742, parallax: 0, display: true },
    // calySide2: { fileName: 'calySideRepet', type: 'side', startX: 0, startY: 526, parallax: 0, display: true },
    // calySide1: { fileName: 'calySideRepet', type: 'side', startX: 0, startY: 310, parallax: 0, display: true },
    moonolithSide: { fileName: 'moonolithSide', type: 'side', display: true },
    plan1: { fileName: 'plan1', type: 'landscape', startX: -2, startY: 50, parallax: 0.1, display: true },
    plan0: { fileName: 'plan0', type: 'landscape', startX: -2, startY: 0, parallax: 0.1, display: true },
    panneau: { fileName: 'panneau', type: 'GUI', display: false },
    selector2: { fileName: 'selector2', type: 'GUI', display: true },
    selector1: { fileName: 'selector1', type: 'GUI', display: true },
    palette: { fileName: 'paletteHUGE', type: 'GUI', display: true },
    paletteSMOL: { fileName: 'paletteSMOL', type: 'GUI', display: false },
    paletteBIG: { fileName: 'paletteBIG', type: 'GUI', display: false },
    paletteHUGE: { fileName: 'paletteHUGE', type: 'GUI', display: false },
    paletteGIGA: { fileName: 'paletteGIGA', type: 'GUI', display: false },
    palettePAN: { fileName: 'palettePAN', type: 'GUI', display: false },
};

//prettier-ignore
export let animCatalog = {
    courgette0: { fileName: 'courgette', type: 'legume', x: 31 * 0, y: 0, display: true, loop: true, base64: courgette64 },
    // courgette1: { fileName: 'courgette', type: 'legume', x: 31 * 1, y: 0, display: true, loop: true, base64: courgette64 },
    // courgette2: { fileName: 'courgette', type: 'legume', x: 31 * 2, y: 0, display: true, loop: true, base64: courgette64 },
    // courgette3: { fileName: 'courgette', type: 'legume', x: 31 * 3, y: 0, display: true, loop: true, base64: courgette64 },
    // courgette4: { fileName: 'courgette', type: 'legume', x: 31 * 4, y: 0, display: true, loop: true, base64: courgette64 },
    // courgette5: { fileName: 'courgette', type: 'legume', x: 31 * 5, y: 0, display: true, loop: true, base64: courgette64 },
    // courgette6: { fileName: 'courgette', type: 'legume', x: 31 * 6, y: 0, display: true, loop: true, base64: courgette64 },
    // courgette7: { fileName: 'courgette', type: 'legume', x: 31 * 7, y: 0, display: true, loop: true, base64: courgette64 },
    // courgette8: { fileName: 'courgette', type: 'legume', x: 31 * 8, y: 0, display: true, loop: true, base64: courgette64 },
    // courgette9: { fileName: 'courgette', type: 'legume', x: 31 * 9, y: 0, display: true, loop: true, base64: courgette64 },
    // courgetteA: { fileName: 'courgette', type: 'legume', x: 31 * 10, y: 0, display: true, loop: true, base64: courgette64 },
    // courgetteB: { fileName: 'courgette', type: 'legume', x: 31 * 11, y: 0, display: true, loop: true, base64: courgette64 },
    // courgetteC: { fileName: 'courgette', type: 'legume', x: 31 * 12, y: 0, display: true, loop: true, base64: courgette64 },
    
    // courgette10: { fileName: 'courgette', type: 'legume', x: 31 * 0, y: 35, display: true, loop: true, base64: courgette64 },
    // courgette11: { fileName: 'courgette', type: 'legume', x: 31 * 1, y: 35, display: true, loop: true, base64: courgette64 },
    // courgette12: { fileName: 'courgette', type: 'legume', x: 31 * 2, y: 35, display: true, loop: true, base64: courgette64 },
    // courgette13: { fileName: 'courgette', type: 'legume', x: 31 * 3, y: 35, display: true, loop: true, base64: courgette64 },
    // courgette14: { fileName: 'courgette', type: 'legume', x: 31 * 4, y: 35, display: true, loop: true, base64: courgette64 },
    // courgette15: { fileName: 'courgette', type: 'legume', x: 31 * 5, y: 35, display: true, loop: true, base64: courgette64 },
    // courgette16: { fileName: 'courgette', type: 'legume', x: 31 * 6, y: 35, display: true, loop: true, base64: courgette64 },
    // courgette17: { fileName: 'courgette', type: 'legume', x: 31 * 7, y: 35, display: true, loop: true, base64: courgette64 },
    // courgette18: { fileName: 'courgette', type: 'legume', x: 31 * 8, y: 35, display: true, loop: true, base64: courgette64 },
    // courgette19: { fileName: 'courgette', type: 'legume', x: 31 * 9, y: 35, display: true, loop: true, base64: courgette64 },
    // courgette1A: { fileName: 'courgette', type: 'legume', x: 31 * 10, y:35, display: true, loop: true, base64: courgette64 },
    // courgette1B: { fileName: 'courgette', type: 'legume', x: 31 * 11, y:35, display: true, loop: true, base64: courgette64 },
    // courgette1C: { fileName: 'courgette', type: 'legume', x: 31 * 12, y:35, display: true, loop: true, base64: courgette64 },

    // courgette20: { fileName: 'courgette', type: 'legume', x: 31 * 0, y: 70, display: true, loop: true, base64: courgette64 },
    // courgette21: { fileName: 'courgette', type: 'legume', x: 31 * 1, y: 70, display: true, loop: true, base64: courgette64 },
    // courgette22: { fileName: 'courgette', type: 'legume', x: 31 * 2, y: 70, display: true, loop: true, base64: courgette64 },
    // courgette23: { fileName: 'courgette', type: 'legume', x: 31 * 3, y: 70, display: true, loop: true, base64: courgette64 },
    // courgette24: { fileName: 'courgette', type: 'legume', x: 31 * 4, y: 70, display: true, loop: true, base64: courgette64 },
    // courgette25: { fileName: 'courgette', type: 'legume', x: 31 * 5, y: 70, display: true, loop: true, base64: courgette64 },
    // courgette26: { fileName: 'courgette', type: 'legume', x: 31 * 6, y: 70, display: true, loop: true, base64: courgette64 },
    // courgette27: { fileName: 'courgette', type: 'legume', x: 31 * 7, y: 70, display: true, loop: true, base64: courgette64 },
    // courgette28: { fileName: 'courgette', type: 'legume', x: 31 * 8, y: 70, display: true, loop: true, base64: courgette64 },
    // courgette29: { fileName: 'courgette', type: 'legume', x: 31 * 9, y: 70, display: true, loop: true, base64: courgette64 },
    // courgette2A: { fileName: 'courgette', type: 'legume', x: 31 * 10, y:70, display: true, loop: true, base64: courgette64 },
    // courgette2B: { fileName: 'courgette', type: 'legume', x: 31 * 11, y:70, display: true, loop: true, base64: courgette64 },
    // courgette2C: { fileName: 'courgette', type: 'legume', x: 31 * 12, y:70, display: true, loop: true, base64: courgette64 },

    // courgette30: { fileName: 'courgette', type: 'legume', x: 31 * 0, y: 105, display: true, loop: true, base64: courgette64 },
    // courgette31: { fileName: 'courgette', type: 'legume', x: 31 * 1, y: 105, display: true, loop: true, base64: courgette64 },
    // courgette32: { fileName: 'courgette', type: 'legume', x: 31 * 2, y: 105, display: true, loop: true, base64: courgette64 },
    // courgette33: { fileName: 'courgette', type: 'legume', x: 31 * 3, y: 105, display: true, loop: true, base64: courgette64 },
    // courgette34: { fileName: 'courgette', type: 'legume', x: 31 * 4, y: 105, display: true, loop: true, base64: courgette64 },
    // courgette35: { fileName: 'courgette', type: 'legume', x: 31 * 5, y: 105, display: true, loop: true, base64: courgette64 },
    // courgette36: { fileName: 'courgette', type: 'legume', x: 31 * 6, y: 105, display: true, loop: true, base64: courgette64 },
    // courgette37: { fileName: 'courgette', type: 'legume', x: 31 * 7, y: 105, display: true, loop: true, base64: courgette64 },
    // courgette38: { fileName: 'courgette', type: 'legume', x: 31 * 8, y: 105, display: true, loop: true, base64: courgette64 },
    // courgette39: { fileName: 'courgette', type: 'legume', x: 31 * 9, y: 105, display: true, loop: true, base64: courgette64 },
    // courgette3A: { fileName: 'courgette', type: 'legume', x: 31 * 10, y:105, display: true, loop: true, base64: courgette64 },
    // courgette3B: { fileName: 'courgette', type: 'legume', x: 31 * 11, y:105, display: true, loop: true, base64: courgette64 },
    // courgette3C: { fileName: 'courgette', type: 'legume', x: 31 * 12, y:105, display: true, loop: true, base64: courgette64 },
};

function frameInClock(anim) {
    // console.log('anim', anim);
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
    for (let anim in animCatalog) {
        animCatalog[anim].canvas = new OffscreenCanvas(animCatalog[anim].width, animCatalog[anim].height);
    }
    requestAnimationFrame(update);

    function update() {
        updateCatalog();
        // console.log(imageCatalog);

        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(196, 130, 127)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let image in imageCatalog) {
            const thisImage = imageCatalog[image];
            if (thisImage.display) ctx.drawImage(thisImage.img, thisImage.x, thisImage.y);
            if (image === 'plan2') drawMonolith(ctx);
        }
        for (let anim in animCatalog) {
            const thisAnim = animCatalog[anim];
            if (thisAnim.display) drawAnim(thisAnim.frames[frameInClock(thisAnim)], anim, ctx);
            // console.log('frameInClock(thisAnim)', frameInClock(thisAnim));
        }
        requestAnimationFrame(update);
    }
}

function drawAnim(frame, name, ctx) {
    let ctxo = animCatalog[name].canvas.getContext('2d');
    let frameData = ctxo.createImageData(animCatalog[name].width, animCatalog[name].height);
    frameData.data.set(frame);
    ctxo.putImageData(frameData, 0, 0);
    // console.log('o', o);
    ctx.drawImage(animCatalog[name].canvas, animCatalog[name].x, animCatalog[name].y);
}

function drawMonolith(ctx) {
    const monolithDisplayHeight =
        renderHeight -
        Math.max(Const.MARGIN_BOTTOM - viewPosY, 0) -
        Math.max(Const.MARGIN_TOP - (Const.LINES - viewPosY - renderHeight), 0);
    let monolithData = ctx.createImageData(Const.MONOLITH_COLUMNS, monolithDisplayHeight);
    const a = addPointer(monolith.slice());
    monolithData.data.set(cutMonolith(a, monolithDisplayHeight));
    ctx.putImageData(
        monolithData,
        Const.MARGIN_LEFT,
        Math.max(Const.MARGIN_TOP - (Const.LINES - viewPosY - renderHeight), 0)
    );
}

function cutMonolith(mono, monolithDisplayHeight) {
    const startYCoordinate = Math.max(Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - renderHeight - viewPosY, 0);
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
        } else if (image === 'palette') {
            thisImage.y = Math.floor((renderHeight - imageCatalog.palette.img.height) / Const.GUI_RELATIVE_Y);
            thisImage.x = Math.floor((renderWidth - imageCatalog.palette.img.width) / Const.GUI_RELATIVE_X);
        } else if (image === 'panneau') {
            thisImage.y = Math.floor(renderHeight + viewPosY - imageCatalog.panneau.img.height - 50);
            thisImage.x = Math.floor((Const.COLUMNS - imageCatalog.panneau.img.width) / 2);
        } else if (image === 'selector1') {
            const offset = 8;
            thisImage.y = imageCatalog.palette.y - 1 + Math.floor(colorNumber1 / 9) * 8;
            thisImage.x = imageCatalog.palette.x + offset + colorNumber1 * 8 - Math.floor(colorNumber1 / 9) * 64;
        } else if (image === 'selector2') {
            const offset = 8;
            thisImage.y = imageCatalog.palette.y - 1 + Math.floor(colorNumber2 / 9) * 8;
            thisImage.x = imageCatalog.palette.x + offset + colorNumber2 * 8 - Math.floor(colorNumber2 / 9) * 64;
        } else if (thisImage.type === 'side') {
            thisImage.y = renderHeight + viewPosY - Const.MONOLITH_LINES - Const.MARGIN_BOTTOM - 7;
            thisImage.x = Const.MARGIN_LEFT;
        }
    }
    imageCatalog.panneau.display = isInSquare(180, 187, 14, 18, pointer.x, pointer.y) ? true : false;
    imageCatalog.selector2.display = deviceType === 'mobile' ? false : true;
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
    if (tool === Tool.SMOL) {
        whiten(monolithData, pointer.y, pointer.x);
    } else if (tool === Tool.BIG) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
            }
        }
        whiten(monolithData, pointer.y, pointer.x);
    } else if (tool === Tool.HUGE) {
        for (let i = -3; i <= 3; i++) {
            for (let j = -1; j <= 1; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
                whiten(monolithData, pointer.y + i, pointer.x + j);
            }
        }
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) whiten(monolithData, pointer.y + i, pointer.x + j);
        }
    } else if (tool === Tool.GIGA) {
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
    // If not on the monolith
    if (!monolithPos) return;
    // If not editable return
    const posOnMonolith = (monolithPos.y * Const.MONOLITH_COLUMNS + monolithPos.x) * 4;
    if (monolithIndexes[posOnMonolith] > 0) return;

    // const monolithStartY = Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - renderHeight - viewPosY;
    // const monolithposition = ((monolithPos.y - monolithStartY) * Const.MONOLITH_COLUMNS + monolithPos.x) * 4;
    // If being put off the screen during the zoom return
    // const displayPos = (y * renderWidth + x) * 4;
    // if (displayPos > monolithData.length) return;

    monolithData[posOnMonolith] += (255 - monolithData[posOnMonolith]) / 3;
    monolithData[posOnMonolith + 1] += (255 - monolithData[posOnMonolith + 1]) / 3;
    monolithData[posOnMonolith + 2] += (255 - monolithData[posOnMonolith + 2]) / 3;
}
