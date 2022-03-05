<template></template>

<script setup>
import Grid from "../models/grid";
import Klon from "../models/klon";

import { fetchImgur } from "../utils/network"
import { decode, getHighLow, preEncode } from "../utils/image-manager"
import { reactive, onMounted } from "vue";

// const pixelsNoice = ref([]);
// const pixelsData = ref([]);
// const pixels = ref([]);

let grid = new Grid(128, 256)

grid.initialize(document.body)

grid.draw_pixel(2, 2, new Klon([0,1,0], 2))
grid.draw_pixel(2, 2, new Klon([1,0,0], 1))

grid.draw_pixel(3, 3, new Klon([1,0,0], 1))
grid.draw_pixel(3, 4, new Klon([1,0,0], 1))
grid.draw_pixel(4, 3, new Klon([1,0,0], 1))
grid.draw_pixel(4, 4, new Klon([1,0,0], 1))
grid.draw_pixel(6, 13, new Klon([1,1,0], 1))
grid.draw_pixel(6, 14, new Klon([1,1,0], 1))
grid.draw_pixel(7, 13, new Klon([1,1,0], 1))
grid.draw_pixel(7, 14, new Klon([1,1,0], 1))

await Promise.all([
    displayImage("https://i.imgur.com/qAhwWr9.png", 20, 15),
    displayImage("https://i.imgur.com/Lbd2bji.png", 170, 10), //image test 3x3 
    displayImage("https://i.imgur.com/iWJ9P2S.png", 140, 7), //image test 3x3 n2
    displayImage("https://i.imgur.com/Eq4ajRS.png", 120, 5), //image test 4x4
    displayImage("https://i.imgur.com/bAInSyz.png", 12, 15), //image test 5x5
])

try {
let test = preEncode(grid).then(res => console.log(res))
} catch(e) { console.error(e) }

async function displayImage(url, offsetx, offsety) {
    let image = await fetchImgur(url).catch(console.error)
    let decoded 
    if(image)   
        decoded = await decode(image).catch(console.error)
    if(decoded) {
        let array = decoded.data;
        let width = decoded.width
        let height = decoded.height
        for (let y = 0; y < width; y++) {
            for (let x = 0; x < height; x++) {
                let idx = (width * y + x) * 4;
                if (array[idx + 3] != 0)
                    grid.draw_pixel(x + offsetx, y + offsety, new Klon([array[idx]/255, array[idx + 1]/255, array[idx + 2]/255], Klon.PAID));
            }
        }
        // array.forEach((bit, i) => {
        //     grid.draw_pixel(i% grid.nbColumns + offsetx, Math.floor(i/grid.nbColumns) + offsety, new Klon([array[idx]/255, array[idx + 1]/255, array[idx + 2]/255], 2));
        // });
        // for(let i = 0; i < width * height * 4; i++){
        //     let idx = i *4;
        //     // if (array[idx + 3] != 0)
        //         grid.draw_pixel(idx % grid.nbColumns + offsetx, Math.floor(idx/grid.nbColumns) + offsety, new Klon([array[i]/255, array[i+1]/255, array[i+2]/255], 2));
            
        // }
        // for(let i = 0; i < width * height; i++){
        //     grid.draw_pixel(i % grid.nbColumns + offsetx, Math.floor(i/grid.nbColumns) + offsety, new Klon([array[i]/255, array[i++]/255, array[i++]/255], 2))
        // }
    }
}

</script>

<style>
</style>