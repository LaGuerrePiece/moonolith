//prettier-ignore
import { renderWidth, renderHeight, changeViewPos, viewPosX, viewPosY, toggleZoom, pixelSize, scaleFactor, increaseZoom, decreaseZoom} from '../main';
import { toggleMusic, playSound, toggleMute } from '../assets/sounds';
import { drawPixel, getColor, eraseAllPixel, convertToMonolithPos, increaseMonolithHeight } from './monolith';
import { closeCurrentEvent, undo, redo } from './undoStack';
import { imageCatalog, canvas } from './display';
import { moveDrawing, bufferOnMonolith, saveToEthernity } from '../utils/imageManager';
import { paletteCatalog } from '../utils/paletteCatalog';
import Const from './constants';
import { openLink } from './display';

export let tool = 'giga';
let colorPicked1 = Const.RGB16;
let colorPicked2 = Const.DEFAULT_COLOR;
export let colorNumber1 = 1;
export let colorNumber2 = 16;

let button;

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

//prettier-ignore
export function keyManager(e){
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {undo(); return}
    if ((e.metaKey || e.ctrlKey ) && (e.key === 'Z' || e.key === 'y')) {redo(); return}
    if (e.key === 'x') eraseAllPixel();
    if (e.key === 'o') changeViewPos(0, 1)
    if (e.key === 'c') console.log('Total H', Const.COLUMNS, 'Total W', Const.LINES, 'render W', renderWidth, 'render H', renderHeight, 'viewPosX', viewPosX, 'viewPosY', viewPosY, '\nE : Brush Switch \nX : Erase All \nI : Import \nL : Mute \nK : Pause music \nP : Grow Monolith \nR : GIGA tool \nT : Go to top');
    if (e.key === 'm') { moveDrawing(50, 400) }
    if (e.key === 'e') brushSwitch();
    if (e.key === 'i') importImage();
    if (e.key === 'r') { tool = 'giga'; playSound('kick'); paletteUpdate(); }
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
        paletteUpdate();
        playSound('click6');
        break;
      }
}

var prevTouchY = null;
var prevTouchX = null;
var panMode = false;

export function togglePanMode() {
    panMode = !panMode;
    console.log('Pan mode', panMode);
}
export function touchManager(e) {
    if (e.type == 'tap') {
        e = {
            x: Math.floor(e.center.x),
            y: Math.floor(e.center.y),
            type: 'touch',
            button: 0,
        };
        clickManager(e);
    } else{
        //console.log(e);
        if(e.changedTouches[0].pageX < Const.MARGIN_LEFT || e.changedTouches[0].pageX > 370 - Const.MARGIN_RIGHT ){
            touchPan(e);
        }else if (e.touches.length == 1 && e.type == "touchmove" && e.timeStamp > 3000){
            console.log(e);
            touchDraw(e);
        }
    }
    

    //  else if (panMode) {
    //     touchPan(e);
    //     imageCatalog.palette.img = paletteCatalog.palettePAN.img;
    // } else if (!panMode) {
    //     touchDraw(e);
    //     paletteUpdate();
    // }

    function touchDraw(e) {
        e = {
            x: Math.floor(e.changedTouches[0].clientX),
            y: Math.floor(e.changedTouches[0].clientY),
            type: 'touch',
            button: 0,
        };
        startUsingTool(e);
    }

    function touchPan(e) {
        if (e.type === 'touchstart') {
            prevTouchY = e.touches[0].clientY;
            prevTouchX = e.touches[0].clientX;
        } else if (e.type === 'touchmove') {
            const touch = e.touches[0];
            let deltaY = e.changedTouches[0].clientY - e.touches[0].clientY;
            const changedY = touch.clientY - prevTouchY;
            const changedX = touch.clientX - prevTouchX;
            changeViewPos(-Math.floor(changedX / 2), Math.floor(changedY / 2));
            prevTouchY = Math.floor(e.changedTouches[0].clientY);
            prevTouchX = Math.floor(e.changedTouches[0].clientX);
        } else if (e.type === 'touchend') {
            prevTouchY = null;
            prevTouchX = null;
        }
    }
}

export function scrollManager(e) {
    if (e.ctrlKey == true || e.metaKey == true) {
        e.preventDefault();
        if (e.deltaY < 0) increaseZoom();
        else if (e.deltaY > 0) decreaseZoom();
        paletteUpdate();
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

export function clickManager(e) {
    let mousePos = mousePosInGrid(e);
    console.log('Click', mousePos);

    if (
        mousePos.x >= imageCatalog.palette.x &&
        mousePos.x < imageCatalog.palette.x + imageCatalog.palette.img.width &&
        mousePos.y >= imageCatalog.palette.y &&
        mousePos.y < imageCatalog.palette.y + imageCatalog.palette.img.height
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
    } else if (imageCatalog.share.display) {
        if (
            !(
                mousePos.x > imageCatalog.share.x &&
                mousePos.x < imageCatalog.share.x + imageCatalog.share.img.width &&
                mousePos.y > imageCatalog.share.y &&
                mousePos.y < imageCatalog.share.y + imageCatalog.share.img.height
            )
        ) {
            imageCatalog.share.display = false;
        } else {
            // console.log('img', imageCatalog.share.x, imageCatalog.share.y);
            if (
                mousePos.x > imageCatalog.share.x + 15 &&
                mousePos.x < imageCatalog.share.x + 115 &&
                mousePos.y > imageCatalog.share.y + 30 &&
                mousePos.y < imageCatalog.share.y + imageCatalog.share.img.height - 25
            ) {
                console.log('Clicked on OpenSea');
                openLink('opensea');
            } else if (
                mousePos.x > imageCatalog.share.x + 122 &&
                mousePos.x < imageCatalog.share.x + 215 &&
                mousePos.y > imageCatalog.share.y + 30 &&
                mousePos.y < imageCatalog.share.y + imageCatalog.share.img.height - 27
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
    y += imageCatalog.palette.y;
    x += imageCatalog.palette.x;
    return Math.ceil(mousePos.x - x) ** 2 + Math.ceil(mousePos.y - y) ** 2 <= radius ** 2;
}

function startUsingTool(e, mousePos) {
    //prettier-ignore
    if (e.button == 1) {useColorPicker(mousePos); e.preventDefault(); return;}
    button = e.button;
    useTool(e);
    canvas.onmousemove = useTool;
    canvas.onmouseup = () => {
        closeCurrentEvent();
        canvas.onmousemove = null;
    };
}

function useTool(e) {
    const color = button === 0 ? colorPicked1 : colorPicked2;
    const zIndex =
        color[0] === Const.DEFAULT_COLOR[0] &&
        color[1] === Const.DEFAULT_COLOR[1] &&
        color[2] === Const.DEFAULT_COLOR[2]
            ? undefined
            : 0;

    //If e is passed it's already formated, else it's a mouse event
    const mousePos = e.type ? convertToMonolithPos(mousePosInGrid({ x: e.x, y: e.y })) : e;
    if (!mousePos) return;

    switch (tool) {
        case 'smol':
            drawPixel(mousePos.x, mousePos.y, zIndex, color);
            break;
        case 'medium':
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, zIndex, color);
                }
            }
            break;
        case 'large':
            for (let i = -2; i <= 2; i++) {
                for (let j = -2; j <= 2; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, zIndex, color);
                }
            }
            for (let i = -1; i <= 1; i++) {
                drawPixel(mousePos.x + i, mousePos.y + 3, zIndex, color);
                drawPixel(mousePos.x + i, mousePos.y - 3, zIndex, color);
                drawPixel(mousePos.x + 3, mousePos.y + i, zIndex, color);
                drawPixel(mousePos.x - 3, mousePos.y + i, zIndex, color);
            }
            break;
        case 'giga':
            for (let i = -20; i <= 20; i++) {
                for (let j = -20; j <= 20; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, zIndex, color);
                }
            }
            break;
    }
}

function brushSwitch() {
    switch (tool) {
        case 'smol':
            playSound('clickB2B');
            tool = 'medium';
            break;
        case 'medium':
            playSound('clickB2C');
            tool = 'large';
            break;
        case 'large':
            playSound('clickB2');
            tool = 'smol';
            break;
        case 'giga':
            playSound('clickB2');
            tool = 'smol';
            break;
    }
    paletteUpdate();
}

function paletteUpdate() {
    imageCatalog.palette.img = paletteCatalog[`palette${scaleFactor}${tool}`].img;
    imageCatalog.selectorA.img = paletteCatalog[`selector${scaleFactor}A`].img;
    imageCatalog.selectorB.img = paletteCatalog[`selector${scaleFactor}B`].img;
}

export function mousePosInGrid(e) {
    const boundingClientRect = canvas.getBoundingClientRect();
    let y = Math.floor((e.y - boundingClientRect.y) / (scaleFactor * pixelSize));
    let x = Math.floor((e.x - boundingClientRect.x) / (scaleFactor * pixelSize));
    // console.log('mousePosInGrid', x, y);
    return { x: x, y: y };
}

function useColorPicker(mousePos) {
    const color = getColor(mousePos.x, mousePos.y);
    for (let i = 0; i < Const.GUI_PALETTE.length; i++) {
        if (
            color[0] === Const.GUI_PALETTE[i][0] &&
            color[1] === Const.GUI_PALETTE[i][1] &&
            color[2] === Const.GUI_PALETTE[i][2]
        ) {
            console.log('colorPicked1', color, i);
            colorSwitch({ button: 0 }, i + 1);
            return;
        }
    }
}

function importImage() {
    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (res) => {
            let importedImage = res.target.result; // this is the content!
            bufferOnMonolith({
                buffer: importedImage,
                x: 1,
                y: 1,
                paid: Const.FREE_DRAWING,
                yMaxLegal: Const.FREE_DRAWING,
                zIndex: 0,
            });

            //! NE PAS SUPPRIMER LES LIGNES CI-DESSOUS !//
            let base64 = btoa(
                new Uint8Array(importedImage).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            console.log('base64', base64);
        };
    };
    input.click();
}

function colorSwitch(e, color) {
    if (e.button == 0) {
        if (color === colorNumber2) {
            colorNumber2 = colorNumber1;
            colorPicked2 = Const.GUI_PALETTE[colorNumber1 - 1];
        }
        colorNumber1 = color;
        colorPicked1 = Const.GUI_PALETTE[color - 1];
    } else if (e.button == 2) {
        if (color === colorNumber1) {
            colorNumber1 = colorNumber2;
            colorPicked1 = Const.GUI_PALETTE[colorNumber2 - 1];
        }
        colorNumber2 = color;
        colorPicked2 = Const.GUI_PALETTE[color - 1];
    }
    playSound('click6');
}
