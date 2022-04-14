import floor from '../assets/landscape/1_floor.png';
// import hills from '../assets/landscape/2_hills.png';
// import mountains from '../assets/landscape/3_mountains.png';
// import sky from '../assets/landscape/4_sky.png';
import { preEncodeSpecialK } from '../utils/image-manager';

let floorBlob = new Blob(['../assets/landscape/1_floor.png'], { type: 'image/png' });
let hillsBlob = new Blob(['../assets/landscape/2_hills.png'], { type: 'image/png' });
let mountainsBlob = new Blob(['../assets/landscape/3_mountains.png'], { type: 'image/png' });
let skyBlob = new Blob(['../assets/landscape/4_sky.png'], { type: 'image/png' });

import floorJSON from '../assets/JSON/1_floor.json';
import hillsJSON from '../assets/JSON/2_hills.json';
import mountainsJSON from '../assets/JSON/3_mountains.json';
import skyJSON from '../assets/JSON/4_sky.json';

import { decode } from '../utils/image-manager';

let layers = [
    { file: skyJSON, startY: 400, parallax: 0.2, name: 'sky' },
    // { file: mountainsJSON, startY: 200, parallax: 0.45, name: 'mountains' },
    // { file: hillsJSON, startY: 80, parallax: 0.7, name: 'hills' },
    { file: floorJSON, startY: 25, parallax: 1, name: 'floor' },
];

export function assembleLandscape(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    console.log('input :', renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY);
    let landscapeArray = [];
    for (let layer in layers) {
        let currentFile = layers[layer].file;
        let currentFileLength = Object.keys(currentFile).length;
        console.log(currentFileLength);
        let writtenLines = 0;
        for (let i = 0; i < renderHeight * renderWidth * 4; i++) {
            while (writtenLines < renderHeight * 4) {
                if (currentFile[writtenLines * renderWidth * 4 + i] !== undefined) {
                    landscapeArray[writtenLines * renderWidth * 4 + i + layers[layer].startY * nbColumns] =
                        currentFile[writtenLines * renderWidth * 4 + i];
                }
                writtenLines++; 
            }
        }
    }
    console.log('output :', landscapeArray);
    return landscapeArray;
    // const readImageBuffer = (img) =>
    //     new Promise((resolve, reject) => {
    //         let reader = new FileReader();
    //         reader.readAsArrayBuffer(img);
    //         reader.onload = () => resolve(reader.result);
    //         reader.onerror = (error) => reject(error);
    //     });

    // readImageBuffer(floor).then((res) => {
    //     console.log('res', res);
    //     test(res).catch(console.error);
    // });

    // async function test(arrayBuffer) {
    //     let decoded;
    //     decoded = await decode(arrayBuffer, 'autrice').catch(console.error);
    //     if (!decoded) return;
    //     console.log('decoded', decoded);
    // }
}
