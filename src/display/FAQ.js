import { FAQviewPosY } from './view';
import { imageCatalog } from './images';
import { GUICatalog } from './GUI';
import { changeViewPos } from './view';

export let FAQ = false;
export let FAQType;

export let FAQCatalog = {
    stratus: { name: 'stratus', parallax: 0.05, startX: 0, startY: 0 },
    stars: { name: 'stars', parallax: 0.1, startX: 0, startY: 0 },
    // cumulus: { name: 'cumulus', parallax: 0.22, startX: 0, startY: 0 },
    stratus2: { name: 'stratus', parallax: 0.05, startX: 0, startY: 732 },
    stars2: { name: 'stars', parallax: 0.1, startX: 0, startY: 300 },
    // cumulus2: { name: 'cumulus', parallax: 0.22, startX: 0, startY: 918 },
    FAQ: { name: 'FAQ', parallax: 0, startX: 0, startY: 0 },
};

export function displayFAQ(type) {
    FAQ = true;
    FAQType == type;
}

export function drawFAQ(ctx) {
    for (let image in FAQCatalog) {
        const thisLayer = FAQCatalog[image];
        const parallaxOffset = Math.floor(thisLayer.parallax * FAQviewPosY);
        thisLayer.y = thisLayer.startY + FAQviewPosY + parallaxOffset;
        thisLayer.x = thisLayer.startX;
        console.log(thisLayer.name, imageCatalog[thisLayer.name]);
        ctx.drawImage(imageCatalog[thisLayer.name].img, thisLayer.x, thisLayer.y);
    }

    ctx.drawImage(GUICatalog.quitFAQ.img, GUICatalog.quitFAQ.x, GUICatalog.quitFAQ.y);
}

export function exitFAQ() {
    changeViewPos(0, 99999);
    FAQ = false;
    FAQType = undefined;
}
