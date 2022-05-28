import { renderHeight } from './displayLoop';
import { animCatalog, launchAnim } from './animations';
import { viewPosY, viewPosX } from './view';
import { isInCircle } from '../utils/conversions';
import { monolithDisplayHeightIntro, introState } from '../intro';
import { pointer, deviceType } from '../controls/controls';
import Const from '../constants';

// prettier-ignore
export let imageCatalog = {
    plan5: { startX: -2, startY: 330, layer: 5, type: 'landscape', fileName: 'landscape/plan5', display: true },
    stratus: { startX: 0, startY: 460, layer: 6, type: 'sky', fileName: 'stratus', display: true },
    stars: { startX: 0, startY: 470, layer: 6, type: 'sky', fileName: 'stars', display: true },
    plan4: { startX: -2, startY: 300, layer: 4, type: 'landscape', fileName: 'landscape/plan4', display: true },
    plan3: { startX: -2, startY: 250, layer: 3, type: 'landscape', fileName: 'landscape/plan3', display: true },
    plan2C: { startX: -2, startY: 230, layer: 2.5, type: 'landscape', fileName: 'landscape/plan2C', display: true },
    plan2B: { startX: -2, startY: 230, layer: 2.5, type: 'landscape', fileName: 'landscape/plan2B', display: true },
    plan2: { startX: -2, startY: 190, layer: 2, type: 'landscape', fileName: 'landscape/plan2', display: true },
    titleLogo: { startX: 25, layer: 1.5, type: 'landscape', fileName: 'titleLogo', display: false },
    plan1B: { startX: -2, startY: 198, layer: 1.5, type: 'landscape', fileName: 'landscape/plan1B', display: true },
    moonolithTop: { startY: -10, startX: 0, layer: 1.5, type: 'side', fileName: 'moonolithTop', display: true },
    moonolithSide: { startY: 283, startX: 255, layer: 1.5, type: 'side', fileName: 'moonolithSide', display: true },
    plan1A: { startX: -2, startY: 48, layer: 1, type: 'landscape', fileName: 'landscape/plan1A', display: true },
    terreRetournee: { startX: 24, startY: 157, layer: 1, type: 'landscape', fileName: 'landscape/terreRetournee', display: false },
    plan0B: { startX: -2, startY: 5, layer: 0.5, type: 'landscape', fileName: 'landscape/plan0B', display: true },
    plan0: { startX: -2, startY: -75, layer: 0, type: 'landscape', fileName: 'landscape/plan0', display: true },
    planLogos: { startX: -25, startY: -45, layer: -1, type: 'landscape', fileName: 'landscape/planLogos', display: true },
    bookOnStatic: { startX: 74, startY: 29, layer: -1, type: 'landscape', fileName: 'bookOnStatic', display: false },
    discordOnStatic: { startX: 38, startY: 46, layer: -1, type: 'landscape', fileName: 'discordOnStatic', display: false },
    gitOnStatic: { startX: 41, startY: 7, layer: -1, type: 'landscape', fileName: 'gitOnStatic', display: false },
    moon: { startX: 141, startY: 161, layer: 1, type: 'landscape', fileName: 'moon', display: true },
    panneauDecor: { startX: 292, startY: 178, layer: 1, type: 'landscape', fileName: 'landscape/panneauDecor', display: false },
    TibonomEmporte: { startX: 109, startY: -30, layer: 1, type: 'TibonomEmporte', fileName: 'TibonomEmporte', display: false },
    FAQ: { type: 'FAQ', fileName: 'faq/faqTextDefault', display: false },
    faqTextMetamask: { type: 'FAQ', fileName: 'faq/faqTextMetamask', display: false },
};

// prettier-ignore
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
    }

    // Logo Animations
    if (deviceType === 'mobile') return
    
    if (isInCircle({ x: pointer.x, y: pointer.y }, 58, 116, 15, 'planLogos', 'imageCatalog')) {
        if (animCatalog.bookOff.display === false && imageCatalog.bookOnStatic.display === false) {
            launchAnim('bookOff')
        }
        imageCatalog.bookOnStatic.display = true
    } else {
        if (imageCatalog.bookOnStatic.display === true) launchAnim('bookOn')
        imageCatalog.bookOnStatic.display = false
    }

    if (isInCircle({ x: pointer.x, y: pointer.y }, 72, 72, 13, 'planLogos', 'imageCatalog')) {
        if (animCatalog.gitOff.display === false && imageCatalog.gitOnStatic.display === false) {
            launchAnim('gitOff')
        }
        imageCatalog.gitOnStatic.display = true
    } else {
        if (imageCatalog.gitOnStatic.display === true) launchAnim('gitOn')
        imageCatalog.gitOnStatic.display = false
    }

    if (isInCircle({ x: pointer.x, y: pointer.y }, 38, 74, 13, 'planLogos', 'imageCatalog')) {
        if (animCatalog.discordOff.display === false && imageCatalog.discordOnStatic.display === false) {
            launchAnim('discordOff')
        }
        imageCatalog.discordOnStatic.display = true
    } else {
        if (imageCatalog.discordOnStatic.display === true) launchAnim('discordOn')
        imageCatalog.discordOnStatic.display = false
    }
}

export function displayImage(name) {
    imageCatalog[name].display = true;
}

export function initClouds() {
    let nbClouds = Math.floor(Const.MONOLITH_LINES / 10);
    let nbDifferentAssets = 12;
    let currentAsset = 0;
    for (let i = 0; i < nbClouds; i++) {
        let type;
        if (Math.random() > 0.01) type = 'cloud' + currentAsset;
        else type = 'rare' + (currentAsset % 3);
        imageCatalog[type + '_' + i] = {
            type: 'cloud',
            startX: Math.floor(Math.random() * Const.COLUMNS),
            startY: i * 84 + Math.floor(Math.random() * 100),
            shakeX: 0,
            layer: 3.5,
            parallax: Const.PARALLAX_LAYERS[2.5],
            display: true,
        };

        const thisCloud = imageCatalog[type + '_' + i];
        thisCloud.img = new Image();
        thisCloud.img.onload = () => {
            thisCloud.loaded = true;
        };
        thisCloud.img.src = 'images/clouds/' + type + '.png';
        translateImage(thisCloud);
        currentAsset++;
        if (currentAsset === nbDifferentAssets) currentAsset = 0;
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

        if (thisImage.type === 'cloud') translateImage(thisImage);
        if (thisImage.fileName === 'titleLogo') thisImage.startY = renderHeight + thisImage.img.height;
    }
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
