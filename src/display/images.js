import { renderHeight } from '../main';
import { viewPosY, viewPosX } from './view';
import { monolithDisplayHeightIntro, introState } from '../intro';
import Const from '../constants';

export let imageCatalog = {
    plan5: { fileName: 'plan5', type: 'landscape', startX: -2, startY: 330, layer: 5, display: true },
    plan4: { fileName: 'plan4', type: 'landscape', startX: -2, startY: 300, layer: 4, display: true },
    plan3: { fileName: 'plan3', type: 'landscape', startX: -2, startY: 250, layer: 3, display: true },
    plan2: { fileName: 'plan2', type: 'landscape', startX: -2, startY: 190, layer: 2, display: true },
    moonolithTop: { fileName: 'moonolithTop', type: 'side', startY: 0, startX: 0, display: true },
    moonolithSide: { fileName: 'moonolithSide', type: 'side', startY: 290, startX: 255, display: true },
    moonolithSide2: { fileName: 'moonolithSide', type: 'side', startY: 758, startX: 255, display: true },
    moonolithSide3: { fileName: 'moonolithSide', type: 'side', startY: 1226, startX: 255, display: true },
    plan1: { fileName: 'plan1', type: 'landscape', startX: -2, startY: 14, layer: 1, display: true },
    plan0: { fileName: 'plan0', type: 'landscape', startX: -2, startY: -75, layer: 0, display: true },
    planLogos: { fileName: 'planLogos', type: 'landscape', startX: -25, startY: -45, layer: -1, display: true },
    moon: { fileName: 'moon', type: 'landscape', startX: 150, startY: 165, layer: 1, display: true },
    topAlien: { fileName: 'topDood', type: 'topAlien', startX: 0, startY: 0, layer: 1, display: false },
};

export function updateImageCatalog() {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        if (thisImage.type === 'landscape') {
            const parallaxOffset = Math.floor(thisImage.parallax * viewPosY);
            thisImage.y = renderHeight + parallaxOffset + viewPosY - thisImage.img.height - thisImage.startY;
            thisImage.x = thisImage.startX - viewPosX + thisImage.shakeX;
            // if (thisImage.fileName === 'plan1' || thisImage.fileName === 'moon') console.log('moon', thisImage);
        } else if (thisImage.type === 'side') {
            thisImage.y = thisImage.startY + renderHeight + viewPosY - Const.MONOLITH_LINES - Const.MARGIN_BOTTOM - 7;
            thisImage.x = thisImage.startX + Const.MARGIN_LEFT - viewPosX;
            if (introState) thisImage.y = thisImage.y + Const.MONOLITH_LINES - monolithDisplayHeightIntro;
        } else if (thisImage.type === 'topAlien') {
            thisImage.y = thisImage.startY + renderHeight + viewPosY - Const.MONOLITH_LINES - Const.MARGIN_BOTTOM - 40;
            thisImage.x = thisImage.startX + Const.MARGIN_LEFT - viewPosX - 22;
            if (introState) thisImage.y = thisImage.y + Const.MONOLITH_LINES - monolithDisplayHeightIntro;
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
        const thisImage = imageCatalog[image];
        thisImage.img = new Image();
        thisImage.img.onload = () => {
            thisImage.loaded = true;
        };
        thisImage.img.src = `/images/${thisImage.fileName}.png`;
        thisImage.shakeX = 0;

        //prettier-ignore
        thisImage.parallax = Const.PARALLAX_LAYERS[thisImage.layer];
    }
    console.log('imageCatalog', imageCatalog);
}

export function drawImages(ctx, layer) {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        if (thisImage.layer !== layer) continue;
        // console.log('drawImage', thisImage, 'layer', layer);

        // if (!thisImage.loaded) console.log(`${thisImage.fileName} not loaded`);
        if (thisImage.display && thisImage.loaded) ctx.drawImage(thisImage.img, thisImage.x, thisImage.y);
    }
}
