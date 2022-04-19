import { getMonolithArray } from './monolith';
import { assembleLandscape } from './landscape';
import Const from './constants';
import { renderWidth, renderHeight, viewPosX, viewPosY } from '../main';

export let marginBot = Const.MARGIN_BOTTOM;
export let marginTop = Const.MARGIN_TOP;
export let marginLeft = Const.MARGIN_LEFT;
export let marginRight = Const.MARGIN_RIGHT;

var previousViewPosY;
var previousLandscape;

function getLandscapeArray() {
    if (previousViewPosY !== viewPosY) {
        //execute only if viewPosY has changed, otherwise take the previous landscapeArray
        let landscapeArrayAssemble = assembleLandscape();

        landscapeArrayAssemble = convert(landscapeArrayAssemble);
        let landscapeArray = [];

        for (let y = 0; y < renderHeight; y++) {
            const currentLinePosStart = (Const.LINES - renderHeight - viewPosY + y) * Const.COLUMNS;
            for (let x = 0; x < renderWidth; x++) {
                const currentColumnPosStart = viewPosX + x;
                landscapeArray.push(landscapeArrayAssemble[currentColumnPosStart + currentLinePosStart]);
            }
        }
        previousLandscape = landscapeArray;
        previousViewPosY = viewPosY;
        return landscapeArray;
    } else {
        return previousLandscape;
    }
}

export function assemble() {
    let startAssemble = performance.now();
    let landscapeArray = getLandscapeArray();
    let monolithArray = getMonolithArray();
    let endGetArray = performance.now();

    for (let i = 0; i < landscapeArray.length; i++) {
        //IF LANDSCAPE VOID, ADD RED
        if (!landscapeArray[i]?.[0]) landscapeArray[i] = [0.9764, 0.5098, 0.5176];
        if (monolithArray[i] !== undefined) landscapeArray[i] = monolithArray[i];
    }

    //GUI
    const startGUI = Math.floor(renderWidth * (renderHeight - 7));
    for (let i = startGUI; i < landscapeArray.length; i++) {
        const column = i % renderWidth;
        //COLORS
        if (column < 5) landscapeArray[i] = Const.RGB1;
        if (column < 10 && column >= 5) landscapeArray[i] = Const.RGB2;
        if (column < 15 && column >= 10) landscapeArray[i] = Const.RGB10;
        if (column < 20 && column >= 15) landscapeArray[i] = Const.RGB4;
        if (column < 25 && column >= 20) landscapeArray[i] = Const.RGB5;
        if (column < 30 && column >= 25) landscapeArray[i] = Const.RGB6;
        //TOOLS
        if (column < 35 && column >= 30) landscapeArray[i] = [0.9, 0.9, 0.9];
        if (column < 40 && column >= 35) landscapeArray[i] = [0.8, 0.8, 0.8];
        if (column < 45 && column >= 40) landscapeArray[i] = [0.7, 0.7, 0.7];
        if (column < 50 && column >= 45) landscapeArray[i] = [0.1, 0.6, 0.3];
        if (column < 55 && column >= 50) landscapeArray[i] = [0.3, 0.6, 0.1];
        if (column < 60 && column >= 55) landscapeArray[i] = [0.4, 0.4, 0.4];
        if (column < 65 && column >= 60) landscapeArray[i] = [0.6, 0.1, 0.3];
    }

    let endAssemble = performance.now();
    console.log(
        'Get arrays + Write arrays = Total : ',
        Math.floor(endGetArray - startAssemble),
        '+',
        Math.floor(endAssemble - endGetArray),
        '=',
        Math.floor(endAssemble - startAssemble),
        'ms'
    );
    return landscapeArray;
}

//Conversion d'un array JSON en array RGB
function convert(data) {
    let convertedData = [];
    for (let i = 0; i < data.length; i += 4) {
        convertedData.push([data[i] / 255, data[i + 1] / 255, data[i + 2] / 255]);
    }
    return convertedData;
}
