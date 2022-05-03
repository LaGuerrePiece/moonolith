import { renderHeight, renderWidth, viewPosX, viewPosY, deviceType } from '../main';
import Const from './constants';
import { clickManager } from './tools';

let previousViewPosY;

export function initDisplay() {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    // Set canvas dimensions to the ratio of the screen size
    canvas.width = renderWidth;
    canvas.height = renderHeight;
    // if (deviceType != 'mobile') canvas.onmousedown = clickManager;
    // Set canvas size to size of screen
    canvas.style.width = '100%';
    canvas.style.imageRendering = 'pixelated';
    document.body.style.cssText = 'margin:0;padding:0;';

    //Preparation
    let imageCatalog = {
        palette: { type: 'GUI', startX: 0, startY: 0, parallax: 0 },
        menu: { type: 'GUI', startX: 0, startY: 0, parallax: 0 },
        caly0: { type: 'landscape', startX: 0, startY: 85, parallax: 0.1 },
        caly1: { type: 'landscape', startX: 0, startY: 85, parallax: 0.1 },
        caly2: { type: 'landscape', startX: 0, startY: 150, parallax: 0.2 },
        caly3: { type: 'landscape', startX: 0, startY: 225, parallax: 0.3 },
        caly4: { type: 'landscape', startX: 0, startY: 290, parallax: 0.4 },
        caly5: { type: 'landscape', startX: 0, startY: 343, parallax: 0.9 },
        caly6: { type: 'landscape', startX: 0, startY: 420, parallax: 1 },
    };

    for (let image in imageCatalog) {
        imageCatalog[image].img = new Image();
        imageCatalog[image].img.src = `/src/assets/images/${image}.png`;
    }

    requestAnimationFrame(update);

    function update() {
        // Select images to display
        let displayArray = [];
        for (let image in imageCatalog) {
            const thisImage = imageCatalog[image];
            // Update their startY and startX

            if (thisImage.type === 'landscape') {
                const parallaxOffset = Math.floor(thisImage.parallax * viewPosY);
                displayArray.push({
                    name: image,
                    startY: renderHeight + parallaxOffset + viewPosY - thisImage.startY, //- thisImage.img.height,
                    startX: thisImage.startX - viewPosX,
                });
            } else if (thisImage.type === 'GUI') {
                displayArray.push({
                    name: image,
                    startY: thisImage.startY - viewPosY,
                    startX: thisImage.startX - viewPosX,
                });
            }
            // console.log(image, thisImage.img.height);
        }
        // Draw them
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = displayArray.length - 1; i >= 0; i--) {
            // const startY = renderHeight - displayArray[i].height + Math.floor(viewPosY * (2 - i / 6));
            ctx.drawImage(imageCatalog[displayArray[i].name].img, displayArray[i].startX, displayArray[i].startY);
        }
        requestAnimationFrame(update);
    }
}

//selectorUpdate()

// export let canvas;
// let myImageData;
// let ctx;

// let caly0 = new Image();

// canvas = document.createElement('canvas');
// ctx = canvas.getContext('2d');
// document.body.appendChild(canvas);

// // Set canvas dimensions to the ratio of the screen size
// canvas.width = renderWidth;
// canvas.height = renderHeight;
// // if (deviceType != 'mobile') canvas.onmousedown = clickManager;

// // Set canvas size to size of screen
// canvas.style.width = '100%';
// canvas.style.imageRendering = 'pixelated';
// document.body.style.cssText = 'margin:0;padding:0;';

// canvas.onload = () => {
//     ctx.drawImage(caly0, 0, 0);
// };
// caly0.src = new URL('../assets/images/caly0.png', import.meta.url);
// // Create image data of size nbColumns * nbRows
// // myImageData = ctx.createImageData(renderWidth, renderHeight);
// // requestAnimationFrame(update);

// window.addEventListener('load', function () {
//     console.log('jej');
// });
// // function update() {
// //     myImageData.data.set(assemble(true));
// //     ctx.putImageData(myImageData, 0, 0);
// //     requestAnimationFrame(update);
// // }

// let startX = 0;
// let test = new Image();
// let caly0 = new Image();
// let caly1 = new Image();
// let caly2 = new Image();
// let caly3 = new Image();
// let caly4 = new Image();
// let caly5 = new Image();
// let caly6 = new Image();

// //init
// window.onload = () => {
//     test.src = 'images/test.png';
//     caly0.src = 'images/caly0.png';
//     caly1.src = 'images/caly1.png';
//     caly2.src = 'images/caly2.png';

//     requestAnimationFrame(smoothAnimation);
// };

// function smoothAnimation() {
//     startX++;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(test, startX, 0);
//     ctx.drawImage(caly0, 0, 0);
//     ctx.drawImage(caly1, 0, 0);
//     ctx.drawImage(caly2, 0, 0);
//     requestAnimationFrame(smoothAnimation);
// }

// var canvas = document.createElement("canvas");
// const ctx = canvas.getContext("2d");
// document.body.appendChild(canvas);

// // Set canvas dimensions to the ratio of the screen size
// const nbColumns = 256;
// const nbRows = Math.ceil((nbColumns * window.innerHeight) / window.innerWidth);
// console.log("nbColumns", nbColumns, "nbRows", nbRows);
// canvas.width = nbColumns;
// canvas.height = nbRows;

// // Set canvas size to size of screen
// canvas.style.width = window.innerWidth + "px";
// canvas.style.height = window.innerHeight + "px";
// canvas.style.imageRendering = "pixelated";
// document.body.style.cssText = "margin:0;padding:0;";

// let startX = 0;
// let test = new Image();
// let caly0 = new Image();
// let caly1 = new Image();
// let caly2 = new Image();
// let caly3 = new Image();
// let caly4 = new Image();
// let caly5 = new Image();
// let caly6 = new Image();

// //init
// window.onload = () => {
//   test.src = "images/test.png";
//   caly0.src = "images/caly0.png";
//   caly1.src = "images/caly1.png";
//   caly2.src = "images/caly2.png";

//   requestAnimationFrame(smoothAnimation);
// };

// function smoothAnimation() {
//   startX++;
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.drawImage(test, startX, 0);
//   ctx.drawImage(caly0, 0, 0);
//   ctx.drawImage(caly1, 0, 0);
//   ctx.drawImage(caly2, 0, 0);
//   requestAnimationFrame(smoothAnimation);
// }
