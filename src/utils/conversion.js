import grid from '../models/grid';
import pixelgrid from 'pixel-grid';

let gridsHeight = pixelgrid.gridsHeight;

const convertIndexToXY = (number) => {
    let x = number % grid.nbColumns;
    let y = Math.floor(number / grid.nbColumns);
    return { x, y };
}

const convertXYToIndex = (x, y) => {
    return y * grid.nbColumns + x;
}

const convertIndexToXYZ = (number) => {
    let x = number % grid.nbColumns;
    let y = Math.floor(number / grid.nbColumns);
    let z = 1
    return { x, y, z };
}

export { convertIndexToXY, convertIndexToXYZ, convertXYToIndex, convertXYZToIndex };