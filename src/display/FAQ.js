import { FAQviewPosY } from './view';
import { imageCatalog } from './images';
import { GUICatalog } from './GUI';
import { changeViewPos, zoom } from './view';
import { setPanMode } from '../controls/mobileControls';
import { deviceType } from '../controls/controls';

export let FAQ = false;
export let FAQType;

export let FAQCatalog = {
    stratus: { name: 'stratus', parallax: 0.3, startX: 0, startY: 0 },
    stars: { name: 'stars', parallax: 0.1, startX: 0, startY: 0 },
    stratus2: { name: 'stratus', parallax: 0.25, startX: 0, startY: 732 },
    stars2: { name: 'stars', parallax: 0.1, startX: 0, startY: 300 },
    FAQ: { name: 'FAQ', parallax: 0, startX: 0, startY: 0 },
};

export function displayFAQ(type) {
    zoom(1);
    FAQ = true;
    FAQType = type;
    if (deviceType === 'mobile') setPanMode(true);
    FAQCatalog.FAQ.name = type;
    changeViewPos(0, 99999);
    GUICatalog.faqButtonOpen.display = false;
}

export function drawFAQ(ctx) {
    for (let image in FAQCatalog) {
        const thisLayer = FAQCatalog[image];
        const parallaxOffset = Math.floor(thisLayer.parallax * FAQviewPosY);
        thisLayer.y = thisLayer.startY + FAQviewPosY + parallaxOffset;
        thisLayer.x = thisLayer.startX;
        if (thisLayer.name === 'FAQ') drawClouds(ctx);

        ctx.drawImage(imageCatalog[thisLayer.name].img, thisLayer.x, thisLayer.y);
    }

    ctx.drawImage(GUICatalog.faqButtonClose.img, GUICatalog.faqButtonClose.x, GUICatalog.faqButtonClose.y);
}

export function exitFAQ() {
    changeViewPos(0, 99999);
    FAQ = false;
    FAQType = undefined;
}

function drawClouds(ctx) {
    for (let image in imageCatalog) {
        const thisImage = imageCatalog[image];
        if (thisImage.type !== 'cloud') continue;
        const parallaxOffset = Math.floor(0.15 * FAQviewPosY);
        const y = thisImage.y + FAQviewPosY + parallaxOffset + 600;
        ctx.drawImage(thisImage.img, thisImage.x, y);
    }
}
