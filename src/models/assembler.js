import landscapeJSON from './landscape.json';
import monolithJSON from './monolith.json';
import { preEncodeSpecialK } from '../utils/image-manager';

function GUI(width, height, viewPos) {
    let GUIArray = [];
    for (let i in GUIJSON) GUIArray.push(GUIJSON[i]);
    return GUIArray;
}

function monolith(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    let monolithArray = [];
    for (let y = 0; y < renderHeight; y++) {
        let currentLineStart = (nbLine - renderHeight - viewPosY + y) * 4 * nbColumns;
        for (let x = 0; x < renderWidth * 4; x++) {
            monolithArray.push(monolithJSON[x + currentLineStart]);
        }
    }
    return monolithArray;
}

function landscape(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    let landscapeArray = [];
    for (let y = 0; y < renderHeight; y++) {
        let currentLineStart = (nbLine - renderHeight - viewPosY + y) * 4 * nbColumns;
        for (let x = 0; x < renderWidth * 4; x++) {
            landscapeArray.push(landscapeJSON[x + currentLineStart]);
        }
    }
    return landscapeArray;
}

export function assemble(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    // ................      256,     400,           256,        400,       0,      0
    let displayArray = [];
    let writtenLines = 0;
    while (writtenLines < renderHeight * 4) {
        let currentLine = viewPosY + renderHeight - writtenLines;
        let landscapeArray = landscape(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY);
        let monolithArray = monolith(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY);
        // for (let i = 0; i < renderWidth * 4; i++) {
        //             displayArray[writtenLines * nbColumns + i] = landscapeArray[writtenLines * nbColumns + i];
        //         }

        if (currentLine < 32) {
            // console.log('bot');
            for (let i = 0; i < renderWidth * 4; i++) {
                displayArray[writtenLines * nbColumns * 4 + i] = landscapeArray[writtenLines * nbColumns * 4 + i];
            }
        } else if (currentLine > nbLine - 48) {
            // console.log('top');
            for (let i = 0; i < renderWidth * 4; i++) {
                displayArray[writtenLines * nbColumns * 4 + i] = landscapeArray[writtenLines * nbColumns * 4 + i];
            }
        } else {
            // console.log('mid');
            for (let i = 0; i < renderWidth * 4; i++) {
                if (i > 51 * 4) {
                    if (currentLine == 50) console.log(i);
                    displayArray[writtenLines * nbColumns * 4 + i] = monolithArray[writtenLines * nbColumns * 4 + i];
                } else if (i <= 51 * 4) {
                    displayArray[writtenLines * nbColumns * 4 + i] = landscapeArray[writtenLines * nbColumns * 4 + i];
                }
            }
        }
        writtenLines++;
    }
    preEncodeSpecialK(displayArray, renderWidth, renderHeight);
    return displayArray;
}
