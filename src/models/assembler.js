import landscapeJSON from './JSON/landscapeBis.json';
import monolithJSON from './JSON/monolith.json';
import Klon from './klon';
import { monolith } from './monolith';
import { preEncodeSpecialK } from '../utils/image-manager';
import { assembleLandscape } from './landscape';

// let monolith
// let landscape = convert(Object.values(landscapeJSON));

let marginBot = 20;
let marginTop = 34;
let marginLeft = 47;
let marginRight = 60;

console.log('monolith', monolith);

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
    //console.log('landscapeArray', landscapeArray);
    return landscapeArray;
}

function getMonolithArray(renderWidth, renderHeight, nbColumnsLandscape, nbLineLandscape, viewPosX, viewPosY) {
    let monolithArray = [];

    for (let y = 0; y < renderHeight; y++) {
        const currentLinePosStart = (nbLineLandscape - renderHeight - viewPosY + y) * nbColumnsLandscape;
        for (let x = 0; x < renderWidth; x++) {
            const currentColumnPosStart = viewPosX + x;
            monolithArray.push(monolith[currentColumnPosStart + currentLinePosStart]);
        }
    }

    return monolithArray;
}

export async function assemble(renderWidth, renderHeight, nbColumnsLandscape, nbLineLandscape, viewPosX, viewPosY) {
    // ................      256,     400,           256,        400,       0,      0
    let startLandscape = performance.now();
    let landscapeArray = await getLandscapeArray(
        renderWidth,
        renderHeight,
        nbColumnsLandscape,
        nbLineLandscape,
        viewPosX,
        viewPosY
    );
    console.log('landscape time', performance.now() - startLandscape);

    let startmonolith = performance.now();

    let monolithArray = getMonolithArray(
        renderWidth,
        renderHeight,
        nbColumnsLandscape,
        nbLineLandscape,
        viewPosX,
        viewPosY
    );
    console.log('monolith time', performance.now() - startmonolith);

    let assembleTime = performance.now();
    //console.log('monolithArray', monolithArray);
    for (let i = 0; i < renderHeight; i++) {
        const currentLine = viewPosY + renderHeight - i;
        if (currentLine >= marginBot && currentLine <= nbLineLandscape - marginTop) {
            for (let j = 0; j < renderWidth; j++) {
                if (j >= marginLeft - viewPosX && j < nbColumnsLandscape - marginRight - viewPosX) {
                    landscapeArray[i * renderWidth + j] = monolithArray[i * renderWidth + j];
                }
            }
        }
    }

    console.log('assemble time', performance.now() - assembleTime);
    //console.log('landscapeArray, end of assemble', landscapeArray);
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

//WORKING ASSEMBLE SAVE
// for (let i = 0; i < renderHeight; i++) {
//     const currentLine = viewPosY + renderHeight - i;
//     if (currentLine >= marginBot && currentLine <= nbLine - marginTop) {
//         for (let j = 0; j < renderWidth; j++) {
//             if (j >= marginLeft - viewPosX && j < nbColumns - marginRight - viewPosX) {
//                 landscapeArray[i * renderWidth + j] = monolithArray[i * renderWidth + j];
//             }
//         }
//     }
// }

// SAVE GETARRAYS
// export function getArrays(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
//     let landscapeArray = [];
//     let monolithArray = [];
//     for (let y = 0; y < renderHeight; y++) {
//         const currentLinePosStart = (nbLine - renderHeight - viewPosY + y) * nbColumns;
//         for (let x = 0; x < renderWidth; x++) {
//             const currentColumnPosStart = viewPosX + x;
//             landscapeArray.push(landscape[currentColumnPosStart + currentLinePosStart]);
//             monolithArray.push(monolith[currentColumnPosStart + currentLinePosStart]);
//         }
//     }
//     console.log('landscapeArray', landscapeArray);
//     console.log('monolithArray', monolithArray);
//     return { monolithArray, landscapeArray };
// }
