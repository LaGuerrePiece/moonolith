import Const from '../constants';
import { pixelSize, renderHeight } from '../main';
import { scaleFactor, viewPosY, viewPosX } from '../display/view';
import { canvas } from '../display/displayLoop';

export function isInSquare(xmin, xmax, ymin, ymax, pointerX, pointerY) {
    let pos = absolutePosition(pointerX, pointerY);
    if (pos.x >= xmin && pos.x <= xmax && pos.y >= ymin && pos.y <= ymax) return true;
    return false;
}

function absolutePosition(pointerX, pointerY) {
    return {
        x: viewPosX + pointerX,
        y: renderHeight - pointerY + viewPosY,
    };
}

export function mousePosInGrid(e) {
    const boundingClientRect = canvas.getBoundingClientRect();
    let y = Math.floor((e.y - boundingClientRect.y) / (scaleFactor * pixelSize));
    let x = Math.floor((e.x - boundingClientRect.x) / (scaleFactor * pixelSize));
    // console.log('mousePosInGrid', x, y);
    return { x: x, y: y };
}

export function convertToMonolithPos(mousePos) {
    mousePos.y = Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - viewPosY - renderHeight + mousePos.y;
    mousePos.x = viewPosX - Const.MARGIN_LEFT + mousePos.x;
    if (mousePos.x < 0 || mousePos.x >= Const.MONOLITH_COLUMNS || mousePos.y < 0 || mousePos.y >= Const.MONOLITH_LINES)
        return undefined;
    return mousePos;
}
