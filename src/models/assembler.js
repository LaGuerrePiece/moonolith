import landscapeJSON from '../assets/JSON/landscapeBis.json';
import monolithJSON from '../assets/JSON/monolith.json';
import { preEncodeSpecialK } from '../utils/image-manager';
import { assembleLandscape } from './landscape';

let marginBot = 20;
let marginTop = 34;
let marginLeft = 47;
let marginRight = 60;

function getArrays(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    let landscapeArray = [];
    let monolithArray = [];
    for (let y = 0; y < renderHeight; y++) {
        let currentLineStart = (nbLine - renderHeight - viewPosY + y) * 4 * nbColumns;
        for (let x = 0; x < renderWidth * 4; x++) {
            let currentColumnStart = viewPosX * 4 + x;
            landscapeArray.push(landscapeJSON[currentColumnStart + currentLineStart]);
            monolithArray.push(monolithJSON[currentColumnStart + currentLineStart]);
        }
    }
    return { monolithArray, landscapeArray };
}

export function assemble(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    console.log(
        'renderWidth', // 256
        renderWidth,
        'renderHeight', // 362
        renderHeight,
        'nbColumns', // 256
        nbColumns,
        'nbLine', // 362
        nbLine,
        'viewPosX', // 0
        viewPosX,
        'viewPosY', // 0
        viewPosY
    );
    let start = performance.now(); // benchmark

    let displayArray = [];
    let { monolithArray, landscapeArray } = getArrays(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY); // obtient les arrays à concaténer
    let writtenLines = 0;
    while (writtenLines < renderHeight) {
        let currentLine = viewPosY + renderHeight - writtenLines;

        if (currentLine < marginBot) {
            //bot
            for (let i = 0; i < renderWidth * 4; i++) {
                displayArray[writtenLines * renderWidth * 4 + i] = landscapeArray[writtenLines * renderWidth * 4 + i];
            }
        } else if (currentLine > nbLine - marginTop) {
            // top
            for (let i = 0; i < renderWidth * 4; i++) {
                displayArray[writtenLines * renderWidth * 4 + i] = landscapeArray[writtenLines * renderWidth * 4 + i];
            }
        } else {
            //mid
            for (let i = 0; i < renderWidth * 4; i++) {
                if (i >= (marginLeft - viewPosX)* 4 && i < (nbColumns - marginRight - viewPosX) * 4) {
                    displayArray[writtenLines * renderWidth * 4 + i] =
                        monolithArray[writtenLines * renderWidth * 4 + i];
                } else {
                    displayArray[writtenLines * renderWidth * 4 + i] =
                        landscapeArray[writtenLines * renderWidth * 4 + i];
                }
            }
        }
        writtenLines++;
    }
    preEncodeSpecialK(displayArray, renderWidth, renderHeight);
    let end = performance.now();
    console.log('assemble: ' + Math.floor(end - start) + ' ms');
    return displayArray;
}
