import { renderHeight, viewPosX, viewPosY } from '../main';
import { drawMonolith } from './displayLoop';
import { monolithDisplayHeightIntro, intro } from '../intro';
import Const from '../constants';

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
    planLogos: { fileName: 'planLogos', type: 'landscape', startX: -2, startY: -300, parallax: -1.5, display: true },
    moon: { fileName: 'moon', type: 'landscape', startX: 150, startY: 165, parallax: 0, display: true },
    topAlien: { fileName: 'topDood', type: 'topAlien', startX: 0, startY: 0, parallax: 0, display: false },
};

export function updateImageCatalog() {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        if (thisImage.type === 'landscape') {
            const parallaxOffset = Math.floor(thisImage.parallax * viewPosY);
            thisImage.y = renderHeight + parallaxOffset + viewPosY - thisImage.img.height - thisImage.startY;
            thisImage.x = thisImage.startX - viewPosX;
            // if (thisImage.fileName === 'plan1' || thisImage.fileName === 'moon') console.log('moon', thisImage);
        } else if (thisImage.type === 'side') {
            thisImage.y = thisImage.startY + renderHeight + viewPosY - Const.MONOLITH_LINES - Const.MARGIN_BOTTOM - 7;
            thisImage.x = thisImage.startX + Const.MARGIN_LEFT - viewPosX;
            if (intro) thisImage.y = thisImage.y + Const.MONOLITH_LINES - monolithDisplayHeightIntro;
        } else if (thisImage.type === 'topAlien') {
            thisImage.y = thisImage.startY + renderHeight + viewPosY - Const.MONOLITH_LINES - Const.MARGIN_BOTTOM - 40;
            thisImage.x = thisImage.startX + Const.MARGIN_LEFT - viewPosX + 15;
            if (intro) thisImage.y = thisImage.y + Const.MONOLITH_LINES - monolithDisplayHeightIntro;
        }
    }
}

export function displayImage(name, endTime) {
    imageCatalog[name].display = true;
    if (endTime) {
        setTimeout(() => {
            imageCatalog[name].display = false;
        }, endTime);
    }
}

export function loadImages() {
    for (let image in imageCatalog) {
        imageCatalog[image].img = new Image();
        imageCatalog[image].img.onload = () => {
            imageCatalog[image].loaded = true;
        };
        imageCatalog[image].img.src = `/images/${imageCatalog[image].fileName}.png`;
    }
}

export function drawImages(ctx) {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        // if (!thisImage.loaded) console.log(`${thisImage.fileName} not loaded`);
        if (thisImage.display && thisImage.loaded) ctx.drawImage(thisImage.img, thisImage.x, thisImage.y);
        if (image === 'plan2') drawMonolith(ctx);
    }
}
