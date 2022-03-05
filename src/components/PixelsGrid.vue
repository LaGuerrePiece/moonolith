<template></template>

<script setup>
// Imports pour vue 3
import { reactive, onMounted, toRefs } from "vue";

// Imports des composants
import Grid from "../models/grid";
import Klon from "../models/klon";

// Imports des fonctionnalités
import { fetchImgur } from "../utils/network";
import { decode, getHighLow, preEncode } from "../utils/image-manager";

// Definition des props
const props = defineProps({
    tool: Number,
});

// Gestion de la grille
let grid = new Grid(128, 256);
onMounted(async () => {
    grid.initialize(document.body);

    grid.draw_pixel(2, 2, new Klon([0, 1, 0], 2));
    grid.draw_pixel(2, 2, new Klon([1, 0, 0], 1));

    grid.draw_pixel(3, 3, new Klon([1, 0, 0], 1));
    grid.draw_pixel(3, 4, new Klon([0.5, 0.2, 0.5], 1));
    grid.draw_pixel(4, 3, new Klon([1, 0, 0], 1));
    grid.draw_pixel(4, 4, new Klon([1, 0, 0], 1));
    grid.draw_pixel(6, 13, new Klon([1, 1, 0], 1));
    grid.draw_pixel(6, 14, new Klon([1, 1, 0], 1));
    grid.draw_pixel(7, 13, new Klon([0.5, 0.6, 0.2], 1));
    grid.draw_pixel(7, 14, new Klon([1, 1, 0], 1));

    await Promise.all([
        displayImage(grid, "https://i.imgur.com/qAhwWr9.png", 20, 15),
        displayImage(grid, "https://i.imgur.com/Lbd2bji.png", 170, 10), //image test 3x3
        displayImage(grid, "https://i.imgur.com/iWJ9P2S.png", 140, 7), //image test 3x3 n2
        displayImage(grid, "https://i.imgur.com/Eq4ajRS.png", 120, 5), //image test 4x4
        displayImage(grid, "https://i.imgur.com/bAInSyz.png", 12, 15), //image test 5x5
    ]);
});

// try {
//     let test = preEncode(grid).then((res) => console.log(res));
// } catch (e) {
//     console.error(e);
// }

async function displayImage(grid, url, offsetx, offsety) {
    let image = await fetchImgur(url).catch(console.error);
    let decoded;
    if (image) decoded = await decode(image).catch(console.error);
    if (decoded) {
        let array = decoded.data;
        let width = decoded.width;
        let height = decoded.height;
        for (let y = 0; y < width; y++) {
            for (let x = 0; x < height; x++) {
                let idx = (width * y + x) * 4;
                if (array[idx + 3] != 0)
                    grid.draw_pixel(x + offsetx, y + offsety, new Klon([array[idx] / 255, array[idx + 1] / 255, array[idx + 2] / 255], Klon.PAID) );
            }
        }
    }
}

</script>

<style>
</style>