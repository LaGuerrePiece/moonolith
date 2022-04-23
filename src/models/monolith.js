import Klon from './klon';
import Const from './constants';
import { addToCurrentEvent, closeCurrentEvent } from './undoStack';
import { renderWidth, renderHeight, viewPosX, viewPosY, update } from '../main';
import { imageCatalog } from '../assets/imageData';

export let monolith;

export function buildMonolith() {
    monolith = Array.from({ length: Const.MONOLITH_LINES }, () =>
        Array.from({ length: Const.MONOLITH_COLUMNS }, () => new Klon(Const.DEFAULT_COLOR))
    );
    console.log('//     monolith initialized at ' + Const.MONOLITH_LINES + '    //');
}

export function drawPixel(x, y, zIndex, color) {
    if (x < 0 || x >= Const.MONOLITH_COLUMNS || y < 0 || y >= Const.MONOLITH_LINES) return; //IF OUT OF BOUNDS, return
    if (!monolith[y][x].isEditable(zIndex)) return; //IF IT IS NOT EDITABLE, return
    // if (monolith[y][x].color === color && monolith[y][x].zIndex === zIndex) return; //IF IT IS THE SAME, return
    if (zIndex === 0) addToCurrentEvent(x, y, monolith[y][x]); //IF IT IS BEING DRAW BY USER, ADD TO CURRENT EVENT
    monolith[y][x] = new Klon(color, zIndex);
}

export function getColor(x, y) {
    console.log('monolith[y][x]', x, y, monolith[y][x]);
    return monolith[y][x].color;
}

export function eraseAllPixel() {
    for (let j = 0; j < Const.MONOLITH_LINES; j++) {
        for (let i = 0; i < Const.MONOLITH_COLUMNS; i++) {
            if (monolith[j][i].zIndex === 0) {
                addToCurrentEvent(i, j, monolith[j][i]);
                monolith[j][i] = new Klon(Const.DEFAULT_COLOR);
            }
        }
    }
    closeCurrentEvent();
    console.log('eraseAllPixel');
    update();
}

export function erasePixel(x, y) {
    if (monolith[y]?.[x]?.zIndex === 0) {
        addToCurrentEvent(x, y, monolith[y][x]);
        monolith[y][x] = new Klon(Const.DEFAULT_COLOR);
    }
}

export function convertIndexToXY(index) {
    let x = index % Const.MONOLITH_COLUMNS;
    let y = Math.floor(index / Const.MONOLITH_COLUMNS);
    return { x, y };
}

export function convertToMonolithPos(mousePos) {
    mousePos.y = Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - viewPosY - renderHeight + mousePos.y;
    mousePos.x = viewPosX - Const.MARGIN_LEFT + mousePos.x;
    if (mousePos.x < 0 || mousePos.x >= Const.MONOLITH_COLUMNS || mousePos.y < 0 || mousePos.y >= Const.MONOLITH_LINES)
        return undefined;
    return mousePos;
}

export function getMonolithArray() {
    let monolithArray = [];
    const startY = Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - viewPosY - renderHeight;
    const startX = viewPosX - Const.MARGIN_LEFT;
    for (let i = 0; i < renderHeight; i++) {
        for (let j = 0; j < renderWidth; j++) {
            if (monolith[startY + i]?.[startX + j]) {
                monolithArray.push(monolith[startY + i][startX + j].color);
            } else {
                monolithArray.push(undefined);
            }
        }
    }
    return monolithArray;
}

export function increaseMonolithHeight(newRows) {
    console.log('increaseMonolithHeight');
    console.log();

    for (let rowAdded = 0; rowAdded < newRows; rowAdded++) {
        let oldScalingValue;
        let scalingValue = 1000 * (Math.log(rowAdded) / Math.log(2) + 1);
        setTimeout(() => {
            console.log('rowAdded', rowAdded, oldScalingValue - scalingValue);
            oldScalingValue = scalingValue;
            Const.setMonolithHeight(Const.MONOLITH_LINES + 1);
            monolith.push(
                ...Array.from({ length: 1 }, () =>
                    Array.from({ length: Const.MONOLITH_COLUMNS }, () => new Klon(Const.DEFAULT_COLOR))
                )
            );
            //MET A JOUR LES STARTY :
            for (let layer in imageCatalog) {
                const thisLayer = imageCatalog[layer];
                if (thisLayer.type == 'side') thisLayer.startY++;
            }
            update(true);
        }, scalingValue);
    }
}
