import { chunkStock } from './imageManager';
import Const from '../models/constants';
import { monolith } from '../models/monolith';
import { imageCatalog } from '../assets/imageData';
import { viewPosY, renderHeight } from '../main';

export let animatedPixels = {};
export let counter = 0;

export function transition() {
    for (let i in animatedPixels) {
        const [x, y, transitionType, counter] = animatedPixels[i];
        if (transitionType === 'erase') {
            // erase
            if (counter === 1) monolith[y][x].color = [0, 118, 255];
            else monolith[y][x].color = avg(monolith[y][x].target, monolith[y][x].color, 8);
            if (counter === 10) {
                endTransition(x, y, i);
                continue;
            }
        } else if (transitionType === 'draw') {
            // draw
            if (counter === 1) monolith[y][x].color = [254, 1, 255];
            else if (counter === 2) monolith[y][x].color = [255, 116, 139];
            else if (counter === 3) monolith[y][x].color = [255, 246, 10];
            else if (counter === 4) monolith[y][x].color = [158, 255, 97];
            else if (counter === 5) monolith[y][x].color = [16, 255, 239];
            else if (counter === 6) monolith[y][x].color = [108, 147, 255];
            else monolith[y][x].color = avg(monolith[y][x].target, monolith[y][x].color, 1);

            if (counter === 10) {
                endTransition(x, y, i);
                continue;
            }
        }
        animatedPixels[i][3] = counter + 1;
    }
    // console.log('animatedPixels', animatedPixels);
}

function endTransition(x, y, i) {
    monolith[y][x].color = monolith[y][x].target;
    delete animatedPixels[i];
    // animatedPixels[y * Const.MONOLITH_COLUMNS + x] = undefined;
}

function avg(color1, color2, weightOf2 = 1) {
    return [
        (color1[0] + color2[0] * weightOf2) / (1 + weightOf2),
        (color1[1] + color2[1] * weightOf2) / (1 + weightOf2),
        (color1[2] + color2[2] * weightOf2) / (1 + weightOf2),
    ];
}

//Trigger it only once
let alreadyRuned = {};
export function animateRune(id) {
    if (alreadyRuned[id]) return;
    const rune = chunkStock[id];
    const startY = Const.MARGIN_BOTTOM + Const.MONOLITH_LINES - viewPosY - renderHeight;
    console.log('startY', startY);
    // console.log('rune to animate :', rune);
    // Let's animate the rune !

    setTimeout(() => {
        const limit = rune.width + Math.max(rune.width, rune.height);
        // console.log('limit', limit);
        for (let j = 0; j < rune.height; j++) {
            for (let i = 0; i < rune.width; i++) {
                if (rune.y + j < startY || rune.y + j > startY + renderHeight) continue;
                const klon = monolith[rune.y + j][rune.x + i];
                if (!klon) continue;
                if (!klon.zIndex) continue;
                klon.transitionType = 'whiteOnRune';
                if (j + i < limit / 5) klon.transitionCount = 90;
                else if (j + i < limit / 4) klon.transitionCount = 88;
                else if (j + i < limit / 3) klon.transitionCount = 86;
                else if (j + i < limit / 2) klon.transitionCount = 84;
                else if (j + i < limit / 1.5) klon.transitionCount = 82;
                else if (j + i < limit / 1) klon.transitionCount = 80;
            }
        }
    }, 1600);
    // console.log('imageCatalog', imageCatalog.runeBlueAnimMid, imageCatalog.runeBlueAnimMid.decodedYX);

    // runeBlueAnim
    if (rune.width <= 120 && rune.height <= 120) {
        const runeBlueAnim =
            rune.width <= 30 && rune.height <= 30
                ? imageCatalog.runeBlueAnimSmoll
                : rune.width <= 60 && rune.height <= 60
                ? imageCatalog.runeBlueAnimMid
                : imageCatalog.runeBlueAnimHuge;
        const animStartX = Math.floor(rune.x + rune.width / 2 - runeBlueAnim.width / 2);
        const animStartY = Math.floor(rune.y + rune.height / 2 - runeBlueAnim.height / 2);
        // console.log('animStartX', animStartX, 'animStartY', animStartY);
        for (let j = 0; j < runeBlueAnim.height; j++) {
            for (let i = 0; i < runeBlueAnim.width; i++) {
                if (runeBlueAnim.decodedYX[j][i]) {
                    if (animStartY + j < startY || animStartY + j > startY + renderHeight) continue;
                    const klon = monolith[animStartY + j]?.[animStartX + i];
                    if (!klon) continue;
                    if (klon.zIndex) continue;
                    klon.transitionType = 'runeBlueAnim';
                    klon.transitionCount = 1;
                }
            }
        }
    }

    // RuneContour
    for (let j = 0; j < rune.height; j++) {
        for (let i = 0; i < rune.width; i++) {
            const klon = monolith[rune.y + j]?.[rune.x + i];
            if (rune.y + j < startY || rune.y + j > startY + renderHeight) continue;
            if (!klon) continue;
            if (!klon.zIndex) continue;
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    if (x === 0 && y === 0) continue;
                    const klonContour = monolith[rune.y + j + y]?.[rune.x + i + x];
                    if (!klonContour) continue;
                    if (klonContour.zIndex) continue;
                    klonContour.transitionType = 'runeContour';
                    klonContour.transitionCount = 1;
                }
            }
        }
    }

    // // Contour
    // for (let i = -2; i <= 2; i++) {
    //     for (let j = -2; j <= 2; j++) {
    //         const klon = monolith[y + i]?.[x + j];
    //         if (klon && klon.zIndex === undefined && klon.transitionType !== 'import')
    //             klon.setTargetColor(klon.target, -1);
    //     }
    // }
    alreadyRuned[id] = true;
}
