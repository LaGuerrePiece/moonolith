import Const from '../constants';
import { scaleFactor, viewPosY, viewPosX } from '../display/view';
import { canvas, pixelSize, renderHeight } from '../display/displayLoop';
import { imageCatalog } from '../display/images';
import { GUICatalog } from '../display/GUI';
import { FAQCatalog } from '../display/FAQ';

export function isInCircle(mousePos, y, x, radius, plan, catalog) {
    mousePos = convertToLayer(mousePos, plan, catalog);
    return Math.ceil(mousePos.x - x) ** 2 + Math.ceil(mousePos.y - y) ** 2 <= radius ** 2;
}

export function isInSquare(mousePos, xmin, xmax, ymin, ymax, plan, catalog) {
    mousePos = convertToLayer(mousePos, plan, catalog);
    if (mousePos.x >= xmin && mousePos.x <= xmax && mousePos.y >= ymin && mousePos.y <= ymax) {
        return true;
    }
    return false;
}

function convertToLayer(coords, plan, catalog) {
    const thisCatalog =
        catalog === 'imageCatalog'
            ? imageCatalog
            : catalog === 'GUICatalog'
            ? GUICatalog
            : catalog === 'FAQCatalog'
            ? FAQCatalog
            : undefined;
    const thisImage = thisCatalog[plan];

    return {
        x: coords.x - thisImage.x,
        y: coords.y - thisImage.y,
    };
}

export function mousePosInGrid(e) {
    const boundingClientRect = canvas.getBoundingClientRect();
    let x = Math.floor((e.x - boundingClientRect.x) / (scaleFactor * pixelSize));
    let y = Math.floor((e.y - boundingClientRect.y) / (scaleFactor * pixelSize));
    return { x: x, y: y };
}

export function convertToMonolithPos(mousePos) {
    mousePos.y = Const.MONOLITH_LINES + Const.MARGIN_BOTTOM - viewPosY - renderHeight + mousePos.y;
    mousePos.x = viewPosX - Const.MARGIN_LEFT + mousePos.x;
    if (mousePos.x < 0 || mousePos.x >= Const.MONOLITH_COLUMNS || mousePos.y < 0 || mousePos.y >= Const.MONOLITH_LINES)
        return undefined;
    return mousePos;
}
