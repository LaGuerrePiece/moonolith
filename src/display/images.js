import { renderHeight } from './displayLoop';
import { viewPosY, viewPosX } from './view';
import { monolithDisplayHeightIntro, introState } from '../intro';
import Const from '../constants';

// prettier-ignore
export let imageCatalog = {
    plan5: { fileName: 'plan5', type: 'landscape', startX: -2, startY: 330, layer: 5, display: true },
    stratus: { fileName: 'stratus', type: 'sky', startX: 0, startY: 460, layer: 6, display: true },
    cumulus: { fileName: 'cumulus', type: 'sky', startX: 0, startY: 240, layer: 3.5, display: true },
    stars: { fileName: 'stars', type: 'sky', startX: 0, startY: 470, layer: 6, display: true },
    plan4: { fileName: 'plan4', type: 'landscape', startX: -2, startY: 300, layer: 4, display: true },
    plan3: { fileName: 'plan3', type: 'landscape', startX: -2, startY: 250, layer: 3, display: true },
    plan2C: { fileName: 'plan2C', type: 'landscape', startX: -2, startY: 230, layer: 2.5, display: true },
    plan2B: { fileName: 'plan2B', type: 'landscape', startX: -2, startY: 230, layer: 2.5, display: true },
    plan2: { fileName: 'plan2', type: 'landscape', startX: -2, startY: 190, layer: 2, display: true },
    plan1B: { fileName: 'plan1B', type: 'landscape', startX: -2, startY: 198, layer: 1.5, display: true },
    moonolithTop: { fileName: 'moonolithTop', type: 'side', startY: 0, startX: 0, layer: 1.5, display: true },
    moonolithSide: { fileName: 'moonolithSide', type: 'side', startY: 290, startX: 255, layer: 1.5, display: true },
    plan1A: { fileName: 'plan1A', type: 'landscape', startX: -2, startY: 98, layer: 1, display: true },
    plan1arbres: { fileName: 'plan1arbres', type: 'landscape', startX: 0, startY: 108, layer: 1, display: true },
    terreRetournee: { fileName: 'terreRetournee', type: 'landscape', startX: 24, startY: 157, layer: 1, display: false },
    plan0B: { fileName: 'plan0B', type: 'landscape', startX: -2, startY: 5, layer: 0.5, display: true },
    plan0: { fileName: 'plan0', type: 'landscape', startX: -2, startY: -75, layer: 0, display: true },
    planLogos: { fileName: 'planLogos', type: 'landscape', startX: -25, startY: -45, layer: -1, display: true },
    moon: { fileName: 'moon', type: 'landscape', startX: 141, startY: 161, layer: 1, display: true },
    panneauDecor: { fileName: 'panneauDecor', type: 'landscape', startX: 292, startY: 178, layer: 1, display: false },
    TibonomEmporte: { fileName: 'TibonomEmporte', type: 'TibonomEmporte', startX: 129, startY: 8, layer: 1, display: false },
};

export function updateImageCatalog() {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        if (thisImage.type === 'landscape' || thisImage.type === 'sky') {
            const parallaxOffset = Math.floor(thisImage.parallax * viewPosY);
            thisImage.y = renderHeight + parallaxOffset + viewPosY - thisImage.img.height - thisImage.startY;
            thisImage.x = thisImage.startX - viewPosX + thisImage.shakeX;
        } else if (thisImage.type === 'side') {
            thisImage.y = thisImage.startY + renderHeight + viewPosY - Const.MONOLITH_LINES - Const.MARGIN_BOTTOM - 7;
            thisImage.x = thisImage.startX + Const.MARGIN_LEFT - viewPosX;
            if (introState) thisImage.y = thisImage.y + Const.MONOLITH_LINES - monolithDisplayHeightIntro;
        } else if (thisImage.type === 'TibonomEmporte') {
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

        thisImage.parallax = Const.PARALLAX_LAYERS[thisImage.layer];
    }
    console.log('imageCatalog', imageCatalog);
}

export function drawImages(ctx, layer) {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        if (thisImage.layer !== layer) continue;
        if (thisImage.display && thisImage.loaded) ctx.drawImage(thisImage.img, thisImage.x, thisImage.y);
    }
}

let numberOfSides = 0;
export function addSideMonolith(monolithHeight) {
    let sidesHeight = numberOfSides * imageCatalog.moonolithSide.img.height;
    let sidesToAdd = (monolithHeight - sidesHeight) / imageCatalog.moonolithSide.img.height;
    if (sidesToAdd > 0) {
        for (let i = 0; i < sidesToAdd; i++) {
            imageCatalog['moonolithSide' + numberOfSides] = {
                ...imageCatalog.moonolithSide,
                startX: 255,
                startY: sidesHeight + imageCatalog.moonolithSide.img.height,
            };
            sidesHeight = sidesHeight + imageCatalog.moonolithSide.img.height;
            numberOfSides++;
        }
    }
}
