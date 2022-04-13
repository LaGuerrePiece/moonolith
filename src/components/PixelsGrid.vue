<script setup>
// Imports pour vue 3
import { reactive, onMounted, watch, ref } from 'vue';

// Imports des composants
import Grid from '../models/grid';
import DisplayGrid from '../models/displayGrid';
import Klon from '../models/klon';

// Imports des fonctionnalités
import { fetchImgur } from '../utils/network';
import {
    decode,
    preEncode,
    _base64ToArrayBuffer,
    toRGBA8,
    gridToArray,
    hexToRGB,
    RGBToHex,
} from '../utils/image-manager';
import mousePosition from 'mouse-position';
import Tool from '../models/tools';
import { chunkCreator, getChunk, getSupply, getTotalPixs } from '../utils/web3';

// Definition des props
const props = defineProps({
    tool: Number,
    color: String,
    hasBought: Object,
    onDelete: Object,
    importedImage: Object,
});

var grid

const emit = defineEmits(['boughtBack', 'deleteBack', 'changeColor']);

// DISABLE RIGHT CLICK
document.addEventListener(
    'contextmenu',
    function (e) {
        e.preventDefault();
    },
    false
);

watch(
    () => props.onDelete.value,
    (deleteInstance) => {
        if (deleteInstance === 1) {
            grid.delete_user_pixel();
        }
        emit('deleteBack');
    }
);

watch(
    () => props.importedImage?.value,
    (buffer) => {
        if (buffer) {
            displayImageFromArrayBuffer(grid, buffer, 1, 1, 999999, 0);
        }
    }
);

const oldMousePosition = reactive({
    x: null,
    y: null,
});

// SETUP OF DISPLAYGRID
let displayGrid;
let canvas;
let position;
var viewPos = 0
var data;
const nbColonneDisplay = 170;
const width = window.innerWidth
const height = window.innerHeight
const pixelSize = width / nbColonneDisplay
const displayGridHeight = Math.floor(height/pixelSize) + 2;

displayGrid = new DisplayGrid(nbColonneDisplay, displayGridHeight);
displayGrid.initialize(document.body);
canvas = displayGrid.pixels.canvas;
position = ref(mousePosition(canvas));

canvas.onmouseup = stopUsingTool;
canvas.onmousedown = startUsingTool;


window.onwheel = function (e) {
    //viewPos += e.deltaY * -0.06;
    if(e.deltaY < 0){
        viewPos += 3
    }
    else {
        viewPos -= 3
    }

    if (viewPos < 0) viewPos = 0;
    if (viewPos > 70) viewPos = 70;
    console.log('viewPos', viewPos);
    // update()
};

let randomArray;
data = Array.from({ length: displayGrid.length }, () => [0.2, 0.8, 0.2]);

function update() {
    randomArray = Array.from({ length: 150 }, () => Math.random() * 0.02);
    for (let i = 0; i < grid.persistent.length; i++) {
        data[i] = grid.persistent[i]
            ? grid.persistent[i].color
            : grid.noises[i].randGray(randomArray[i % 150]).color;
    }
    displayGrid.updateDisplay(data)
}

setInterval(update, 30);










getTotalPixs()
    .then(async (total) => {
        let leNombreMagiqueVenuDeLaBlockchain = total.toNumber();
        console.log('leNombreMagiqueVenuDeLaBlockchain :', leNombreMagiqueVenuDeLaBlockchain);
        const nbColonne = 128
        const offsetFormule = nbColonne * 64;
        const pourcentage = 3;
        const formuleDeLaMort = offsetFormule + leNombreMagiqueVenuDeLaBlockchain * pourcentage;
        const nbLine = Math.floor(formuleDeLaMort / nbColonne);
        console.log('nbLine :', nbLine);

        // SETUP OF GRID
        grid = new Grid(nbColonne, nbLine);

        watch(
            () => props.tool,
            (code) => {
                if (code === Tool.DONE) {
                    canvas.onmousedown = null;
                    canvas.onmousemove = null;
                } else {
                    canvas.onmouseup = stopUsingTool;
                    canvas.onmousedown = startUsingTool;
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
    .then((res) => {
        // getSupply().then(async (supply) => {
        //     let s = supply.toNumber();
        //     for (let i = 1; i <= s; i++) {
        //         getChunk(i).then((res) => {
        //             let pixelPaid = res[2].toNumber();
        //             let index = res[0].toNumber();
        //             let x = index % grid.nbColumns;
        //             let y = Math.floor(index / grid.nbColumns);
        //             let arrBuffer = _base64ToArrayBuffer(res[3]);
        //             displayImageFromArrayBuffer(grid, arrBuffer, x, y, pixelPaid, i);
        //         });
        //     }
        // });
    });

function useTool() {
    let newMousePosition = mousePositionInGrid();
    if (newMousePosition.x === oldMousePosition.x && newMousePosition.y === oldMousePosition.y) return;
    // prettier-ignore
    switch (props.tool) {
        case Tool.SMOL:
            console.log(props.color)
            grid.draw_pixel(newMousePosition.x, newMousePosition.y, Klon.USERPAINTED, new Klon(hexToRGB(props.color), Klon.USERPAINTED));
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    grid.draw_pixel(newMousePosition.x + i, newMousePosition.y + j, Klon.USERPAINTED, new Klon(hexToRGB(props.color), Klon.USERPAINTED));                    
                }
            }            
            break;
        case Tool.HUGE:
            for (let i = -4; i <= 4; i++) {
                for (let j = -4; j <= 4; j++) {
                    grid.draw_pixel(newMousePosition.x + i, newMousePosition.y + j, Klon.USERPAINTED, new Klon(hexToRGB(colorPicked), Klon.USERPAINTED));                    
                    }
            }
            break;
        case Tool.MOVE:
            moveDrawing(newMousePosition.x, newMousePosition.y);
            break;
    }
}

function useDeleteTool() {
    let newMousePosition = mousePositionInGrid();
    if (newMousePosition.x === oldMousePosition.x && newMousePosition.y === oldMousePosition.y) return;
    // prettier-ignore
    switch (props.tool) {
        case Tool.SMOL:
            grid.erase_pixel(newMousePosition.x, newMousePosition.y);
            break;
        case Tool.BIG:
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    grid.erase_pixel(newMousePosition.x + i, newMousePosition.y + j);                    
                    }
            }
            break;
        case Tool.HUGE:
            for (let i = -4; i <= 4; i++) {
                for (let j = -4; j <= 4; j++) {
                    grid.erase_pixel(newMousePosition.x + i, newMousePosition.y + j);                    
                    }
            }
            break;
    }
}

let colorPicked = ''

function useColorPicker() {
    let newMousePosition = mousePositionInGrid();
    colorPicked = grid.get_color(newMousePosition.x, newMousePosition.y, grid);
    colorPicked = RGBToHex(colorPicked[0], colorPicked[1], colorPicked[2])
    console.log(colorPicked);
    if (colorPicked !== undefined) {
        emit('changeColor', colorPicked);
    }
}

function startUsingTool(e) {
    if (e.button == 0) {
        useTool();
        canvas.onmousemove = useTool;
    }
    if (e.button == 2) {
        useDeleteTool();
        canvas.onmousemove = useDeleteTool;
    }
    if (e.button == 1) {
        useColorPicker();
        canvas.onmousemove = useColorPicker;
    }
}

function stopUsingTool() {
    // document.onmousedown = null
    canvas.onmousemove = null;
}

function mousePositionInGrid() {
    let screenx = document.documentElement.clientWidth;
    let screeny = document.documentElement.clientHeight;
    let pixelSize = screenx / grid.nbColumns;
    let nbPixely = screeny / pixelSize;
    let x = Math.floor((position.value[0] / screenx) * grid.nbColumns);
    let y = Math.floor((position.value[1] / screeny) * nbPixely);
    return { x, y };
}

function moveDrawing(x, y) {
    let highLow, saveArray, nbPix, firstPix;
    let ret = gridToArray(grid);
    highLow = ret.highLow;
    saveArray = ret.saveArray;
    nbPix = ret.nbPix;
    firstPix = ret.firstPix;
    grid.delete_user_pixel();
    console.log('l', highLow.largeur);
    console.log('L', highLow.longueur);
    console.log('lowx', highLow.lowX);
    let outx = x;
    let outy = y;
    if (outx > 127) outx = 127;
    if (outx < 0) outx = 0;
    displayArrayToImage(saveArray, highLow.longueur, highLow.largeur, grid, outx, outy, 999999, 0);
}

async function displayImageFromArrayBuffer(grid, arrayBuffer, offsetx, offsety, pixelPaid, zIndex) {
    let decoded;
    decoded = await decode(arrayBuffer).catch(console.error);
    if (!decoded) return;
    let array = toRGBA8(decoded);
    let width = decoded.width;
    let height = decoded.height;

    displayArrayToImage(array, width, height, grid, offsetx, offsety, pixelPaid, zIndex);
}

function displayArrayToImage(array, width, height, grid, offsetx, offsety, pixelPaid, zIndex) {
    let pixelDrawn = 0;
    let decallage = -1;
    let rowDebloqueEpok = 100000; // <========= A REMPLACER AVEC DONNEES BLOCKCHAIN
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let idx = (width * y + x) * 4;
            if (array[idx + 3] != 0 && array[idx + 3] != 0 && pixelDrawn < pixelPaid && offsety <= rowDebloqueEpok) {
                // ^^ IDEM PLACEHOLDER ^^
                if (pixelDrawn === 0) decallage = x + 1;
                grid.draw_pixel(
                    x + offsetx - decallage,
                    y + offsety,
                    zIndex,
                    new Klon([array[idx] / 255, array[idx + 1] / 255, array[idx + 2] / 255], zIndex)
                );
                pixelDrawn++;
            }
        }
    }
}
</script>

<style>
html, body {
    overflow: hidden;
}
</style>
