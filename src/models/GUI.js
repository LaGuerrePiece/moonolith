import { renderWidth, renderHeight } from '../main';

export let GUI = Array.from({ length: renderWidth }, () => Array.from({ length: renderHeight }, () => undefined));

// GUI TO ADD
// const startGUI = Math.floor(renderWidth * (renderHeight - 7));
// for (let i = startGUI; i < landscapeArray.length; i++) {
//     const column = i % renderWidth;
//     //COLORS
//     if (column < 5) landscapeArray[i] = Const.RGB1;
//     if (column < 10 && column >= 5) landscapeArray[i] = Const.RGB2;
//     if (column < 15 && column >= 10) landscapeArray[i] = Const.RGB10;
//     if (column < 20 && column >= 15) landscapeArray[i] = Const.RGB4;
//     if (column < 25 && column >= 20) landscapeArray[i] = Const.RGB5;
//     if (column < 30 && column >= 25) landscapeArray[i] = Const.RGB6;
//     //TOOLS
//     if (column < 35 && column >= 30) landscapeArray[i] = [0.9, 0.9, 0.9];
//     if (column < 40 && column >= 35) landscapeArray[i] = [0.8, 0.8, 0.8];
//     if (column < 45 && column >= 40) landscapeArray[i] = [0.7, 0.7, 0.7];
//     if (column < 50 && column >= 45) landscapeArray[i] = [0.1, 0.6, 0.3];
//     if (column < 55 && column >= 50) landscapeArray[i] = [0.3, 0.6, 0.1];
//     if (column < 60 && column >= 55) landscapeArray[i] = [0.4, 0.4, 0.4];
//     if (column < 65 && column >= 60) landscapeArray[i] = [0.6, 0.1, 0.3];
// }
