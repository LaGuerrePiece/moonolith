import { renderHeight } from './displayLoop';
import { viewPosY, viewPosX } from './view';
import { monolithDisplayHeightIntro, introState } from '../intro';
import Const from '../constants';

// prettier-ignore
export let imageCatalog = {
    plan5: { fileName: 'plan5', type: 'landscape', startX: -2, startY: 330, layer: 5, display: true },
    stratus: { fileName: 'stratus', type: 'sky', startX: 0, startY: 460, layer: 6, display: true },
    // cumulus: { fileName: 'cumulus', type: 'sky', startX: 0, startY: 240, layer: 3.5, display: true },
    stars: { fileName: 'stars', type: 'sky', startX: 0, startY: 470, layer: 6, display: true },
    plan4: { fileName: 'plan4', type: 'landscape', startX: -2, startY: 300, layer: 4, display: true },
    plan3: { fileName: 'plan3', type: 'landscape', startX: -2, startY: 250, layer: 3, display: true },
    plan2C: { fileName: 'plan2C', type: 'landscape', startX: -2, startY: 230, layer: 2.5, display: true },
    plan2B: { fileName: 'plan2B', type: 'landscape', startX: -2, startY: 230, layer: 2.5, display: true },
    plan2: { fileName: 'plan2', type: 'landscape', startX: -2, startY: 190, layer: 2, display: true },
    plan1B: { fileName: 'plan1B', type: 'landscape', startX: -2, startY: 198, layer: 1.5, display: true },
    moonolithTop: { fileName: 'moonolithTop', type: 'side', startY: -10, startX: 0, layer: 1.5, display: true },
    moonolithSide: { fileName: 'moonolithSide', type: 'side', startY: 283, startX: 255, layer: 1.5, display: true },
    plan1A: { fileName: 'plan1A', type: 'landscape', startX: -2, startY: 98, layer: 1, display: true },
    plan1arbres: { fileName: 'plan1arbres', type: 'landscape', startX: 0, startY: 108, layer: 1, display: true },
    terreRetournee: { fileName: 'terreRetournee', type: 'landscape', startX: 24, startY: 157, layer: 1, display: false },
    plan0B: { fileName: 'plan0B', type: 'landscape', startX: -2, startY: 5, layer: 0.5, display: true },
    plan0: { fileName: 'plan0', type: 'landscape', startX: -2, startY: -75, layer: 0, display: true },
    planLogos: { fileName: 'planLogos', type: 'landscape', startX: -25, startY: -45, layer: -1, display: true },
    moon: { fileName: 'moon', type: 'landscape', startX: 141, startY: 161, layer: 1, display: true },
    panneauDecor: { fileName: 'panneauDecor', type: 'landscape', startX: 292, startY: 178, layer: 1, display: false },
    TibonomEmporte: { fileName: 'TibonomEmporte', type: 'TibonomEmporte', startX: 109, startY: -30, layer: 1, display: false },
    FAQ: { fileName: 'FAQ', type: 'FAQ', display: false },
};

export function updateImageCatalog() {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        if (thisImage.type === 'landscape' || thisImage.type === 'sky' || thisImage.type === 'cloud') {
            const parallaxOffset = Math.floor(thisImage.parallax * viewPosY);
            thisImage.y = renderHeight + parallaxOffset + viewPosY - thisImage.img.height - thisImage.startY;
            thisImage.x = thisImage.startX - viewPosX + thisImage.shakeX;
        } else if (thisImage.type === 'side') {
            thisImage.y = thisImage.startY + renderHeight + viewPosY - Const.MONOLITH_LINES - Const.MARGIN_BOTTOM;
            thisImage.x = thisImage.startX + Const.MARGIN_LEFT - viewPosX;
            if (introState) thisImage.y = thisImage.y + Const.MONOLITH_LINES - monolithDisplayHeightIntro;
        } else if (thisImage.type === 'TibonomEmporte') {
            thisImage.y = thisImage.startY + renderHeight + viewPosY - Const.MONOLITH_LINES - Const.MARGIN_BOTTOM;
            thisImage.x = thisImage.startX + Const.MARGIN_LEFT - viewPosX;
            if (introState) thisImage.y = thisImage.y + Const.MONOLITH_LINES - monolithDisplayHeightIntro;
        }
        // console.log(image, thisImage.img.height);
    }
}

export function displayImage(name) {
    imageCatalog[name].display = true;
}

export function initClouds() {
    setTimeout(() => {
        let nbClouds = Math.floor(Const.MONOLITH_LINES / 10);
        let nbDifferentAssets = 9;
        let currentAsset = 0;
        for (let i = 0; i < nbClouds; i++) {
            imageCatalog['cloud' + i] = {
                type: 'cloud',
                startX: Math.floor(Math.random() * Const.COLUMNS),
                startY: i * 65 + Math.floor(Math.random() * 100),
                shakeX: 0,
                layer: 2.5,
                parallax: Const.PARALLAX_LAYERS[2.5],
                display: true,
            };
            const thisCloud = imageCatalog['cloud' + i];
            thisCloud.img = new Image();
            thisCloud.img.onload = () => {
                thisCloud.loaded = true;
            };
            thisCloud.img.src = 'images/clouds/cloud' + currentAsset + '.png';
            translateImage(thisCloud);
            currentAsset++;
            if (currentAsset === nbDifferentAssets) currentAsset = 0;
        }
    }, 1000);
}

export function loadImages() {
    initClouds();
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        thisImage.img = new Image();
        thisImage.img.onload = () => {
            thisImage.loaded = true;
        };
        thisImage.img.src = `/images/${thisImage.fileName}.png`;
        thisImage.shakeX = 0;
        thisImage.parallax = Const.PARALLAX_LAYERS[thisImage.layer];

        if (thisImage.type === 'cloud') {
            translateImage(thisImage);
        }
    }
    console.log('imageCatalog', imageCatalog);
}

export function drawImages(ctx, layer) {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        if (thisImage.layer !== layer || !thisImage.display || !thisImage.loaded) continue;
        ctx.drawImage(thisImage.img, thisImage.x, thisImage.y);
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

function translateImage(anim) {
    let minSpeed = 1000;
    let speed = Math.floor(Math.random() * 6000) + minSpeed;
    setInterval(() => {
        if (anim.startX > Const.COLUMNS) anim.startX = anim.img.width * -3;
        anim.startX++;
    }, speed);
}
