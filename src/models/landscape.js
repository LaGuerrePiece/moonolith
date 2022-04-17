import { preEncodeSpecialK, _base64ToArrayBuffer, decode, toRGBA8 } from '../utils/image-manager';

import landscapeBase64 from '../assets/data.js';

let import64 = async (base64data) => {
    let startImport = performance.now();
    let decoded = await decode(_base64ToArrayBuffer(base64data)).catch(console.error);
    let b64_floor = toRGBA8(decoded);
    let endImport = performance.now();
    return { buffer: b64_floor, perf: endImport - startImport };
};

export async function assembleLandscape(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    let start64 = performance.now();
    var landscapeArray = [];
    let layerCount = 0,
        layerLines = 0,
        importPerf = 0;
    for (let layer in landscapeBase64) {
        let startLayer = performance.now();
        let thisLayer = landscapeBase64[layer];
        let parallaxOffset = Math.floor(thisLayer.parallax * viewPosY);
        if (thisLayer.startY - thisLayer.height - parallaxOffset > viewPosY + renderHeight) continue; // If the layer above render, skip it
        if (nbLine - thisLayer.startY + parallaxOffset > nbLine - viewPosY) continue; // If the layer under render, skip it
        let offset = (nbLine - thisLayer.startY + parallaxOffset) * nbColumns * 4;
        layerCount++;
        layerLines += thisLayer.height;
        await import64(thisLayer.base64).then((res) => {
            let buffer = res.buffer;
            importPerf += res.perf;
            for (let i = 0; i < buffer.length; i++) {
                if (i % 4 === 0 && buffer[i + 3] === 0) {
                    // checks 4th array and if it's 0 (transparent), skips the group
                    i += 3;
                    continue;
                }
                landscapeArray[i + offset] = buffer[i];
            }
        });
    }
    let end64 = performance.now();
    // console.log(
    //     'Nb of Layers : ',
    //     layerCount,
    //     '| Nb of lines : ',
    //     layerLines,
    //     ' | ',
    //     Math.floor(end64 - start64),
    //     'ms | Import :',
    //     Math.floor(importPerf * 10) / 10,
    //     'ms | lines/ms : ',
    //     Math.floor((layerLines / (end64 - start64)) * 100) / 100
    // );
    return landscapeArray;
}
