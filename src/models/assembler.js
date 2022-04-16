import landscapeJSON from './JSON/landscapeBis.json';
import monolithJSON from './JSON/monolith.json';
import Klon from './klon';
import { monolith } from './monolith';
import { preEncodeSpecialK } from '../utils/image-manager';

//let monolith
let landscape = convert(Object.values(landscapeJSON));

// TAKES JSON ARRAY AND RETURNS ARRAY OF RIGHT SIZE
export function getArrays(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    let landscapeArray = [];
    let monolithArray = [];
    for (let y = 0; y < renderHeight; y++) {
        let currentLineStart = (nbLine - renderHeight - viewPosY + y) * nbColumns;
        for (let x = 0; x < renderWidth; x++) {
            //let currentColumnStart = (nbColumns - renderWidth - viewPosX + x) * 4;
            landscapeArray.push(landscape[x + currentLineStart]);
            monolithArray.push(monolith[x + currentLineStart]);
        }
    }
    // console.log('landscapeArray', landscapeArray);
    // console.log('monolithArray', monolithArray);
    return { monolithArray, landscapeArray };
}

export function assemble(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    // ................      256,     400,           256,        400,       0,      0
    let displayArray = [];
    let { monolithArray, landscapeArray } = getArrays(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY);
    let writtenLines = 0;
    while (writtenLines < renderHeight) {
        let currentLine = viewPosY + renderHeight - writtenLines;

        if (currentLine < 20) {
            //bot
            for (let i = 0; i < renderWidth; i++) {
                displayArray[writtenLines * renderWidth + i] = landscapeArray[writtenLines * renderWidth + i];
            }
        } else if (currentLine > nbLine - 34) {
            // top
            for (let i = 0; i < renderWidth; i++) {
                displayArray[writtenLines * renderWidth + i] = landscapeArray[writtenLines * renderWidth + i];
            }
        } else {
            //mid
            for (let i = 0; i < renderWidth; i++) {
                if (i >= 47 && i < 196) {
                    displayArray[writtenLines * renderWidth + i] = monolithArray[writtenLines * renderWidth + i];
                } else {
                    displayArray[writtenLines * renderWidth + i] = landscapeArray[writtenLines * renderWidth + i];
                }
            }
        }
        writtenLines++;
    }
    //preEncodeSpecialK(displayArray, renderWidth, renderHeight);
    return displayArray;
}

//Conversion d'un array JSON en array RGB
export function convert(data) {
    let convertedData = [];
    for (let i = 0; i < data.length; i += 4) {
        convertedData.push([data[i] / 255, data[i + 1] / 255, data[i + 2] / 255]);
    }
    //Cette étape crée un array de Klon avec les bons index
    // convertedData = [...Array(convertedData.length).keys()].map((index) => [index, convertedData[index]]);
    // convertedData = convertedData.map(
    //     (indexandcolor) => new Klon(indexandcolor[1], Klon.USERPAINTED, type, indexandcolor[0])
    // );
    //console.log('convertedData', convertedData);
    return convertedData;
}
