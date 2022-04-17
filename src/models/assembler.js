import { getMonolithArray } from './monolith';
import { assembleLandscape } from './landscape';

export let marginBot = 30;
export let marginTop = 34;
export let marginLeft = 47;
export let marginRight = 60;

var previousViewPosY;
var previousLandscape;

async function getLandscapeArray(renderWidth, renderHeight, nbColumnsLandscape, nbLineLandscape, viewPosX, viewPosY) {
    if (previousViewPosY !== viewPosY) {
        //execute only if viewPosY has changed, otherwise take the previous landscapeArray
        let landscapeArrayAssemble = await assembleLandscape(
            renderWidth,
            renderHeight,
            nbColumnsLandscape,
            nbLineLandscape,
            viewPosX,
            viewPosY
        );

        landscapeArrayAssemble = convert(landscapeArrayAssemble);
        let landscapeArray = [];

        for (let y = 0; y < renderHeight; y++) {
            const currentLinePosStart = (nbLineLandscape - renderHeight - viewPosY + y) * nbColumnsLandscape;
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

export async function assemble(
    renderWidth,
    renderHeight,
    nbColumnsLandscape,
    nbLineLandscape,
    viewPosX,
    viewPosY,
    params
) {
    let startAssemble = performance.now();
    //IF MONOLITHONLY, THEN USE PREVIOUSLANDSCAPE
    let landscapeArray = await getLandscapeArray(
        renderWidth,
        renderHeight,
        nbColumnsLandscape,
        nbLineLandscape,
        viewPosX,
        viewPosY
    );
    let monolithArray = getMonolithArray(renderWidth, renderHeight, viewPosX, viewPosY);
    let endGetArray = performance.now();

    for (let i = 0; i < landscapeArray.length; i++) {
        //IF LANDSCAPE VOID, ADD BLUE
        if (!landscapeArray[i][0]) landscapeArray[i] = [0, 0, 1];
        if (monolithArray[i] !== undefined) landscapeArray[i] = monolithArray[i];
    }

    //GUI
    const startGUI = Math.floor(renderWidth * (renderHeight - 7));
    for (let i = startGUI; i < landscapeArray.length; i++) {
        const column = i % renderWidth;
        //COLORS
        if (column < 5) landscapeArray[i] = [1, 0, 0];
        if (column < 10 && column >= 5) landscapeArray[i] = [0, 1, 0];
        if (column < 15 && column >= 10) landscapeArray[i] = [0, 0, 1];
        if (column < 20 && column >= 15) landscapeArray[i] = [1, 1, 0];
        if (column < 25 && column >= 20) landscapeArray[i] = [0, 1, 1];
        if (column < 30 && column >= 25) landscapeArray[i] = [1, 0, 1];
        //TOOLS
        if (column < 35 && column >= 30) landscapeArray[i] = [0.9, 0.9, 0.9];
        if (column < 40 && column >= 35) landscapeArray[i] = [0.8, 0.8, 0.8];
        if (column < 45 && column >= 40) landscapeArray[i] = [0.7, 0.7, 0.7];
        if (column < 50 && column >= 45) landscapeArray[i] = [0.6, 0.6, 0.6];
        if (column < 55 && column >= 50) landscapeArray[i] = [0.5, 0.5, 0.5];
        if (column < 60 && column >= 55) landscapeArray[i] = [0.4, 0.4, 0.4];
        if (column < 65 && column >= 60) landscapeArray[i] = [0.3, 0.3, 0.3];
    }

    let endAssemble = performance.now();
    // console.log(
    //     'Get arrays :',
    //     Math.floor(endGetArray - startAssemble),
    //     'ms | Write arrays :',
    //     Math.floor(endAssemble - endGetArray),
    //     'ms'
    // );
    // console.log('Assemble TOTAL :', Math.floor(endAssemble - startAssemble), 'ms');
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
