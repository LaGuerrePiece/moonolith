// Imports des fonctionnalités
import { keyManager, scrollManager, mousePosInGrid, touchManager, togglePanMode } from './models/tools';
import Const from './models/constants';
import { chunkImport, getChunk, getMetaData } from './utils/web3';
import { buildMonolith, increaseMonolithHeight } from './models/monolith';
import { base64ToBuffer, parseAPNG, prepareBufferForApi } from './utils/imageManager';
import { hammer } from 'hammerjs';
import { animCatalog, canvas, initDisplay, monolithGoUpDuringIntro, clock } from './models/display';

export let viewPosY = 100;
export let viewPosX = 0;
export let scaleFactor = 1;

export let route;
export let runeNumber;
export let intro = true;
let firstTime = false;

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
    console.log(document.cookie);
    if(!document.cookie.includes("visited=true")){
        console.log("Fiest time visiting");
        const d = new Date();
        d.setTime(d.getTime() + (7*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = "visited=true;" + ";" + expires + ";path=/";
        firstTime = true;
    }
    else{
        intro = false;
    }

    runeNumber = parseInt(document.URL.split('rune=')[1]);
    const OS = document.URL.split('OS=')[1];
    // Router
    route = runeNumber && OS ? 'Opensea API' : runeNumber ? 'Share specific rune' : 'normal';
    console.log('route', route);
    parseAPNG();
    await chunkImport();
    buildMonolith();
    await setInitialViewPos();
    initDisplay();
    if (deviceType == 'mobile') mobileEventListener();
}

initApp();

function mobileEventListener() {
    var hammertime = new Hammer(canvas);

    hammertime.get('pinch').set({ enable: true });
    hammertime.on('pinch', function (e) {
        if (e.scale > 2 && !zoomState) zoomIn();
        else if (e.scale < 0.5 && zoomState) zoomOut();
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

console.log('renderHeight', renderHeight);
export function changeViewPos(inputX, inputY) {
    viewPosX += inputX;
    viewPosY += inputY;
    // Limits :
    const lowY = Math.floor(-renderHeight / 2 + renderHeight / (scaleFactor * 2));
    const lowX = Math.floor(-renderWidth / 2 + renderWidth / (scaleFactor * 2));
    if (viewPosY + renderHeight + lowY > Const.LINES) viewPosY = Const.LINES - renderHeight - lowY;
    if (viewPosY < lowY) viewPosY = lowY;
    if (viewPosX < lowX) viewPosX = lowX;
    if (viewPosX + renderWidth + lowX > Const.COLUMNS) viewPosX = Const.COLUMNS - renderWidth - lowX;
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
    chunkImport();
}, 5000);

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
                    // const viewX = Math.floor(
                    //     Const.MARGIN_RIGHT +
                    //         Const.MONOLITH_COLUMNS -
                    //         (res[0].toNumber() % Const.MONOLITH_COLUMNS) -
                    //         data[1] / 2 -
                    //         renderWidth / 2
                    // );
                    changeViewPos(0, viewY);
                    intro = false;
                    console.log('changed viewPos to :', viewY);
                });
            })
            .catch((err) => {
                console.log('error : rune not found');
            });
        // Else, look for a Y in the url
    } else if (route === 'normal') {
        const providedY = parseInt(document.URL.split('y=')[1]);
        if (providedY) {
            changeViewPos(0, providedY);
        } else {
            if(firstTime){
                launchIntro();
            }
        }
    }
}

function launchIntro() {
    // changeViewPos(0, 1500); // aller dans le ciel
    // animCatalog.courgette1.display = true; // lancer l' anim d'intro
    //TODO attendre fin d'anim
    //scroll en bas
    // for (let i = 1500; i > 250; i--) {
    //     setTimeout(function () {
    //         changeViewPos(0, -1);
    //     }, i);
    // }
    // animCatalog.courgette1.display = true; // lancer l' anim d'invocation
    // getMetaData().then((metadata) => {
    //     //sortir le monolith de la bonne taille
    //     increaseMonolithHeight(Math.floor(192 + (metadata.nbKlon * metadata.threshold) / (1000000 * Const.COLUMNS)));
    // });
    monolithGoUpDuringIntro();
    setTimeout(() => {
        animCatalog.panneauRainbow.display = true;
        intro = false;
    }, 10000);
}
