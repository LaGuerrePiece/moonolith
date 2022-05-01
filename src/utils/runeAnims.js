import { chunkStock } from './imageManager';
import Const from '../models/constants';
import { monolith } from '../models/monolith';
import { imageCatalog } from '../assets/imageData';

export let animatedPixels = {};
export let counter = 0;

export function transition() {
    for (let i in animatedPixels) {
        const [x, y, transitionType, counter] = animatedPixels[i];
        if (transitionType === 'erase') {
            // erase
            if (counter === 1) monolith[y][x].color = [0, 118, 255];
            else monolith[y][x].color = avg(monolith[y][x].target, monolith[y][x].color, 8);
            //prettier-ignore
            if (counter === 10) {endTransition(x, y, i);continue;}
        } else if (transitionType === 'draw') {
            // draw
            if (counter === 1) monolith[y][x].color = [254, 1, 255];
            else if (counter === 2) monolith[y][x].color = [255, 116, 139];
            else if (counter === 3) monolith[y][x].color = [255, 246, 10];
            else if (counter === 4) monolith[y][x].color = [158, 255, 97];
            else if (counter === 5) monolith[y][x].color = [16, 255, 239];
            else if (counter === 6) monolith[y][x].color = [108, 147, 255];
            else monolith[y][x].color = avg(monolith[y][x].target, monolith[y][x].color, 1);

            //prettier-ignore
            if (counter === 10) {endTransition(x, y, i);continue;}
        } else if (transitionType === 'import') {
            // import
            if (counter === 1) monolith[y][x].color = Const.DEFAULT_COLOR;
            else if (counter === 2) monolith[y][x].color = Const.DEFAULT_COLOR;
            else if (counter === 3) monolith[y][x].color = [88, 141, 190];
            else if (counter === 5) monolith[y][x].color = [132, 172, 228];
            else if (counter === 7) monolith[y][x].color = [166, 252, 219];
            else if (counter === 9) monolith[y][x].color = [88, 141, 190];
            else if (counter === 11) monolith[y][x].color = [166, 252, 219];
            else if (counter === 13) monolith[y][x].color = [132, 172, 228];
            else if (counter === 15) monolith[y][x].color = [88, 141, 190];
            else if (counter > 15) monolith[y][x].color = avg(monolith[y][x].target, monolith[y][x].color, 5);
            //prettier-ignore
            if (counter === 22) {endTransition(x, y, i);continue;}
        } else if (transitionType === 'whiteOnRune') {
            // whiteOnRune
            if (counter === 97) monolith[y][x].color = [255, 255, 255];
            //prettier-ignore
            if (counter === 100) {endTransition(x, y, i);continue;}
        } else if (transitionType === 'runeBlueAnim') {
            //runeBlueAnim
            if (counter === 1) monolith[y][x].color = [32, 214, 199];
            else if (counter < 10) monolith[y][x].color = [32, 214, 199];
            else monolith[y][x].color = avg(monolith[y][x].target, monolith[y][x].color, 10);
            //prettier-ignore
            if (counter === 50) {endTransition(x, y, i);continue;}
        } else if (transitionType === 'runeContour') {
            //runeContour
            if (counter === 1) monolith[y][x].color = [10, 10, 10];
            else if (counter < 10) monolith[y][x].color = [10, 10, 10];
            else monolith[y][x].color = avg(monolith[y][x].target, monolith[y][x].color, 10);
            //prettier-ignore
            if (counter === 50) {endTransition(x, y, i);continue;}
        }
        animatedPixels[i][3] = counter + 1;
    }
}

function endTransition(x, y, i) {
    monolith[y][x].color = monolith[y][x].target;
    delete animatedPixels[i];
}

function avg(color1, color2, weightOf2 = 1) {
    return [
        (color1[0] + color2[0] * weightOf2) / (1 + weightOf2),
        (color1[1] + color2[1] * weightOf2) / (1 + weightOf2),
        (color1[2] + color2[2] * weightOf2) / (1 + weightOf2),
    ];
}

//Triggered only once per rune
let alreadyRuned = {};
export function animateRune(id) {
    if (alreadyRuned[id]) return;
    console.log('animateRune', id);
    const rune = chunkStock[id];
    // console.log('rune to animate :', rune);
    // Let's animate the rune !

    setTimeout(() => {
        const limit = rune.width + Math.max(rune.width, rune.height);
        for (let j = 0; j < rune.height; j++) {
            for (let i = 0; i < rune.width; i++) {
                const y = j + rune.y;
                const x = i + rune.x;
                const klon = monolith[y][x];
                if (!klon) continue;
                if (!klon.zIndex) continue;
                if (j + i < limit / 5) animatedPixels[y * Const.MONOLITH_COLUMNS + x] = [x, y, 'whiteOnRune', 90];
                else if (j + i < limit / 4) animatedPixels[y * Const.MONOLITH_COLUMNS + x] = [x, y, 'whiteOnRune', 88];
                else if (j + i < limit / 3) animatedPixels[y * Const.MONOLITH_COLUMNS + x] = [x, y, 'whiteOnRune', 86];
                else if (j + i < limit / 2) animatedPixels[y * Const.MONOLITH_COLUMNS + x] = [x, y, 'whiteOnRune', 84];
                else if (j + i < limit / 1.5)
                    animatedPixels[y * Const.MONOLITH_COLUMNS + x] = [x, y, 'whiteOnRune', 82];
                else if (j + i < limit / 1) animatedPixels[y * Const.MONOLITH_COLUMNS + x] = [x, y, 'whiteOnRune', 80];
            }
        }
        // console.log('animatedPixels', animatedPixels);
    }, 1600);

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
                    const klon = monolith[animStartY + j]?.[animStartX + i];
                    if (!klon) continue;
                    if (klon.zIndex) continue;
                    animatedPixels[(animStartY + j) * Const.MONOLITH_COLUMNS + animStartX + i] = [
                        animStartX + i,
                        animStartY + j,
                        'runeBlueAnim',
                        1,
                    ];
                }
            }
        }
    }

    // RuneContour
    for (let j = 0; j < rune.height; j++) {
        for (let i = 0; i < rune.width; i++) {
            const klon = monolith[rune.y + j]?.[rune.x + i];
            if (!klon) continue;
            if (!klon.zIndex) continue;
            for (let y = -1; y <= 1; y++) {
                for (let x = -1; x <= 1; x++) {
                    if (x === 0 && y === 0) continue;
                    const klonContour = monolith[rune.y + j + y]?.[rune.x + i + x];
                    if (!klonContour) continue;
                    if (klonContour.zIndex) continue;
                    animatedPixels[(rune.y + j + y) * Const.MONOLITH_COLUMNS + rune.x + i + x] = [
                        rune.x + i + x,
                        rune.y + j + y,
                        'runeContour',
                        1,
                    ];
                }
            }
        }
    }

    alreadyRuned[id] = true;
}
