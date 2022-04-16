import landscapeJSON from './JSON/landscapeBis.json';
import monolithJSON from './JSON/monolith.json';
import Klon from './klon';
import { monolith } from './monolith';
import { preEncodeSpecialK } from '../utils/image-manager';

//let monolith
let landscape = convert(Object.values(landscapeJSON));

let marginBot = 20;
let marginTop = 34;
let marginLeft = 47;
let marginRight = 60;

console.log('landscape', landscape);
console.log('monolith', monolith);

// TAKES LANDSCAPE ARRAY AND RETURNS ARRAY OF RIGHT SIZE
function getArrays(
    renderWidth,
    renderHeight,
    nbColumnsLandscape,
    nbLineLandscape,
    nbColumnsMonolith,
    nbLineMonolith,
    viewPosX,
    viewPosY
) {
    let landscapeArray = [];
    let monolithArray = [];

    //LANDSCAPE
    for (let y = 0; y < renderHeight; y++) {
        const currentLinePosStart = (nbLineLandscape - renderHeight - viewPosY + y) * nbColumnsLandscape;
        for (let x = 0; x < renderWidth; x++) {
            const currentColumnPosStart = viewPosX + x;
            landscapeArray.push(landscape[currentColumnPosStart + currentLinePosStart]);
        }
    }

    //MONOLITH
    //Nombre de lignes qu'on veut du Monolith :
    const nbLineMonolithToRender = renderHeight - viewPosY;

    for (let i = 0; i < renderWidth * renderHeight; i++) {
        if (monolith[i] == undefined) monolithArray.push(undefined);
        else monolithArray.push(monolith[i]);
    }

    for (let y = 0; y < renderHeight; y++) {
        const currentLinePosStart = (nbLineMonolith - renderHeight - viewPosY + y) * nbColumnsMonolith;
        for (let x = 0; x < renderWidth; x++) {
            const currentColumnPosStart = viewPosX + x;
            monolithArray.push(landscape[currentColumnPosStart + currentLinePosStart]);
        }
    }

    console.log('landscapeArray', landscapeArray);
    console.log('monolithArray', monolithArray);

    return { landscapeArray, monolithArray };
}

export function assemble(
    renderWidth,
    renderHeight,
    nbColumnsLandscape,
    nbLineLandscape,
    nbColumnsMonolith,
    nbLineMonolith,
    viewPosX,
    viewPosY
) {
    // ................      256,     400,           256,        400,       0,      0
    let start = performance.now();
    let { landscapeArray, monolithArray } = getArrays(
        renderWidth,
        renderHeight,
        nbColumnsLandscape,
        nbLineLandscape,
        nbColumnsMonolith,
        nbLineMonolith,
        viewPosX,
        viewPosY
    );

    for (let i = 0; i < renderWidth * renderHeight; i++) {
        if (monolithArray[i] != undefined) {
            landscapeArray[i] = monolithArray[i];
        }
    }

    for (let i = 0; i < renderHeight; i++) {
        const currentLine = viewPosY + renderHeight - i;
        if (currentLine >= marginBot && currentLine <= nbLine - marginTop) {
            for (let j = 0; j < renderWidth; j++) {
                if (j >= marginLeft - viewPosX && j < nbColumns - marginRight - viewPosX) {
                    landscapeArray[i * renderWidth + j] = monolithArray[i * renderWidth + j];
                }
            }
        }
    }

    console.log('assemble time', performance.now() - start);
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
