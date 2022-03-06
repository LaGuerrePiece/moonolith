<template></template>

<script setup>
// Imports pour vue 3
import { reactive, onMounted, toRefs, watch, ref } from "vue";

// Imports des composants
import Grid from "../models/grid";
import Klon from "../models/klon";

// Imports des fonctionnalités
import { fetchImgur } from "../utils/network";
import { decode, getHighLow, preEncode, _base64ToArrayBuffer, toRGBA8 } from "../utils/image-manager";
import mousePosition from "mouse-position"
import Tool from "../models/tools";
import { chunkCreator, getChunk, getSupply } from "../utils/web3";

// Definition des props
const props = defineProps({
    tool: Number,
    color: String,
    hasBought: Number
});
const oldMousePosition = reactive({
    x: null,
    y: null
})




// Gestion de la grille
let grid = new Grid(128, 256);
grid.initialize(document.body);
let canvas = grid.pixels.canvas
const position = ref(mousePosition(canvas))

watch(() => props.tool, (code) => {
    console.log("watch tool ", code)
    if (code === Tool.DONE) {
        // stopUsingTool()
        canvas.onmousedown = null
        canvas.onmousemove = null
    } else {
        canvas.onmouseup = stopUsingTool
        canvas.onmousedown = startUsingTool
    }
})


watch(() => props.hasBought, (good) => {                //FONCTION APPELÉE
    // window.ethereum.enable()
    preEncode(grid).then((res) => 
    {
        chunkCreator(res)
        }
    );
    props.hasBought = 0
})



onMounted(async () => {

    // grid.draw_pixel(2, 2, new Klon([0, 1, 0], 2));
    // grid.draw_pixel(2, 2, new Klon([1, 0, 0], 1));
    // grid.draw_pixel(3, 3, new Klon([1, 0, 0], 1));
    // grid.draw_pixel(3, 4, new Klon([0.5, 0.2, 0.5], 1));
    // grid.draw_pixel(4, 3, new Klon([1, 0, 0], 1));
    // grid.draw_pixel(4, 4, new Klon([1, 0, 0], 1));
    // grid.draw_pixel(6, 13, new Klon([1, 1, 0], 1));
    // grid.draw_pixel(6, 14, new Klon([1, 1, 0], 1));
    // grid.draw_pixel(7, 13, new Klon([0.5, 0.6, 0.2], 1));
    // grid.draw_pixel(7, 14, new Klon([1, 1, 0], 1));

    getSupply().then(async (supply) => {
        let s = supply.toNumber()
        // console.log(s)
        for (let i = 1; i <= s; i++) {
            getChunk(i).then((res)=> {
                // console.log(res)
                let index = res[0].toNumber()
                // console.log("index loaded ", res[0].toNumber())
                // console.log("column", grid.nbColumns)
                let x = index % grid.nbColumns
                let y = Math.floor(index / grid.nbColumns)
                // console.log("xy", x, y)
                console.log('res[3]', res[3])
                let arrBuffer = _base64ToArrayBuffer(res[3]) // devrait etre equivalent a fetchUr
                displayImageFromArrayBuffer(grid, arrBuffer, x, y)
            })
        }
    })
    
    await Promise.all([
        //displayImageFromUrl(grid, "https://i.imgur.com/qAhwWr9.png", 20, 15),
        //displayImageFromUrl(grid, "https://i.imgur.com/Lbd2bji.png", 170, 10), //image test 3x3
        //displayImage(grid, "https://i.imgur.com/iWJ9P2S.png", 140, 7), //image test 3x3 n2
        //displayImage(grid, "https://i.imgur.com/Eq4ajRS.png", 120, 5), //image test 4x4
        //displayImage(grid, "https://i.imgur.com/bAInSyz.png", 12, 15), //image test 5x5
    ])
});



function useTool() {
    if (props.tool === Tool.DONE) return
    let newMousePosition = mousePositionInGrid()
    if (newMousePosition.x === oldMousePosition.x && newMousePosition.y === oldMousePosition.y) return

    switch (props.tool) {
        case Tool.PEN:
            grid.draw_pixel(newMousePosition.x, newMousePosition.y, new Klon(props.color, Klon.PAINTED))
            break
        case Tool.ERASER:
            grid.erase_pixel(newMousePosition.x, newMousePosition.y)
            break
        case Tool.TEXT:
            console.log('VUCTIURE')
            break
    }
}

function startUsingTool() {
    // console.log("startUsingTool")
    canvas.onmousedown = restartUsingTool
    canvas.onmousemove = useTool
}

function restartUsingTool() {
    // console.log("restartUsingTool")
    canvas.onmousemove = useTool
}

function stopUsingTool() {
    // console.log("stopUsingTool")
    // document.onmousedown = null
    canvas.onmousemove = null
}

function mousePositionInGrid() {
    let screenx = document.documentElement.clientWidth;
    let screeny = document.documentElement.clientHeight;
    let pixelSize = screenx / grid.nbColumns;
    let nbPixely = screeny / pixelSize;
    let x = Math.floor((position.value[0] / screenx) * grid.nbColumns);
    let y = Math.floor((position.value[1] / screeny) * nbPixely);
    return { x, y }
}

async function displayImageFromArrayBuffer(grid, arrayBuffer, offsetx, offsety) {
    let decoded;
    console.log("arrayBuffer du displayImage", arrayBuffer)
    decoded = await decode(arrayBuffer).catch(console.error)
    console.log('decoded du displayImage', decoded)
    displayDecodedToImage(decoded, grid, offsetx, offsety)
}

async function displayImageFromUrl(grid, url, offsetx, offsety) { // a fix
    let image = await fetchImgur(url).catch(console.error);
    console.log("image", image)
    let decoded;
    if (image) decoded = await decode(image).catch(console.error);
    displayDecodedToImage(decoded, grid, offsetx, offsety)
}

function displayDecodedToImage(decoded, grid, offsetx, offsety)
{
    if (decoded) {
        let array = toRGBA8(decoded);
        console.log("arrayPixel RECU", array)
        let width = decoded.width;
        let height = decoded.height;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let idx = (width * y + x) * 4;
                if (array[idx + 3] != 0)
                    grid.draw_pixel(x + offsetx, y + offsety, new Klon([array[idx] / 255, array[idx + 1] / 255, array[idx + 2] / 255], Klon.PAID));
            }
        }
    }
}

</script>

<style>
</style>