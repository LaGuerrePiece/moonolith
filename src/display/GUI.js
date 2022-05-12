import { pointer } from '../controls/controls';
import { deviceType } from '../controls/controls';
import { canvas, renderHeight, renderWidth, windowHeight, pixelSize } from './displayLoop';
import { scaleFactor } from './view';
import { colorNumber1, colorNumber2, tool } from '../monolith/tools';
import { isInSquare } from '../utils/conversions';
import Const from '../constants';

export let paletteCatalog = {
    palette1smol_x2: { fileName: 'palette1smol_x2' },
    palette1medium_x2: { fileName: 'palette1medium_x2' },
    palette1large_x2: { fileName: 'palette1large_x2' },
    palette1giga_x2: { fileName: 'palette1giga_x2' },
    palette1smol: { fileName: 'palette1smol' },
    palette1medium: { fileName: 'palette1medium' },
    palette1large: { fileName: 'palette1large' },
    palette1giga: { fileName: 'palette1giga' },
    palette3smol: { fileName: 'palette3smol' },
    palette3medium: { fileName: 'palette3medium' },
    palette3large: { fileName: 'palette3large' },
    palette3giga: { fileName: 'palette3giga' },
    palette6smol: { fileName: 'palette6smol' },
    palette6medium: { fileName: 'palette6medium' },
    palette6large: { fileName: 'palette6large' },
    palette6giga: { fileName: 'palette6giga' },
    selector1A: { fileName: 'selector1A' },
    selector1A_x2: { fileName: 'selector1A_x2' },
    selector1B: { fileName: 'selector1B' },
    selector3A: { fileName: 'selector3A' },
    selector3B: { fileName: 'selector3B' },
    selector6A: { fileName: 'selector6A' },
    selector6B: { fileName: 'selector6B' },
    palettePAN: { fileName: 'palettePAN' },
};

export let GUICatalog = {
    skipIntro: { fileName: 'skipIntro', display: true },
    mobileDraw: { fileName: 'mobileDraw', type: 'toggleMode', display: false },
    mobileMove: { fileName: 'mobileMove', type: 'toggleMode', display: false },
    panneau: { fileName: 'panneau', type: 'popup', display: false },
    share: { fileName: 'share', type: 'popup', display: false },
    selectorA: { fileName: '/palette/selector1A', type: 'GUI', display: false },
    selectorB: { fileName: '/palette/selector1B', type: 'GUI', display: false },
    palette: { fileName: '/palette/palette1giga', type: 'palette', display: false },
};

export function displayShareScreen() {
    GUICatalog.share.display = true;
}

export function displayPalette() {
    GUICatalog.palette.display = true;
    GUICatalog.selectorA.display = true;
    GUICatalog.selectorB.display = deviceType === 'mobile' ? false : true;
    GUICatalog.mobileMove.display = deviceType === 'mobile' ? true : false;
}

export function updatePalette() {
    GUICatalog.palette.img = paletteCatalog[`palette${scaleFactor}${tool}`].img;
    GUICatalog.selectorA.img = paletteCatalog[`selector${scaleFactor}A`].img;
    GUICatalog.selectorB.img = paletteCatalog[`selector${scaleFactor}B`].img;
    GUICatalog.palette.info = Const.PALETTE_INFO[scaleFactor];

    // dirty case for phone unzoomed
    if (deviceType === 'mobile' && scaleFactor === 1) {
        GUICatalog.palette.img = paletteCatalog[`palette1${tool}_x2`].img;
        GUICatalog.selectorA.img = paletteCatalog[`selector1A_x2`].img;
        GUICatalog.palette.info = Const.PALETTE_INFO['mobileUnzoomed'];
    }
}

export function updateGUICatalog() {
    for (let GUILayer in GUICatalog) {
        const thisLayer = GUICatalog[GUILayer];
        if (thisLayer.type === 'palette') {
            const boundingClientRect = canvas.getBoundingClientRect();
            thisLayer.y = Math.floor(
                ((windowHeight - boundingClientRect.y) / (pixelSize * scaleFactor) - GUICatalog.palette.img.height) /
                    Const.GUI_RELATIVE_Y +
                    scaleFactor
            );
            thisLayer.x = Math.floor((renderWidth - GUICatalog.palette.img.width) / Const.GUI_RELATIVE_X);
        } else if (thisLayer.type === 'popup') {
            thisLayer.x = Math.floor((Const.COLUMNS - GUICatalog.panneau.img.width) / 2);
            thisLayer.y = Math.floor((renderHeight - GUICatalog.panneau.img.height) / 2 - 6);
        } else if (thisLayer.type === 'toggleMode') {
            thisLayer.x = Math.floor(Const.COLUMNS - GUICatalog.panneau.img.width);
            thisLayer.y = Math.floor((renderHeight - GUICatalog.panneau.img.height) / 20);
        } else if (thisLayer.fileName == 'skipIntro') {
            thisLayer.x = Math.floor(Const.COLUMNS - GUICatalog.skipIntro.img.width) - 20;
            thisLayer.y = Math.floor((renderHeight - GUICatalog.skipIntro.img.height) / 20);
        } else if (GUILayer === 'selectorA') {
            let offsetX, secondLine, spaceX;
            if (thisLayer.img.width === 30) {
                offsetX = 12;
                spaceX = 30;
                secondLine = 240;
            }
            if (thisLayer.img.width === 15) {
                offsetX = 6;
                spaceX = 15;
                secondLine = 120;
            }
            if (thisLayer.img.width === 9) {
                offsetX = 4;
                spaceX = 8;
                secondLine = 64;
            }
            if (thisLayer.img.width === 6) {
                offsetX = 2;
                spaceX = 5;
                secondLine = 40;
            }
            thisLayer.y = GUICatalog.palette.y - 1 + Math.floor(colorNumber1 / 9) * spaceX;
            // dirty adjustment for phone unzoomed
            if (thisLayer.img.width === 30) thisLayer.y--;
            thisLayer.x =
                GUICatalog.palette.x + offsetX + colorNumber1 * spaceX - Math.floor(colorNumber1 / 9) * secondLine;
            GUICatalog.selectorB.y = GUICatalog.palette.y - 1 + Math.floor(colorNumber2 / 9) * spaceX;
            GUICatalog.selectorB.x =
                GUICatalog.palette.x + offsetX + colorNumber2 * spaceX - Math.floor(colorNumber2 / 9) * secondLine;
        }
    }
    GUICatalog.panneau.display = isInSquare({ x: pointer.x, y: pointer.y }, 229, 241, 66, 72, 'plan1') ? true : false;
}

export function loadGUI() {
    for (let image in paletteCatalog) {
        paletteCatalog[image].img = new Image();
        paletteCatalog[image].img.src = `/images/palette/${paletteCatalog[image].fileName}.png`;
    }
    for (let GUILayer in GUICatalog) {
        GUICatalog[GUILayer].img = new Image();
        GUICatalog[GUILayer].img.onload = () => {
            GUICatalog[GUILayer].loaded = true;
        };
        GUICatalog[GUILayer].img.src = `/images/${GUICatalog[GUILayer].fileName}.png`;
    }
    GUICatalog.palette.info = Const.PALETTE_INFO[scaleFactor];
    updatePalette();
}

export function drawGUI(ctx) {
    for (let GUILayer in GUICatalog) {
        const thisLayer = GUICatalog[GUILayer];
        // if (!thisLayer.loaded) GUILayer.log(`${thisLayer.fileName} not loaded`);
        if (thisLayer.display && thisLayer.loaded) ctx.drawImage(thisLayer.img, thisLayer.x, thisLayer.y);
    }
}
