import { preEncodeSpecialK, _base64ToArrayBuffer, decode, toRGBA8 } from '../utils/image-manager';

import landscapeBase64 from '../assets/data.js';

import floorJSON from '../assets/JSON/1_floor.json';
import hillsJSON from '../assets/JSON/2_hills.json';
import mountainsJSON from '../assets/JSON/3_mountains.json';
import skyJSON from '../assets/JSON/4_sky.json';

// let start = performance.now();
// fetch('./landscape/1_floor.png')
//     .then((res) => res.blob()) // Gets the response and returns it as a blob
//     .then((blob) => {
//         const reader = new FileReader(blob);
//         reader.readAsDataURL(blob);
//         reader.onloadend = async function () {
//             let base64data = reader.result.split(',')[1];
//             let decoded = await decode(_base64ToArrayBuffer(base64data)).catch(console.error);
//             let ls_floor = toRGBA8(decoded);
//             let end = performance.now();
//             console.log(`decode Fetch floor took ${Math.floor(end - start)} milliseconds.`);
//             // console.log('ls_floor', ls_floor);
//         };
//     });

let start2 = performance.now();
let import64 = async (base64data) => {
    let decoded = await decode(_base64ToArrayBuffer(base64data)).catch(console.error);
    let b64_floor = toRGBA8(decoded);
    let end2 = performance.now();
    // console.log(`decode 64 floor took ${Math.floor(end2 - start2)} milliseconds.`);
    // console.log('b64_floor', b64_floor);
    return b64_floor;
};
import64(landscapeBase64.floor_1.base64);

var layers = [
    { file: skyJSON, startY: 400, parallax: 0.2, name: 'sky' },
    { file: mountainsJSON, startY: 200, parallax: 0.45, name: 'mountains' },
    { file: hillsJSON, startY: 80, parallax: 0.7, name: 'hills' },
    { file: floorJSON, startY: 25, parallax: 1, name: 'floor' },
];

export async function assembleLandscape(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    let landscapeArrayJSON = [];
    let landscapeArrayBase64 = [];

    let startJSON = performance.now();
    for (let layer in layers) {
        let start = performance.now(); // benchmark
        let currentFile = layers[layer].file;
        let currentFileLength = Object.keys(currentFile).length;
        for (let i = 0; i < currentFileLength; i++) {
            landscapeArrayJSON[i] = currentFile[i];
        }
        let end = performance.now();
        console.log(
            `JSON : ${layers[layer].name} | length : ${currentFileLength} | performance : ${Math.floor(end - start)} ms`
        );
    }
    let endJSON = performance.now();
    console.log(`JSON TOTAL : ${Math.floor(endJSON - startJSON)} ms`);

    let start64 = performance.now();
    for (let layer in landscapeBase64) {
        let start3 = performance.now(); // benchmark
        await import64(landscapeBase64[layer].base64).then((buffer) => {
            for (let i = 0; i < buffer.length; i++) {
                landscapeArrayBase64[i] = buffer[i];
            }
            let end3 = performance.now();
            console.log(
                `BASE64 : ${landscapeBase64[layer].name} | length : ${buffer.length} | performance : ${Math.floor(
                    end3 - start3
                )} ms`
            );
        });
    }
    let end64 = performance.now();
    console.log(`BASE64 TOTAL : ${Math.floor(end64 - start64)} ms`);
    console.log('output landscapeArrayBase64 :', landscapeArrayBase64);
    console.log('output landscapeArrayJSON :', landscapeArrayJSON);
    
    return landscapeArrayBase64;
}
