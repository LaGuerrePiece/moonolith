import Const from './constants';
import { addToCurrentEvent, closeCurrentEvent } from './undoStack';
import { renderWidth, renderHeight, viewPosX, viewPosY, changeViewPos } from '../main';
import { playSound, muteState } from '../assets/sounds';
import { shake } from './display';
import { animatedPixels } from '../utils/runeAnims';

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
    const pos = (y * Const.MONOLITH_COLUMNS + x) * 4;
    const monolithzIndex = monolithIndexes[y]?.[x];
    if (x < 0 || x >= Const.MONOLITH_COLUMNS || y < 0 || y >= Const.MONOLITH_LINES) return; //If out of bounds, return
    if (!isEditable(zIndex, monolithzIndex)) return; //If not editable, return
    if (same(x, y, pos, zIndex, color)) return; //If same, return
    if (zIndex === 0 || zIndex === undefined)
        addToCurrentEvent(x, y, [monolith[pos], monolith[pos + 1], monolith[pos + 2]], monolithzIndex); //If being drawn by user, add to curent event

    // if (animatedPixels[pos]) return;
    const transitionType = zIndex === 0 ? 'draw' : zIndex === undefined ? 'erase' : zIndex > 0 ? 'import' : undefined;
    animatedPixels.set(pos, [transitionType, color, 1]);
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
    // Increase monolith and monolithIndexes height
    let newMonolith = new Uint8ClampedArray((Const.MONOLITH_LINES + newRows) * Const.MONOLITH_COLUMNS * 4);
    newMonolith.set(monolith);
    for (let i = 0; i < newRows * Const.MONOLITH_COLUMNS * 4; i += 4) {
        const idx = Const.MONOLITH_LINES * Const.MONOLITH_COLUMNS * 4 + i;
        newMonolith[idx] = 50;
        newMonolith[idx + 1] = 44;
        newMonolith[idx + 2] = 60;
        newMonolith[idx + 3] = 255;
    }
    monolith = newMonolith;
    monolithIndexes.push(
        ...Array.from({ length: newRows }, () => Array.from({ length: Const.MONOLITH_COLUMNS }, () => undefined))
    );

    // grows monolith
    setTimeout(() => {
        for (let rowAdded = 0; rowAdded < newRows; rowAdded++) {
            let scalingValue = 1000 * Math.log(rowAdded);
            setTimeout(() => {
                Const.setMonolithHeight(Const.MONOLITH_LINES + 1);
            }, scalingValue);
        }
    }, 2000);

    shake(newRows);
}
