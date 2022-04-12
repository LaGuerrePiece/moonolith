import landscapeJSON from './landscapeBis.json';
import monolithJSON from './monolith.json';
import { preEncodeSpecialK } from '../utils/image-manager';

function getArrays(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    let landscapeArray = [];
    let monolithArray = [];
    for (let y = 0; y < renderHeight; y++) {
        let currentLineStart = (nbLine - renderHeight - viewPosY + y) * 4 * nbColumns;
        for (let x = 0; x < renderWidth * 4; x++) {
            let currentColumnStart = (nbColumns - renderWidth - viewPosX + x) * 4;
            landscapeArray.push(landscapeJSON[x + currentLineStart]);
            monolithArray.push(monolithJSON[x + currentLineStart]);
        }
    }
    return { monolithArray, landscapeArray };
}

export function assemble(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    // ................      256,     400,           256,        400,       0,      0
    let displayArray = [];
    let { monolithArray, landscapeArray } = getArrays(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY);
    let writtenLines = 0;
    while (writtenLines < renderHeight * 4) {
        let currentLine = viewPosY + renderHeight - writtenLines;

        if (currentLine < 20) {
            //bot
            for (let i = 0; i < renderWidth * 4; i++) {
                displayArray[writtenLines * renderWidth * 4 + i] = landscapeArray[writtenLines * renderWidth * 4 + i];
            }
        } else if (currentLine > nbLine - 34) {
            // top
            for (let i = 0; i < renderWidth * 4; i++) {
                displayArray[writtenLines * renderWidth * 4 + i] = landscapeArray[writtenLines * renderWidth * 4 + i];
            }
        } else {
            //mid
            for (let i = 0; i < renderWidth * 4; i++) {
                if (i >= 47 * 4 && i < 196 * 4) {
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
    return displayArray;
}
