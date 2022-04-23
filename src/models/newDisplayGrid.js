import { viewPosY } from '../main';
import { assemble } from './assembler';
import { clickManager, mousePosInGrid } from './tools';

export let state;
export let nbRows;
export function newInitDisplay() {
    var canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    // Set canvas dimensions to the ratio of the screen size
    const nbColumns = 256;
    nbRows = Math.ceil((nbColumns * window.innerHeight) / window.innerWidth);
    console.log('nbColumns', nbColumns, 'nbRows', nbRows);
    canvas.width = nbColumns;
    canvas.height = nbRows;
    canvas.onmousedown = clickManager;

    // Set canvas size to size of screen
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    canvas.style.imageRendering = 'pixelated';
    document.body.style.cssText = 'margin:0;padding:0;';

    // Create image data of size nbColumns * nbRows
    let myImageData = ctx.createImageData(nbColumns, nbRows);
    console.log('myImageData.data.length', myImageData.data.length);

    //Drawing red
    canvas.onmousemove = drawRed;

    function drawRed(e) {
        let mousePos = mousePosInGrid(e);

        // console.log('mousePos', mousePos);
        const mousePosInState = state.length + 4 * 256 * (mousePos.y - viewPosY - nbRows) + 4 * mousePos.x;
        // console.log('mousePosInState', mousePosInState);
        state[mousePosInState] = 255;
        state[mousePosInState + 1] = 0;
        state[mousePosInState + 2] = 0;
        state[mousePosInState + 3] = 255;
        // console.log('state', state);
    }

    // let array = Array.from({ length: 2500 }, () => [0, 0, 0, 255]);

    // console.log("array", array);
    state = Uint8ClampedArray.from(assemble(true));
    function generateViewFromState() {
        let view = [];
        let start = state.length - nbRows * nbColumns * 4 - viewPosY * nbColumns * 4;
        for (let i = start; i < start + nbColumns * nbRows * 4; i++) {
            view.push(state[i]);
        }
        // console.log('view', view);
        return view;
    }

    console.log('state', state);
    // setInterval(() => {
    //     array = Uint8ClampedArray.from(assemble());
    // }, 100);
    function update() {
        myImageData.data.set(generateViewFromState());
        ctx.putImageData(myImageData, 0, 0);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    // update();

    // setTimeout(update, 500);
    // setInterval(update, 1000);
}
