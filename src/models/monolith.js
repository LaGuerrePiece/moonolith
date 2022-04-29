import Klon from './klon';
import Const from './constants';
import { addToCurrentEvent, closeCurrentEvent } from './undoStack';
import { renderWidth, renderHeight, viewPosX, viewPosY } from '../main';
import { imageCatalog } from '../assets/imageData';
import { toggleRumble, playSound } from '../assets/sounds';

export let monolith;

export function buildMonolith() {
    monolith = Array.from({ length: Const.MONOLITH_LINES }, () =>
        Array.from({ length: Const.MONOLITH_COLUMNS }, () => new Klon(Const.DEFAULT_COLOR))
    );
    monolith[Const.MONOLITH_LINES - 1][Const.MONOLITH_COLUMNS - 1].transitionCount = 1;
}
let lastPlayedSound = Date.now();

export function drawPixel(x, y, zIndex, color) {
    const currentKlon = monolith[y]?.[x];
    if (!currentKlon) return; //If out of bounds, return
    if (!currentKlon.isEditable(zIndex)) return; //If not editable, return
    if (sameKlon(currentKlon, zIndex, color)) return; //If same, return
    if (zIndex === 0 || zIndex === undefined) addToCurrentEvent(x, y, currentKlon.target, currentKlon.zIndex); //If being drawn by user, add to curent event
    currentKlon.setTargetColor(color);
    currentKlon.zIndex = zIndex;

    if (zIndex === 0 && lastPlayedSound + 40 < Date.now()) {
        playSound('click5p26');
        lastPlayedSound = Date.now();
    }
    if (zIndex === undefined && lastPlayedSound + 120 < Date.now()) {
        playSound('revBip');
        lastPlayedSound = Date.now();
    }
}

function sameKlon(currentKlon, zIndex, color) {
    if (
        currentKlon.target[0] === color[0] &&
        currentKlon.target[1] === color[1] &&
        currentKlon.target[2] === color[2] &&
        currentKlon.zIndex === zIndex
    )
        return true;
    return false;
}

export function getColor(x, y) {
    console.log('monolith[y][x]', x, y, monolith[y][x]);
    if (monolith[y][x].zIndex === undefined) console.log('picked default color');
    return monolith[y][x].color;
}

export function eraseAllPixel() {
    for (let j = 0; j < Const.MONOLITH_LINES; j++) {
        for (let i = 0; i < Const.MONOLITH_COLUMNS; i++) {
            drawPixel(i, j, undefined, Const.DEFAULT_COLOR);
        }
    }
    closeCurrentEvent();
    playSound('dwouipPitched');
}

export function convertToMonolithPos(mousePos) {
    mousePos.y = Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - viewPosY - renderHeight + mousePos.y;
    mousePos.x = viewPosX - Const.MARGIN_LEFT + mousePos.x;
    if (mousePos.x < 0 || mousePos.x >= Const.MONOLITH_COLUMNS || mousePos.y < 0 || mousePos.y >= Const.MONOLITH_LINES)
        return undefined;
    return mousePos;
}

export function increaseMonolithHeight(newRows) {
    toggleRumble();

    //shake landscapes
    const shakeLandscape = setInterval(() => {
        for (let layer in imageCatalog) {
            const thisLayer = imageCatalog[layer];
            if (thisLayer.type === 'landscape' && thisLayer.name !== 'caly0') {
                let offset = Math.floor(Math.random() * 3);
                let direction = Math.floor(Math.random() * 2) * 2 - 1; //-1 or 1
                switch (offset) {
                    case 0:
                        thisLayer.startX = 1 * direction;
                        break;
                    case 1:
                    case 2:
                        thisLayer.startX = 0;
                        break;
                }
            }
        }
    }, 200);

    //grows monolith
    setTimeout(() => {
        for (let rowAdded = 0; rowAdded < newRows; rowAdded++) {
            let scalingValue = 1000 * Math.log(rowAdded);
            setTimeout(() => {
                Const.setMonolithHeight(Const.MONOLITH_LINES + 1);
                monolith.push(...[Array.from({ length: Const.MONOLITH_COLUMNS }, () => new Klon(Const.DEFAULT_COLOR))]);
                //MET A JOUR LES STARTY :
                for (let layer in imageCatalog) {
                    const thisLayer = imageCatalog[layer];
                    if (thisLayer.type === 'side') thisLayer.startY++;
                }
            }, scalingValue);
        }
    }, 2000);

    //clear landscape shake
    setTimeout(() => {
        clearInterval(shakeLandscape);
        for (let layer in imageCatalog) {
            const thisLayer = imageCatalog[layer];
            if (thisLayer.type === 'landscape') {
                thisLayer.startX = 0;
            }
        }
        toggleRumble();
    }, 2000 + 1000 * Math.log(newRows));
}
