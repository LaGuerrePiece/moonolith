<template></template>

<script setup>
// Imports pour vue 3
import { reactive, onMounted, toRefs, watch, ref } from "vue";

// Imports des composants
import Grid from "../models/grid";
import Klon from "../models/klon";

// Imports des fonctionnalités
import { fetchImgur } from "../utils/network";
import { decode, getHighLow, preEncode } from "../utils/image-manager";
import mousePosition from "mouse-position"
import Tool from "../models/tools";

// Definition des props
const props = defineProps({
    tool: Number,
});
const oldMousePosition = reactive({
    x: null,
    y: null
})

watch(() => props.tool, (code) => {
    console.log("watch tool ", code)
    if(code === Tool.DONE) {
        // stopUsingTool()
        document.onmousedown = null
        document.onmousemove = null  
    } else {
        document.onmouseup = stopUsingTool
        document.onmousedown = startUsingTool
    }
})

// Gestion de la grille
let grid = new Grid(128, 256);
grid.initialize(document.body);
const position = ref(mousePosition(grid.pixels.canvas))

onMounted(async () => {

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

function useTool(e) {
    if(props.tool === Tool.DONE) return
    let newMousePosition = mousePositionInGrid(e)
    if(newMousePosition.x === oldMousePosition.x && newMousePosition.y === oldMousePosition.y) return
    // console.log("useTool", newMousePosition, props.tool) 

    switch(props.tool) {
        case Tool.PEN:
            grid.draw_pixel(newMousePosition.x, newMousePosition.y, new Klon([1,0,0], Klon.PAINTED))
            break
        case Tool.ERASER:
            grid.erase_pixel(newMousePosition.x, newMousePosition.y)
            break
    }
}

function startUsingTool() {
    console.log("startUsingTool")
    document.onmousedown = restartUsingTool
    document.onmousemove = useTool  
}

function restartUsingTool() {
    console.log("restartUsingTool")
    document.onmousemove = useTool      
}

function stopUsingTool() {
    console.log("stopUsingTool")
    // document.onmousedown = null
    document.onmousemove = null    
}

function mousePositionInGrid() {
    let screenx = document.documentElement.clientWidth;
    let screeny = document.documentElement.clientHeight;
    let pixelSize = screenx / grid.nbColumns;
    let nbPixely = screeny / pixelSize;
    let x = Math.floor((position.value[0] / screenx) * grid.nbColumns);
    let y = Math.floor((position.value[1] / screeny) * nbPixely);
    return {x,y}
}

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