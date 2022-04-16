import { preEncodeSpecialK, _base64ToArrayBuffer, decode, toRGBA8 } from '../utils/image-manager';

import landscapeBase64 from '../assets/data.js';

let import64 = async (base64data) => {
    let startImport = performance.now();
    let decoded = await decode(_base64ToArrayBuffer(base64data)).catch(console.error);
    let b64_floor = toRGBA8(decoded);
    let endImport = performance.now();
    return { buffer: b64_floor, perf: Math.floor(endImport - startImport) };
};

export async function assembleLandscape(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    console.log('------------------------------------------------------');
    var landscapeArray = [];
    let randomPos = Math.floor(Math.random() * 40);
    // console.log('randomPos', randomPos);
    let start64 = performance.now();
    for (let layer in landscapeBase64) {
        let startLayer = performance.now();
        let thisLayer = landscapeBase64[layer];
        let parallaxOffset = Math.floor(thisLayer.parallax * viewPosY);
        let offset = (nbLine - thisLayer.height - thisLayer.startY + parallaxOffset) * nbColumns * 4;
        // console.log(`offset ${thisLayer.name}`, offset);
        await import64(thisLayer.base64).then((res) => {
            for (let i = 0; i < res.buffer.length; i++) {
                if (i % 4 === 0 && res.buffer[i + 3] === 0) {
                    // checks 4th array and if it's 0 (transparent), skips the group
                    i += 3;
                    continue;
                }
                landscapeArray[i + offset] = res.buffer[i];
            }
            // console.log(
            //     `${thisLayer.name} | Parallax : ${thisLayer.parallax} | Height : ${thisLayer.height} | StartY : ${
            //         thisLayer.startY
            //     } | Parallax Offset : ${parallaxOffset} | Full Offset ${offset / nbColumns / 4}| Import : ${
            //         res.perf
            //     } ms, total :`,
            //     Math.floor(performance.now() - startLayer),
            //     'ms'
            // );
        });
    }
    let end64 = performance.now();
    console.log('BASE64 TOTAL :', Math.floor(end64 - start64), 'ms');
    // console.log('------------------------------------------------------');
    return landscapeArray;
}
