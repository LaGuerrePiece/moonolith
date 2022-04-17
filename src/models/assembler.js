import landscapeJSON from '../assets/JSON/landscapeBis.json';
import monolithJSON from '../assets/JSON/monolith.json';
import { preEncodeSpecialK } from '../utils/image-manager';
import { assembleLandscape } from './landscape';

let marginBot = 30;
let marginTop = 34;
let marginLeft = 47;
let marginRight = 60;

async function getArrays(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    let landscapeArrayAssemble = await assembleLandscape(
        renderWidth,
        renderHeight,
        nbColumns,
        nbLine,
        viewPosX,
        viewPosY
    );
    let landscapeArrayRedux = [];
    let monolithArrayRedux = [];
    for (let y = 0; y < renderHeight; y++) {
        let currentLinePosStart = (nbLine - renderHeight - viewPosY + y) * 4 * nbColumns;
        for (let x = 0; x < renderWidth * 4; x++) {
            let currentColumnPosStart = viewPosX * 4 + x;
            landscapeArrayRedux.push(landscapeArrayAssemble[currentColumnPosStart + currentLinePosStart]);
            monolithArrayRedux.push(monolithJSON[currentColumnPosStart + currentLinePosStart]);
        }
    }
    return { landscape: landscapeArrayRedux, monolith: monolithArrayRedux };
}

export function assemble(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    // console.log(
    //     'renderWidth', // 256
    //     renderWidth,
    //     'renderHeight', // 362
    //     renderHeight,
    //     'nbColumns', // 256
    //     nbColumns,
    //     'nbLine', // 362
    //     nbLine,
    //     'viewPosX', // 0
    //     viewPosX,
    //     'viewPosY', // 0
    //     viewPosY
    // );
    let startAssemble = performance.now();
    let displayArray = [];
    getArrays(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY).then((res) => {
        let { landscape, monolith } = res;
        let endGetArray = performance.now();
        let writtenLines = 0;
        while (writtenLines < renderHeight) {
            let currentLine = viewPosY + renderHeight - writtenLines;

            if (currentLine < marginBot) {
                //bot
                for (let i = 0; i < renderWidth * 4; i++) {
                    displayArray[writtenLines * renderWidth * 4 + i] = landscape[writtenLines * renderWidth * 4 + i];
                }
            } else if (currentLine > nbLine - marginTop) {
                // top
                for (let i = 0; i < renderWidth * 4; i++) {
                    displayArray[writtenLines * renderWidth * 4 + i] = landscape[writtenLines * renderWidth * 4 + i];
                }
            } else {
                //mid
                for (let i = 0; i < renderWidth * 4; i++) {
                    if (i >= (marginLeft - viewPosX) * 4 && i < (nbColumns - marginRight - viewPosX) * 4) {
                        displayArray[writtenLines * renderWidth * 4 + i] = monolith[writtenLines * renderWidth * 4 + i];
                    } else {
                        displayArray[writtenLines * renderWidth * 4 + i] =
                            landscape[writtenLines * renderWidth * 4 + i];
                    }
                }
            }
            writtenLines++;
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

        preEncodeSpecialK(displayArray, renderWidth, renderHeight);

        // pour tester uniquement Landscape
        // assembleLandscape(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY).then((res) => {
        //     preEncodeSpecialK(res, renderWidth, renderHeight);
        // });

        return displayArray;
    });
}
