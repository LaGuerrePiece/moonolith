// Imports des fonctionnalités
import { keyManager, scrollManager, mousePosInGrid, touchManager, togglePanMode } from './models/tools';
import Const from './models/constants';
import { chunkImport, getChunk } from './utils/web3';
import { buildMonolith } from './models/monolith';
import { base64ToBuffer, prepareBufferForApi } from './utils/imageManager';
import { hammer } from 'hammerjs';
import { initDisplay } from './models/display';

export let viewPosY = 0;
export let viewPosX = 0;

export let route;
export let runeNumber;

export const windowHeight = window.innerHeight;
export const windowWidth = window.innerWidth;
export let renderWidth = Const.COLUMNS;
const pixelSize = windowWidth / renderWidth;
export let renderHeight = Math.ceil((windowHeight * renderWidth) / windowWidth);

export const deviceType = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)
    ? 'tablet'
    : /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          navigator.userAgent
      )
    ? 'mobile'
    : 'desktop';

async function initApp() {
    runeNumber = parseInt(document.URL.split('rune=')[1]);
    const OS = document.URL.split('OS=')[1];
    // Router
    route = runeNumber && OS ? 'Opensea API' : runeNumber ? 'Share specific rune' : 'normal';
    console.log('route', route);
    await chunkImport();
    buildMonolith();
    // await setInitialViewPos();
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
window.onwheel = function (e) { scrollManager(e) };

export function changeViewPos(inputX, inputY) {
    viewPosX += inputX;
    viewPosY += inputY;
    if (viewPosY + renderHeight > Const.LINES) viewPosY = Const.LINES - renderHeight;
    if (viewPosY < 0) viewPosY = 0;
    if (viewPosX < 0) viewPosX = 0;
    if (viewPosX + renderWidth > Const.COLUMNS) viewPosX = Const.COLUMNS - renderWidth;
}

let zoomState = false;
let zoomFactor = 2.5;
export function toggleZoom() {
    if (renderWidth === Const.COLUMNS) {
        zoomIn();
    } else if (renderWidth !== Const.COLUMNS) {
        zoomOut();
    }
}
function zoomIn() {
    renderWidth = Math.floor(renderWidth / zoomFactor);
    renderHeight = Math.floor((windowHeight / pixelSize + 1) / zoomFactor);
    viewPosX = Math.floor(renderWidth / 2);
    viewPosY = Math.floor(viewPosY + renderHeight / 2);
    zoomState = true;
    refreshCanvas();
}
function zoomOut() {
    renderWidth = Const.COLUMNS;
    renderHeight = Math.ceil((windowHeight * renderWidth) / windowWidth);
    changeViewPos(0, -Math.floor(renderHeight / 4));
    zoomState = false;
    refreshCanvas();
}
// function refreshCanvas() {
//     selectorUpdate();
//     myImageData = ctx.createImageData(renderWidth, renderHeight);
//     canvas.width = renderWidth;
//     canvas.height = renderHeight;
// }

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
                    console.log('changed viewPos to :', viewY);
                });
            })
            .catch((err) => {
                console.log('error : rune not found');
            });
        // Else, look for a Y in the url
    } else if (route === 'normal') {
        const providedY = parseInt(document.URL.split('y=')[1]);
        if (providedY) changeViewPos(0, providedY);
    }
}

function initApiDisplay(id) {
    getChunk(id).then((chunk) => {
        console.log('chunk', chunk);
        //console.log('base64ToBuffer', base64ToBuffer(chunk[4]));
        prepareBufferForApi(chunk[4]).then((data) => {
            let dataToDisplay = Array.from(data[0]);
            console.log(dataToDisplay);
            console.log(dataToDisplay.length, data[1], data[2]);

            console.log(dataToDisplay, data[1], data[2]);
            // Convert to Uint8ClampedArray
            dataToDisplay.forEach((pixel) => {
                if (pixel[0] == pixel[1] && pixel[2] == pixel[1] && pixel[1] == 0) {
                    pixel.push(0);
                } else {
                    pixel.push(255);
                }
            });
            dataToDisplay = dataToDisplay.flat();
            // Create canvas and put image data
            createApiDisplayPage(dataToDisplay, data[1], data[2]);
        });
    });
}
