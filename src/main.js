// Imports des fonctionnalités
import { keyManager, scrollManager, mousePosInGrid, touchManager, togglePanMode } from './models/tools';
import Const from './models/constants';
import { chunkImport, getChunk, getMetaData, setMonolithHeight } from './utils/web3';
import { buildMonolith, increaseMonolithHeight } from './models/monolith';
import { base64ToBuffer, parseAPNG, prepareBufferForApi } from './utils/imageManager';
import { hammer } from 'hammerjs';
import {
    animCatalog,
    canvas,
    initDisplay,
    monolithGoUpDuringIntro,
    launchCollisionAnim,
    launchRunAnim,
    imageCatalog,
} from './models/display';
import { toggleMusic } from './assets/sounds';

export let viewPosY = 0;
export let viewPosX = 0;
export let scaleFactor = 1;

export let runeNumber;
export let Opensea;
export let firstTime = false;
export let intro = false;

export const windowHeight = window.innerHeight;
export const windowWidth = window.innerWidth;
export let renderWidth = Const.COLUMNS;
export const pixelSize = windowWidth / renderWidth;
export let renderHeight = Math.ceil((windowHeight * renderWidth) / windowWidth);

export const deviceType = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)
    ? 'tablet'
    : /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          navigator.userAgent
      )
    ? 'mobile'
    : 'desktop';

async function initApp() {
    if (deviceType == 'mobile') mobileEventListener();

    setRoute();
    firstTime = true; // To test
    if (firstTime && !Opensea) {
        console.log('parsing first APNGs before intro...');
        await parseAPNG();
        console.log('parsing done, launching intro');
        intro = true;
        launchIntro();
    } else {
        parseAPNG();
        await chunkImport(true);
        buildMonolith();
        await setInitialViewPos();
        initDisplay();
        // lazyParseAPNG();
    }
}

initApp();

async function launchIntro() {
    console.log('changing viewPos to the sky');
    changeViewPos(0, 400); // aller dans le ciel
    initDisplay();
    console.log('launching collision anim');
    launchCollisionAnim();
    console.log('waiting 2 secs...');
    setTimeout(async () => {
        console.log('move viewPos :');
        let magrossebite = chunkImport(true);
        let mongrosbite = setMonolithHeight();
        for (let i = 400; i > 110; i--) {
            setTimeout(function () {
                changeViewPos(0, -1);
            }, i * 10);
        }
        setTimeout(() => {
            launchRunAnim(0);
        }, 4500);
        setTimeout(() => {
            launchRunAnim(1);
        }, 5800);
        setTimeout(() => {
            launchRunAnim(2);
        }, 10000);

        //animCatalog.courgette1.display = true; // lancer l' anim d'invocation
        await mongrosbite;
        buildMonolith();
        setTimeout(() => {
            monolithGoUpDuringIntro();
        }, 6500);
        await magrossebite;
        setTimeout(() => {
            console.log('intro done');
            animCatalog.panneauRainbow.display = true;
            imageCatalog.palette.display = true;
            imageCatalog.selectorA.display = true;
            imageCatalog.selectorB.display = deviceType === 'mobile' ? false : true;
            toggleMusic();
            intro = false;
        }, 15000);
    }, 5000);
    // lazyParseAPNG();
}

function mobileEventListener() {
    var hammertime = new Hammer(canvas);

    hammertime.get('pinch').set({ enable: true });
    hammertime.on('pinchend', function (e) {
        console.log('pinch', e);
        if (e.scale > 2) increaseZoom();
        else if (e.scale < 0.5) decreaseZoom();
    });

    hammertime.on('tap', function (e) {
        touchManager(e);
    });

    hammertime.on('doubletap', function (e) {
        togglePanMode();
    });

    document.addEventListener(
        'touchmove',
        (e) => {
            e.preventDefault();
            touchManager(e);
        },
        { passive: false }
    );
    document.addEventListener('touchend', (e) => {
        touchManager(e);
    });
    document.addEventListener('touchstart', (e) => {
        touchManager(e);
    });
}

//prettier-ignore
document.addEventListener('contextmenu', (e) => { e.preventDefault(); }, false);
//prettier-ignore
document.addEventListener('keydown', (e) => { keyManager(e) });
//prettier-ignore
document.addEventListener('wheel', (e) => { 
    scrollManager(e);
}, {passive : false});

export function changeViewPos(inputX, inputY) {
    viewPosX += inputX;
    viewPosY += inputY;
    // Limits :
    const lowY = Math.floor(-renderHeight / 2 + renderHeight / (scaleFactor * 2));
    const lowX = Math.floor(-renderWidth / 2 + renderWidth / (scaleFactor * 2));
    if (!intro) {
        // During intro, we can go in the sky
        if (viewPosY + renderHeight + lowY > Const.LINES) viewPosY = Const.LINES - renderHeight - lowY;
    }
    if (viewPosY < lowY) viewPosY = lowY;
    if (viewPosX < lowX) viewPosX = lowX;
    if (viewPosX + renderWidth + lowX > Const.COLUMNS) viewPosX = Const.COLUMNS - renderWidth - lowX;
}

export function increaseZoom() {
    console.log('increaseZoom');
    if (scaleFactor === 1) zoom(3);
    else if (scaleFactor === 3) zoom(6);
}

export function decreaseZoom() {
    if (scaleFactor === 6) zoom(3);
    else if (scaleFactor === 3) zoom(1);
}

export function toggleZoom() {
    if (scaleFactor === 1) zoom(3);
    else if (scaleFactor === 3) zoom(6);
    else zoom(1);
}

function zoom(factor) {
    canvas.style.transform = `scale(${factor})`;
    scaleFactor = factor;
    if (factor === 1) {
        viewPosX = 0;
        if (viewPosY + renderHeight > Const.LINES) viewPosY = Const.LINES - renderHeight;
        if (viewPosY < 0) viewPosY = 0;
    }
}

setInterval(() => {
    chunkImport(false);
}, 30000);

export let pointer = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
    pointer = mousePosInGrid({ x: e.x, y: e.y });
});

async function setInitialViewPos() {
    // If runeNumber given, change viewPos to it
    if (runeNumber) {
        await getChunk(runeNumber)
            .then((res) => {
                prepareBufferForApi(res[4]).then((data) => {
                    const viewY = Math.floor(
                        Const.MARGIN_BOTTOM +
                            Const.MONOLITH_LINES -
                            res[0].toNumber() / Const.MONOLITH_COLUMNS -
                            data[2] / 2 -
                            renderHeight / 2
                    );
                    changeViewPos(0, viewY);
                    intro = false;
                    console.log('changed viewPos to :', viewY);
                });
            })
            .catch((err) => {
                console.log('error : rune not found');
            });
        // Else, look for a Y in the url
    } else {
        const providedY = parseInt(document.URL.split('y=')[1]);
        if (providedY) {
            changeViewPos(0, providedY);
        }
    }
}

function setRoute() {
    if (!document.cookie.includes('visited=true')) {
        console.log('First time visiting');
        const d = new Date();
        d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
        let expires = 'expires=' + d.toUTCString();
        document.cookie = 'visited=true;' + ';' + expires + ';path=/';
        firstTime = true;
    }
    runeNumber = parseInt(document.URL.split('rune=')[1]);
    Opensea = document.URL.split('OS=')[1];
}
