<template></template>

<script setup>
// Imports pour vue 3
import { reactive, onMounted, toRefs, watch, ref } from 'vue';

// Imports des composants
import Grid from '../models/grid';
import Klon from '../models/klon';

// Imports des fonctionnalités
import { fetchImgur } from '../utils/network';
import { decode, getHighLow, preEncode, _base64ToArrayBuffer, toRGBA8, gridToArray } from '../utils/image-manager';
import mousePosition from 'mouse-position';
import Tool from '../models/tools';
import { chunkCreator, getChunk, getSupply, getTotalPixs } from '../utils/web3';

// Definition des props
const props = defineProps({
    tool: Number,
    color: String,
    hasBought: Object,
    onDelete: Object,
    onAddRow: Object,
});

const emit = defineEmits(['boughtBack', 'deleteBack']);


watch(
    () => props.onDelete.value,
    (deleteInstance) => {
        if (deleteInstance === 1) {
            console.log('SUPPRESSION!');
            gridArray.forEach(g => g.delete_user_pixel());
        }
        emit('deleteBack');
    }
);

var gridArray = []
var divArray = []
var id;
let position;
const nbColonne = 128;
const gridsHeight = 100;
const nbGrids = 3;
const oldMousePosition = reactive({
    x: null,
    y: null,
    z: null,
});
window.scroll(0, 2000);
// setInterval(() => {
//     console.log("VERIFICATION")
//     console.log(window.scrollY)
//     var firstGridToLoad = Math.floor(window.scrollY / (gridsHeight*11))
//     var secondGridToLoad = firstGridToLoad + 1
//     if (firstGridToLoad == 9) {
//         firstGridToLoad = 8
//         secondGridToLoad = 9
//     }
//     loadgrid(firstGridToLoad)
//     loadgrid(secondGridToLoad)
//     //console.log(firstGridToLoad, secondGridToLoad)

// }, 3000,);

const firstGridLookedAt = Math.floor(window.scrollY / (100 * 11));
console.log('grids being seen :', firstGridLookedAt, firstGridLookedAt + 1)

getTotalPixs().then(async (total) => {
    let leNombreMagiqueVenuDeLaBlockchain = total.toNumber();
    //console.log(leNombreMagiqueVenuDeLaBlockchain)
    const offsetFormule = nbColonne * 64;
    const pourcentage = 1.3;
    const formuleDeLaMort = offsetFormule + leNombreMagiqueVenuDeLaBlockchain * pourcentage;
    const nbLine = Math.floor(formuleDeLaMort / 128);
    // Gestion de la grille
    for (let i = 0; i < 5; i++) {
        divArray[i] = document.createElement('div');
        divArray[i].id = "canvasContainer"
        divArray[i].classList.add(i);
        divArray[i].style.cssText = 'height:100%';
        // elemDiv.style.cssText = 'position:absolute;width:100%;height:100%;opacity:0.3;background:#000;';
        document.body.appendChild(divArray[i]);

        gridArray[i] = new Grid(nbColonne, gridsHeight, i);
        gridArray[i].initialize(divArray[i]);
        const canvas = gridArray[i].pixels.canvas
        canvas.style.margin = 0
        canvas.style["margin-top"] = -1
        canvas.style.padding = 0
        canvas.style.display = "flex"
        canvas.onmouseup = stopUsingTool;
        canvas.onmousedown = startUsingTool;
        //2049, 1601
    }
    // setTimeout(()=> {
    //     console.log(gridArray[1].pixels.canvas.height)
    //     console.log(gridArray[1].pixels.canvas.clientHeight)
    //     let fillingCanvas = document.createElement("canvas");
    //     fillingCanvas.style.cssText = gridArray[0].pixels.canvas.style.cssText
    //     fillingCanvas.height = gridArray[1].pixels.canvas.height
    //     fillingCanvas.width = gridArray[1].pixels.canvas.width
    //     gridArray[0].pixels.canvas.replaceWith(fillingCanvas)
    //     // fillingCanvas.height = gridArray[1].pixels.canvas.height + 'px'
    //     // fillingCanvas.width = gridArray[1].pixels.canvas.width + 'px'
    //     // divArray[0].style.cssText = 'height:' + (gridArray[0].pixels.canvas.height) + 'px'
    // }, 3000)

    const divs = document.querySelectorAll("#canvasContainer");

    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry) => {
            if (entry.intersectionRatio > 0) {
                console.log("on vient d'entrer dans :", entry.target)
                id = parseInt(entry.target.className)
                console.log("id :", id)
                if (entry.target.children[0]?.className === "filler") entry.target.children[0].remove()
                entry.target.appendChild(gridArray[id].pixels.canvas)
                // const canvas = gridArray[id].pixels.canvas
                // canvas.style.cssText = "margin:0;padding:0;display:flex;"
                // canvas.style["margin-top"] = -1
            } else {
                console.log("on vient de sortir de :", entry.target)
                id = parseInt(entry.target.className)
                console.log("id :", id)
                const filler = document.createElement("canvas");
                filler.style.cssText = entry.target.children[0].style.cssText
                filler.height = entry.target.children[0].height
                filler.width = entry.target.children[0].width
                filler.classList.add("filler")
                entry.target.children[0].replaceWith(filler)
            }
        })
    })

    divs.forEach(div => {
        observer.observe(div)
    })











    position = ref(mousePosition(document.body));


    watch(
        () => props.tool,
        (code) => {
            if (code === Tool.DONE) {
                // stopUsingTool()
                document.body.onmousedown = null;
                document.body.onmousemove = null;
            } else {
                document.body.onmouseup = stopUsingTool;
                document.body.onmousedown = startUsingTool;
            }
        }
    );

    watch(
        () => props.hasBought.value,
        (boughtInstance) => {
            if (boughtInstance === 1) {
                preEncode(grid).then((res) => {
                    chunkCreator(res);
                });
            }
            emit('boughtBack');
        }
    );
})
.then(() => {
    getSupply().then(async (s) => {
        var supply = s.toNumber();
        for (let i = 1; i <= supply; i++) {
            // getChunk(i).then((res) => {
            //     let index = res[0].toNumber();
            //     let x = index % grid.nbColumns;
            //     let y = Math.floor(index / grid.nbColumns);
            //     let arrBuffer = _base64ToArrayBuffer(res[3]); // devrait etre equivalent a fetchUr
            //     displayImageFromArrayBuffer(grid, arrBuffer, x, y);
            // });
        }
    });
});

function useTool() {
    console.log("useTool")
    if (props.tool === Tool.DONE) return;
    let newMousePosition = mousePositionInGrid();
    if (newMousePosition.x === oldMousePosition.x
    && newMousePosition.y === oldMousePosition.y
    && newMousePosition.z === oldMousePosition.z) return;

    switch (props.tool) {
        case Tool.PEN:
            console.log('case Tool.PEN')
            gridArray[newMousePosition.z].draw_pixel(newMousePosition.x, newMousePosition.y, new Klon(hexToRGB(props.color), Klon.PAINTED));
            break;
        case Tool.ERASER:
            gridArray[newMousePosition.z].erase_pixel(newMousePosition.x, newMousePosition.y);
            break;
        case Tool.TEXT:
            break;
        case Tool.MOVE:
            moveDrawing(newMousePosition.x, newMousePosition.y);
            break;
    }
}

function hexToRGB(hex) {
    var r = parseInt(hex.slice(1, 3), 16) / 255,
        g = parseInt(hex.slice(3, 5), 16) / 255,
        b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
}

function startUsingTool() {
    switch (props.tool) {
        case Tool.MOVE:
            startUsingMove();
            break;
        default:
            useTool();
            break;
    }
    document.body.onmousemove = useTool;
}

function stopUsingTool() {
    // document.onmousedown = null
    document.body.onmousemove = null;
}

function mousePositionInGrid() {
    let screenx = document.documentElement.clientWidth;
    let screeny = document.documentElement.clientHeight;
    let pixelSize = screenx / nbColonne;
    let nbPixely = screeny / pixelSize;
    let x = Math.floor((position.value[0] / screenx) * nbColonne);
    let y = Math.floor((position.value[1] / screeny) * nbPixely);
    let z = Math.floor(y/gridsHeight)
    y = y % gridsHeight
    console.log(x, y, z)
    return { x, y , z};
}
let highLow, saveArray, nbPix, firstPix;

function startUsingMove() {
    let ret = gridToArray(grid);
    highLow = ret.highLow;
    saveArray = ret.saveArray;
    nbPix = ret.nbPix;
    firstPix = ret.firstPix;
}

function moveDrawing(x, y) {
    grid.delete_user_pixel()
    displayArrayToImage(saveArray, highLow.longueur, highLow.largeur, grid, x, y, 1);
    // console.log('RETOUR', highLow, saveArray, nbPix, firstPix);
}

async function displayImageFromArrayBuffer(grid, arrayBuffer, offsetx, offsety) {
    let decoded;
    decoded = await decode(arrayBuffer).catch(console.error);
    if (!decoded) return;
    let array = toRGBA8(decoded);
    let width = decoded.width;
    let height = decoded.height;
    displayArrayToImage(array, width, height, grid, offsetx, offsety, 2);
}

function displayArrayToImage(array, width, height, grid, offsetx, offsety, author) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let idx = (width * y + x) * 4;
            if (array[idx + 3] != 0)
                grid.draw_pixel(
                    x + offsetx,
                    y + offsety,
                    new Klon([array[idx] / 255, array[idx + 1] / 255, array[idx + 2] / 255], author)
                );
        }
    }
}
</script>