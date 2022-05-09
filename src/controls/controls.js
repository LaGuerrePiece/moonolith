//prettier-ignore
import { scaleFactor, viewPosX, viewPosY, changeViewPos, increaseZoom, decreaseZoom, toggleZoom} from '../display/view';
import { renderWidth, renderHeight, pixelSize } from '../main';
import { canvas } from '../display/displayLoop';
import { GUICatalog, updatePalette } from '../display/GUI';
import Const from '../constants';
import { mobileEventListener } from './mobileControls';
import { openLink } from '../utils/web3';
import { saveToEthernity, importImage } from '../utils/imageManager';
import { convertToMonolithPos, mousePosInGrid } from '../utils/conversions';
import { toggleMusic, playSound, toggleMute } from '../assets/sounds';
import { eraseAllPixel, increaseMonolithHeight } from '../monolith/monolith';
import { undo, redo } from '../monolith/undoStack';
import { brushSwitch, startUsingTool, colorSwitch, selectBrush } from '../monolith/tools';

export const deviceType = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)
    ? 'tablet'
    : /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          navigator.userAgent
      )
    ? 'mobile'
    : 'desktop';

//prettier-ignore
document.addEventListener('contextmenu', (e) => { e.preventDefault(); }, false);

export let pointer = { x: 0, y: 0 };

//prettier-ignore
export function unlockControls() {
    document.addEventListener('keydown', (e) => { keyManager(e) });
    document.addEventListener('mousemove', (e) => { pointer = mousePosInGrid({ x: e.x, y: e.y });});
    if (deviceType === 'mobile') mobileEventListener();
    else canvas.onmousedown = clickManager;
}

export function unlockScroll() {
    document.addEventListener('wheel', (e) => {scrollManager(e);}, {passive : false});
}

//prettier-ignore
function keyManager(e){
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {undo(); return}
    if ((e.metaKey || e.ctrlKey ) && (e.key === 'Z' || e.key === 'y')) {redo(); return}
    if (e.key === 'x') eraseAllPixel();
    if (e.key === 'c') console.log('Total H', Const.COLUMNS, 'Total W', Const.LINES, 'render W', renderWidth, 'render H', renderHeight, 'viewPosX', viewPosX, 'viewPosY', viewPosY, '\nE : Brush Switch \nX : Erase All \nI : Import \nL : Mute \nK : Pause music \nP : Grow Monolith \nR : GIGA tool \nT : Go to top');
    if (e.key === 'e') brushSwitch();
    if (e.key === 'i') importImage();
    if (e.key === 'r') { selectBrush('giga'); playSound('kick', 50); }
    if (e.key === 'k') toggleMusic();
    if (e.key === 'l') toggleMute();
    if (e.key === 'p') { increaseMonolithHeight(1100); }
    if (e.key === 't') { changeViewPos(0, 999999); }

    switch (e.code || e.key || e.keyCode) {
        case 'KeyW':
        case 'ArrowUp':
        case 'Numpad8':
        case 38: // keyCode for arrow up
        changeViewPos(0, 6)
        break;

        case 'KeyA':
        case 'ArrowLeft':
        case 'Numpad4':
        case 37: // keyCode for arrow left
        changeViewPos(-6, 0)
        break;

        case 'KeyS':
        case 'ArrowDown':
        case 'Numpad5':
        case 'Numpad2':
        case 40: // keyCode for arrow down
        changeViewPos(0, -6)
        break;

        case 'KeyD':
        case 'ArrowRight':
        case 'Numpad6':
        case 39: // keyCode for arrow right
        changeViewPos(6, 0)
        break;

        case 'KeyZ':
        toggleZoom();
        playSound('click6');
        break;
      }
}

export function clickManager(e) {
    let mousePos = mousePosInGrid(e);
    console.log('Click', mousePos);

    if (
        mousePos.x >= GUICatalog.palette.x &&
        mousePos.x < GUICatalog.palette.x + GUICatalog.palette.img.width &&
        mousePos.y >= GUICatalog.palette.y &&
        mousePos.y < GUICatalog.palette.y + GUICatalog.palette.img.height
    ) {
        console.log('Clicked on the GUI');

        let offsetX, spaceX, row1Y, row2Y, bigY, bigX1, bigX2, smolRadius, bigRadius;

        if (scaleFactor == 1) {
            offsetX = 13;
            spaceX = 15;
            row1Y = 5;
            row2Y = 19;
            bigY = 14;
            bigX1 = 8;
            bigX2 = 153;
            smolRadius = 6;
            bigRadius = 11;
        } else if (scaleFactor == 3) {
            offsetX = 8;
            spaceX = 8;
            row1Y = 4;
            row2Y = 9;
            bigY = 7;
            bigX1 = 4;
            bigX2 = 84;
            smolRadius = 4;
            bigRadius = 6;
        } else if (scaleFactor == 6) {
            offsetX = 5;
            spaceX = 5;
            row1Y = 2;
            row2Y = 5;
            bigY = 4;
            bigX1 = 2;
            bigX2 = 51;
            smolRadius = 2;
            bigRadius = 4;
        }

        if (GUICircle(mousePos, bigY, bigX1, bigRadius)) saveToEthernity();
        else if (GUICircle(mousePos, bigY, bigX2, bigRadius)) brushSwitch();
        else if (GUICircle(mousePos, row1Y, offsetX + spaceX * 1, smolRadius)) colorSwitch(e, 1);
        else if (GUICircle(mousePos, row1Y, offsetX + spaceX * 2, smolRadius)) colorSwitch(e, 2);
        else if (GUICircle(mousePos, row1Y, offsetX + spaceX * 3, smolRadius)) colorSwitch(e, 3);
        else if (GUICircle(mousePos, row1Y, offsetX + spaceX * 4, smolRadius)) colorSwitch(e, 4);
        else if (GUICircle(mousePos, row1Y, offsetX + spaceX * 5, smolRadius)) colorSwitch(e, 5);
        else if (GUICircle(mousePos, row1Y, offsetX + spaceX * 6, smolRadius)) colorSwitch(e, 6);
        else if (GUICircle(mousePos, row1Y, offsetX + spaceX * 7, smolRadius)) colorSwitch(e, 7);
        else if (GUICircle(mousePos, row1Y, offsetX + spaceX * 8, smolRadius)) colorSwitch(e, 8);
        else if (GUICircle(mousePos, row2Y, offsetX + spaceX * 1, smolRadius)) colorSwitch(e, 9);
        else if (GUICircle(mousePos, row2Y, offsetX + spaceX * 2, smolRadius)) colorSwitch(e, 10);
        else if (GUICircle(mousePos, row2Y, offsetX + spaceX * 3, smolRadius)) colorSwitch(e, 11);
        else if (GUICircle(mousePos, row2Y, offsetX + spaceX * 4, smolRadius)) colorSwitch(e, 12);
        else if (GUICircle(mousePos, row2Y, offsetX + spaceX * 5, smolRadius)) colorSwitch(e, 13);
        else if (GUICircle(mousePos, row2Y, offsetX + spaceX * 6, smolRadius)) colorSwitch(e, 14);
        else if (GUICircle(mousePos, row2Y, offsetX + spaceX * 7, smolRadius)) colorSwitch(e, 15);
        else if (GUICircle(mousePos, row2Y, offsetX + spaceX * 8, smolRadius)) colorSwitch(e, 16);
    } else if (GUICatalog.share.display) {
        if (
            !(
                mousePos.x > GUICatalog.share.x &&
                mousePos.x < GUICatalog.share.x + GUICatalog.share.img.width &&
                mousePos.y > GUICatalog.share.y &&
                mousePos.y < GUICatalog.share.y + GUICatalog.share.img.height
            )
        ) {
            GUICatalog.share.display = false;
        } else {
            // console.log('img', GUICatalog.share.x, GUICatalog.share.y);
            if (
                mousePos.x > GUICatalog.share.x + 15 &&
                mousePos.x < GUICatalog.share.x + 115 &&
                mousePos.y > GUICatalog.share.y + 30 &&
                mousePos.y < GUICatalog.share.y + GUICatalog.share.img.height - 25
            ) {
                console.log('Clicked on OpenSea');
                openLink('opensea');
            } else if (
                mousePos.x > GUICatalog.share.x + 122 &&
                mousePos.x < GUICatalog.share.x + 215 &&
                mousePos.y > GUICatalog.share.y + 30 &&
                mousePos.y < GUICatalog.share.y + GUICatalog.share.img.height - 27
            ) {
                console.log('Clicked on Share');
                openLink('twitter');
            }
        }
    } else if (convertToMonolithPos(mousePos)) {
        // clicked on monolith
        console.log('monolithPos', mousePos);
        startUsingTool(e, mousePos);
    }
}

function GUICircle(mousePos, y, x, radius) {
    // Coordinates of the center are input in the GUI
    y += GUICatalog.palette.y;
    x += GUICatalog.palette.x;
    return Math.ceil(mousePos.x - x) ** 2 + Math.ceil(mousePos.y - y) ** 2 <= radius ** 2;
}

let scrollInformation = {
    lastScrollDown: Date.now(),
    lastScrollUp: Date.now(),
    consecutiveDown: 0,
    consecutiveUp: 0,
    upInertia: 0,
    downInertia: 0,
    lastDirUp: false,
    inertiaEvents: [],
};

function scrollManager(e) {
    if (e.ctrlKey == true || e.metaKey == true) {
        e.preventDefault();
        if (e.deltaY < 0) increaseZoom();
        else if (e.deltaY > 0) decreaseZoom();
    }
    let now = Date.now();
    if (e.deltaY > 0) {
        if (now - scrollInformation.lastScrollDown < 500) {
            scrollInformation.consecutiveDown++;
            scrollInformation.downInertia++;
        } else {
            scrollInformation.consecutiveDown = 0;
        }
        scrollInformation.lastScrollDown = now;
        changeViewPos(0, -6 - parseInt(scrollInformation.consecutiveDown / 5) * 2);
        if (scrollInformation.lastDirUp) {
            clearInertia();
            scrollInformation.lastDirUp = false;
        }
    } else {
        if (now - scrollInformation.lastScrollUp < 500) {
            scrollInformation.consecutiveUp++;
            scrollInformation.upInertia++;
        } else {
            scrollInformation.consecutiveUp = 0;
        }
        scrollInformation.lastScrollUp = now;
        changeViewPos(0, 6 + parseInt(scrollInformation.consecutiveUp / 5) * 2);
        if (!scrollInformation.lastDirUp) {
            clearInertia();
            scrollInformation.lastDirUp = true;
        }
    }
    scrollInformation.inertiaEvents.push(
        setTimeout(function () {
            inertia(scrollInformation.consecutiveUp, scrollInformation.consecutiveDown);
        }, 10)
    );
    if (viewPosY == -30 || viewPosY == Const.LINES - renderHeight) {
        clearInertia();
    }
}

function clearInertia() {
    scrollInformation.inertiaEvents.forEach((event) => {
        clearTimeout(event);
    });
}

function inertia(consecutiveUp, consecutiveDown) {
    if (
        scrollInformation.upInertia > 6 &&
        consecutiveUp === scrollInformation.consecutiveUp &&
        scrollInformation.lastDirUp &&
        scrollInformation.upInertia != scrollInformation.consecutiveUp
    ) {
        for (let i = parseInt(scrollInformation.consecutiveUp); i > 0; i--) {
            setTimeout(function () {
                if (scrollInformation.lastDirUp) {
                    //console.log('Into intertia:', i);
                    changeViewPos(0, 1);
                }
            }, i * 25);
        }
        scrollInformation.upInertia = 0;
    }
    if (
        scrollInformation.downInertia > 7 &&
        consecutiveDown == scrollInformation.consecutiveDown &&
        !scrollInformation.lastDirUp
    ) {
        for (let i = parseInt(scrollInformation.consecutiveDown); i > 0; i--) {
            setTimeout(function () {
                if (!scrollInformation.lastDirUp) {
                    //console.log('Into intertia:', i);
                    changeViewPos(0, -1);
                }
            }, i * 25);
        }
        scrollInformation.downInertia = 0;
    }
}
