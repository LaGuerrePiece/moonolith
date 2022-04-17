import { getMonolithArray } from './monolith';
import { assembleLandscape } from './landscape';

export let marginBot = 30;
export let marginTop = 34;
export let marginLeft = 47;
export let marginRight = 60;

async function getLandscapeArray(renderWidth, renderHeight, nbColumnsLandscape, nbLineLandscape, viewPosX, viewPosY) {
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
    return landscapeArray;
}

export async function assemble(renderWidth, renderHeight, nbColumnsLandscape, nbLineLandscape, viewPosX, viewPosY) {
    let startAssemble = performance.now();
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
        if (monolithArray[i] !== undefined) landscapeArray[i] = monolithArray[i];
        if (Array.isArray(landscapeArray[i]) && !landscapeArray[i][0]) {
            landscapeArray[i] = [0, 0, 1];
        }
    }
    let endAssemble = performance.now();
    console.log(
        'Get arrays :',
        Math.floor(endGetArray - startAssemble),
        'ms | Write arrays :',
        Math.floor(endAssemble - endGetArray),
        'ms'
    );
    console.log('Assemble TOTAL :', Math.floor(endAssemble - startAssemble), 'ms');

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
