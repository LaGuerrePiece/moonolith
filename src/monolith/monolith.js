import Const from '../constants';
import { addToCurrentEvent, closeCurrentEvent } from './undoStack';
import { playSound } from '../assets/sounds';
import { shake } from '../display/displayLoop';
import { animatedPixels, chunksToAnimateInfo } from './monolithAnims';

export let monolith;
export let monolithIndexes;

export function buildMonolith() {
    monolith = new Uint8ClampedArray(Const.MONOLITH_LINES * Const.MONOLITH_COLUMNS * 4);
    for (let i = 0; i < Const.MONOLITH_LINES * Const.MONOLITH_COLUMNS * 4; i += 4) {
        monolith[i] = 50;
        monolith[i + 1] = 44;
        monolith[i + 2] = 60;
        monolith[i + 3] = 255;
    }

    monolithIndexes = new Array(Const.MONOLITH_LINES);
    for (let y = 0; y < Const.MONOLITH_LINES; y++) {
        monolithIndexes[y] = new Array(Const.MONOLITH_COLUMNS);
    }
}

export function drawPixel(x, y, zIndex, color) {
    const pos = (y * Const.MONOLITH_COLUMNS + x) * 4;
    const monolithzIndex = monolithIndexes[y]?.[x];
    if (x < 0 || x >= Const.MONOLITH_COLUMNS || y < 0 || y >= Const.MONOLITH_LINES) return; //If out of bounds, return
    if (!isEditable(zIndex, monolithzIndex)) return; //If not editable, return
    if (same(x, y, pos, zIndex, color)) return; //If same, return
    if (animatedPixels.get(pos) && (monolithzIndex === 0 || monolithzIndex === undefined)) return; // If drawn by user and currently animated
    if (zIndex === 0 || zIndex === undefined)
        addToCurrentEvent(x, y, [monolith[pos], monolith[pos + 1], monolith[pos + 2]], monolithzIndex); //If being drawn by user, add to curent event

    let transitionType =
        zIndex === 0 ? 'draw' : zIndex === undefined ? 'erase' : chunksToAnimateInfo[zIndex] ? 'import' : undefined;
    if (transitionType === 'draw' || transitionType === 'erase') {
        animatedPixels.set(pos, [transitionType, color, 1]);
    } else if (transitionType === 'import') {
        chunksToAnimateInfo[zIndex].data.push([pos, color]);
    } else {
        monolith[pos] = color[0];
        monolith[pos + 1] = color[1];
        monolith[pos + 2] = color[2];
    }

    monolithIndexes[y][x] = zIndex;

    if (zIndex === 0) playSound('click5p26', 40);
    else if (zIndex === undefined) playSound('revBip', 120);
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
    const pos = (y * Const.MONOLITH_COLUMNS + x) * 4;
    return [monolith[pos], monolith[pos + 1], monolith[pos + 2]];
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