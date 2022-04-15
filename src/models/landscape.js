import { preEncodeSpecialK, _base64ToArrayBuffer, decode, toRGBA8 } from '../utils/image-manager';

import landscapeBase64 from '../assets/data.js';


let import64 = async (base64data) => {
    let decoded = await decode(_base64ToArrayBuffer(base64data)).catch(console.error);
    let b64_floor = toRGBA8(decoded);
    return b64_floor;
};

export async function assembleLandscape(renderWidth, renderHeight, nbColumns, nbLine, viewPosX, viewPosY) {
    console.log('------------------------------------------------------');
    let landscapeArray = [];
    let start64 = performance.now();
    for (let layer in landscapeBase64) {
        let start3 = performance.now(); // benchmark
        await import64(landscapeBase64[layer].base64).then((buffer) => {
            for (let i = 0; i < buffer.length; i++) {
                landscapeArray[i] = buffer[i];
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
    console.log('------------------------------------------------------');
    
    return landscapeArray;
}
