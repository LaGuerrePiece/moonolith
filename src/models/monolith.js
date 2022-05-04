import Const from './constants';
import { addToCurrentEvent, closeCurrentEvent } from './undoStack';
import { renderWidth, renderHeight, viewPosX, viewPosY } from '../main';
import { toggleRumble, playSound, muteState } from '../assets/sounds';
import { imageCatalog } from './display';

export let monolith;
export let monolithIndexes;

export function buildMonolith() {
    let start = performance.now();
    // monolith = Array.from({ length: Const.MONOLITH_LINES * Const.MONOLITH_COLUMNS }, () => [40, 40, 46, 255]).flat();
    monolith = new Uint8ClampedArray(Const.MONOLITH_LINES * Const.MONOLITH_COLUMNS * 4);
    for (let i = 0; i < Const.MONOLITH_LINES * Const.MONOLITH_COLUMNS * 4; i += 4) {
        monolith[i] = 50;
        monolith[i + 1] = 44;
        monolith[i + 2] = 60;
        monolith[i + 3] = 255;
    }
    console.log('time :', performance.now() - start);
    console.log('monolith', monolith);

    monolithIndexes = Array.from({ length: Const.MONOLITH_LINES }, () =>
        Array.from({ length: Const.MONOLITH_COLUMNS }, () => undefined)
    );
    console.log('monolithIndexes', monolithIndexes);
}
let lastPlayedSound = Date.now();

export function drawPixel(x, y, zIndex, color) {
    const monolithPos = (y * Const.MONOLITH_COLUMNS + x) * 4;
    const monolithzIndex = monolithIndexes[y]?.[x];
    if (x < 0 || x >= Const.MONOLITH_COLUMNS || y < 0 || y >= Const.MONOLITH_LINES) return; //If out of bounds, return
    if (!isEditable(zIndex, monolithzIndex)) return; //If not editable, return
    if (same(x, y, monolithPos, zIndex, color)) return; //If same, return
    // if (zIndex === 0 || zIndex === undefined) addToCurrentEvent(x, y, currentKlon.target, currentKlon.zIndex); //If being drawn by user, add to curent event
    monolith[monolithPos] = color[0];
    monolith[monolithPos + 1] = color[1];
    monolith[monolithPos + 2] = color[2];
    // monolith[monolithPos + 3] = 255;
    monolithIndexes[y][x] = zIndex;

    if (zIndex === 0 && lastPlayedSound + 40 < Date.now() && !muteState) {
        playSound('click5p26');
        lastPlayedSound = Date.now();
    } else if (zIndex === undefined && lastPlayedSound + 120 < Date.now() && !muteState) {
        playSound('revBip');
        lastPlayedSound = Date.now();
    }
}

function isEditable(newZIndex, oldZIndex) {
    if (oldZIndex === 0 || oldZIndex === undefined) return true;
    if (newZIndex === 0) return oldZIndex <= newZIndex;
    return oldZIndex >= newZIndex;
}

function same(x, y, monolithPos, zIndex, color) {
    if (
        monolith[monolithPos] === color[0] &&
        monolith[monolithPos + 1] === color[1] &&
        monolith[monolithPos + 2] === color[2] &&
        monolithIndexes[y][x] === zIndex
    )
        return true;
    return false;
}

export function getColor(x, y) {
    console.log('monolith[y][x]', x, y, monolith[y][x]);
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
            if (thisLayer.type === 'landscape' && layer !== 'caly0') {
                let offset = Math.floor(Math.random() * 3);
                let direction = Math.floor(Math.random() * 2) * 2 - 1; //-1 or 1
                switch (offset) {
                    case 0:
                        thisLayer.startX = 1 * direction;
                        break;
                    case 1:
                    case 2:
                        thisLayer.startX = -2;
                        break;
                }
            }
        }
    }, 200);

    // grows monolith
    setTimeout(() => {
        for (let rowAdded = 0; rowAdded < newRows; rowAdded++) {
            let scalingValue = 1000 * Math.log(rowAdded);
            setTimeout(() => {
                // Increase monolith height
                let newMonolith = new Uint8ClampedArray((Const.MONOLITH_LINES + 1) * Const.MONOLITH_COLUMNS * 4);
                newMonolith.set(monolith);
                newMonolith.set(
                    Array.from({ length: Const.MONOLITH_COLUMNS }, () => [50, 44, 60, 255]).flat(),
                    Const.MONOLITH_LINES * Const.MONOLITH_COLUMNS * 4
                );
                monolith = newMonolith;
                // Increase monolithIndexes height
                monolithIndexes.push(Array.from({ length: Const.MONOLITH_COLUMNS }, () => undefined));
                Const.setMonolithHeight(Const.MONOLITH_LINES + 1);
            }, scalingValue);
        }
    }, 2000);

    //clear landscape shake
    setTimeout(() => {
        clearInterval(shakeLandscape);
        for (let layer in imageCatalog) {
            const thisLayer = imageCatalog[layer];
            if (thisLayer.type === 'landscape') {
                thisLayer.startX = -2;
            }
        }
        toggleRumble();
    }, 2000 + 1000 * Math.log(newRows));
}
