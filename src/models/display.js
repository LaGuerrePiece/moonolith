import { renderHeight, renderWidth, viewPosX, viewPosY, deviceType, pointer } from '../main';
import Const from './constants';
import { convertToMonolithPos, monolith, monolithIndexes } from './monolith';
import { clickManager, colorNumber1, colorNumber2 } from './tools';
import { tool, Tool } from './tools';

export let imageCatalog = {
    plan5: { fileName: 'plan5', type: 'landscape', startX: 0, startY: 343, parallax: 0.9, display: true },
    plan4: { fileName: 'plan4', type: 'landscape', startX: 0, startY: 290, parallax: 0.4, display: true },
    plan3: { fileName: 'plan3', type: 'landscape', startX: 0, startY: 225, parallax: 0.3, display: true },
    plan2: { fileName: 'plan2', type: 'landscape', startX: 0, startY: 150, parallax: 0.2, display: true },
    plan1: { fileName: 'plan1', type: 'landscape', startX: 0, startY: 85, parallax: 0.1, display: true },
    // calySide3: { fileName: 'calySideRepet', type: 'side', startX: 0, startY: 742, parallax: 0, display: true },
    // calySide2: { fileName: 'calySideRepet', type: 'side', startX: 0, startY: 526, parallax: 0, display: true },
    // calySide1: { fileName: 'calySideRepet', type: 'side', startX: 0, startY: 310, parallax: 0, display: true },
    moonolithSide: { fileName: 'moonolithSide', type: 'side', startX: -149, startY: -17, parallax: 0, display: true },
    plan0: { fileName: 'plan0', type: 'landscape', startX: 0, startY: 85, parallax: 0.1, display: true },
    panneau: { fileName: 'panneau', type: 'GUI', startX: 0, startY: 0, parallax: 0, display: false },
    selector2: { fileName: 'selector2', type: 'GUI', startX: 0, startY: 0, parallax: 0, display: true },
    selector1: { fileName: 'selector1', type: 'GUI', startX: 0, startY: 0, parallax: 0, display: true },
    palette: { fileName: 'paletteHUGE', type: 'GUI', startX: 0, startY: 0, parallax: 0, display: true },
    paletteSMOL: { fileName: 'paletteSMOL', type: 'GUI', startX: 0, startY: 0, parallax: 0, display: false },
    paletteBIG: { fileName: 'paletteBIG', type: 'GUI', startX: 0, startY: 0, parallax: 0, display: false },
    paletteHUGE: { fileName: 'paletteHUGE', type: 'GUI', startX: 0, startY: 0, parallax: 0, display: false },
    paletteGIGA: { fileName: 'paletteGIGA', type: 'GUI', startX: 0, startY: 0, parallax: 0, display: false },
    palettePAN: { fileName: 'palettePAN', type: 'GUI', startX: 0, startY: 0, parallax: 0, display: false },
};

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
    requestAnimationFrame(update);

    function update() {
        updateCatalog();
        // console.log(imageCatalog);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let image in imageCatalog) {
            const thisImage = imageCatalog[image];
            // Draw layers
            if (thisImage.display) ctx.drawImage(thisImage.img, thisImage.x, thisImage.y);
            if (image === 'plan3') {
                // Draw Monolith
                const monolithDisplayHeight =
                    viewPosY < Const.MARGIN_BOTTOM ? renderHeight - Const.MARGIN_BOTTOM + viewPosY : renderHeight;
                let monolithData = ctx.createImageData(Const.MONOLITH_COLUMNS, monolithDisplayHeight);
                const a = cutMonolith(monolithDisplayHeight);
                addPointer(a);
                monolithData.data.set(a);
                ctx.putImageData(monolithData, 50, 0);
            }
        }
        requestAnimationFrame(update);
    }
}

function updateCatalog() {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        if (thisImage.type === 'landscape') {
            const parallaxOffset = Math.floor(thisImage.parallax * viewPosY);
            thisImage.y = renderHeight + parallaxOffset + viewPosY - thisImage.startY; //- thisImage.img.height,
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
            thisImage.y = 0; //A fix
            thisImage.x = Const.MONOLITH_COLUMNS + Const.MARGIN_LEFT + thisImage.startX;
        }
    }
    imageCatalog.panneau.display = isInSquare(180, 187, 14, 18, pointer.x, pointer.y) ? true : false;
    imageCatalog.selector2.display = deviceType === 'mobile' ? false : true;
}

function cutMonolith(monolithDisplayHeight) {
    const monolithStartY = Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - renderHeight - viewPosY;
    const monolithEndY = monolithStartY + monolithDisplayHeight;

    return monolith.slice(Const.MONOLITH_COLUMNS * 4 * monolithStartY, Const.MONOLITH_COLUMNS * 4 * monolithEndY);
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
}

function whiten(monolithData, y, x) {
    if (x < 0 || x >= renderWidth || y < 0 || y >= renderHeight) return;

    const monolithPos = convertToMonolithPos({ x: x, y: y });
    // If not on the monolith
    if (!monolithPos) return;
    // If not editable return
    if (monolithIndexes[(monolithPos.y * Const.MONOLITH_COLUMNS + monolithPos.x) * 4] > 0) return;

    const monolithStartY = Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - renderHeight - viewPosY;
    const monolithposition = ((monolithPos.y - monolithStartY) * Const.MONOLITH_COLUMNS + monolithPos.x) * 4;
    // If being put off the screen during the zoom return
    // const displayPos = (y * renderWidth + x) * 4;
    // if (displayPos > monolithData.length) return;

    monolithData[monolithposition] += (255 - monolithData[monolithposition]) / 3;
    monolithData[monolithposition + 1] += (255 - monolithData[monolithposition + 1]) / 3;
    monolithData[monolithposition + 2] += (255 - monolithData[monolithposition + 2]) / 3;
}
