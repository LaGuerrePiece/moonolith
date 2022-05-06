import { chunkStock } from './imageManager';
import Const from '../models/constants';
import { monolith, monolithIndexes } from '../models/monolith';
import { imageCatalog } from '../models/display';

export let animatedPixels = new Map();
// export let counter = 0;

//prettier-ignore
export function transition() {
    for (let [pos, [transitionType, color, counter]] of animatedPixels) {
        // console.log('value', value);
        if (transitionType === 'erase') {
            // erase
            if (counter === 1) draw(pos, [0, 118, 255]);
            else draw(pos, avg(color, pos, 8));
            
            if (counter === 10) {endTransition(pos, color);continue;}
        } else if (transitionType === 'draw') {
            // draw
            
            if (counter === 1) draw(pos, [254, 1, 255]);
            else if (counter === 2) draw(pos, [255, 116, 139]);
            else if (counter === 3) draw(pos, [255, 246, 10]);
            else if (counter === 4) draw(pos, [158, 255, 97]);
            else if (counter === 5) draw(pos, [16, 255, 239]);
            else if (counter === 6) draw(pos, [108, 147, 255]);
            else draw(pos, avg(color, pos, 1))

            if (counter === 10) {endTransition(pos, color);continue;}
        } else if (transitionType === 'import') {
            // import
            if (counter === 1) draw(pos, Const.DEFAULT_COLOR);
            else if (counter === 2) draw(pos, Const.DEFAULT_COLOR);
            else if (counter === 3) draw(pos, [88, 141, 190]);
            else if (counter === 5) draw(pos, [132, 172, 228]);
            else if (counter === 7) draw(pos, [166, 252, 219]);
            else if (counter === 9) draw(pos, [88, 141, 190]);
            else if (counter === 11) draw(pos, [166, 252, 219]);
            else if (counter === 13) draw(pos, [132, 172, 228]);
            else if (counter === 15) draw(pos, [88, 141, 190]);
            else if (counter > 15) draw(pos, avg(color, pos, 5));

            if (counter === 22) {endTransition(pos, color);continue;}
        } else if (transitionType === 'whiteOnRune') {
            // whiteOnRune
            if (counter === 97) draw(pos, [255, 255, 255]);

            if (counter === 100) {endTransition(pos, color);continue;}
        } else if (transitionType === 'runeBlueAnim') {
            //runeBlueAnim
            if (counter === 1) draw(pos, [32, 214, 199]);
            else if (counter < 10) draw(pos, [32, 214, 199]);
            else draw(pos, avg(color, pos, 10));

            if (counter === 50) {endTransition(pos, color);continue;}
        } else if (transitionType === 'runeContour') {
            //runeContour
            if (counter === 1) draw(pos, [10, 10, 10]);
            else if (counter < 10) draw(pos, [10, 10, 10]);
            else draw(pos, avg(color, pos, 10));

            if (counter === 50) {endTransition(pos, color);continue;}
        } else if (transitionType === 'runeCorner') {
            //runeContour
            if (counter === 1) draw(pos, [10, 10, 10]);
            else if (counter < 10) draw(pos, [10, 10, 10]);
            else draw(pos, avg(color, pos, 10));

            if (counter === 50) {endTransition(pos, color);continue;}
        }
        animatedPixels.set(pos, [transitionType, color, animatedPixels.get(pos)[2] + 1])
    }
}

function draw(pos, color) {
    monolith[pos] = color[0];
    monolith[pos + 1] = color[1];
    monolith[pos + 2] = color[2];
}

function endTransition(pos, color) {
    draw(pos, color);
    animatedPixels.delete(pos);
}

function avg(color1, pos, weightOf2 = 1) {
    return [
        (color1[0] + monolith[pos] * weightOf2) / (1 + weightOf2),
        (color1[1] + monolith[pos + 1] * weightOf2) / (1 + weightOf2),
        (color1[2] + monolith[pos + 2] * weightOf2) / (1 + weightOf2),
    ];
}

//Triggered only once per rune
export function animateRune(id) {
    if (!chunkStock[id]) return;
    if (chunkStock[id].alreadyRuned) return;
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
                const pos = (y * Const.MONOLITH_COLUMNS + x) * 4;
                if (x < 0 || x >= Const.MONOLITH_COLUMNS || y < 0 || y >= Const.MONOLITH_LINES) continue;
                if (!monolithIndexes[y]?.[x]) continue;
                // if (animatedPixels[pos]) continue;
                const color = [monolith[pos], monolith[pos + 1], monolith[pos + 2]];
                if (j + i < limit / 5) animatedPixels[pos] = [pos, 'whiteOnRune', color, 90];
                else if (j + i < limit / 4) animatedPixels[pos] = [pos, 'whiteOnRune', color, 88];
                else if (j + i < limit / 3) animatedPixels[pos] = [pos, 'whiteOnRune', color, 86];
                else if (j + i < limit / 2) animatedPixels[pos] = [pos, 'whiteOnRune', color, 84];
                else if (j + i < limit / 1.5) animatedPixels[pos] = [pos, 'whiteOnRune', color, 82];
                else if (j + i < limit / 1) animatedPixels[pos] = [pos, 'whiteOnRune', color, 80];
            }
        }
        // console.log('animatedPixels', animatedPixels);
    }, 1600);

    // runeCorners
    // prettier-ignore
    // const order = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    // for (let a = 0; a < 4; a++) {
    //     const direction = order[a];
    //     const startY = direction[0] === -1 ? rune.y : rune.y + rune.height;
    //     const startX = direction[1] === -1 ? rune.x : rune.x + rune.width;
    //     for (let j = 0; j < imageCatalog.runeCorner.height; j++) {
    //         for (let i = 0; i < imageCatalog.runeCorner.width; i++) {
    //             if (!runeBlueAnim.decodedYX[j][i]) continue;
    //             const y = startY + j * direction[0];
    //             const x = startX + i * direction[1];
    //             animThisPixel(y, x, 'runeCorner');
    //         }
    //     }
    // }

    // runeContour
    console.log('rune.width', rune.width, 'rune.height', rune.height, 'rune.y', rune.y, 'rune.x', rune.x);
    for (let j = rune.y; j < rune.height + rune.y; j++) {
        for (let i = rune.x; i < rune.width + rune.x; i++) {
            if (i < 0 || i >= Const.MONOLITH_COLUMNS || j < 0 || j >= Const.MONOLITH_LINES) continue;
            if (!monolithIndexes[j]?.[i]) continue;
            // i et j sont les coordonnées du pixel à dessiner
            for (let b = -2; b <= 2; b++) {
                for (let a = -2; a <= 2; a++) {
                    if (a === 0 && b === 0) continue;
                    const y = b + j;
                    const x = a + i;
                    animThisPixel(y, x, 'runeContour');
                }
            }
        }
    }

    function animThisPixel(y, x, animName) {
        if (x < 0 || x >= Const.MONOLITH_COLUMNS || y < 0 || y >= Const.MONOLITH_LINES) return;
        if (monolithIndexes[y]?.[x]) return;
        const pos = (y * Const.MONOLITH_COLUMNS + x) * 4;
        // Does nothing if an animation is already running on this pixel
        if (animatedPixels[pos]) return;
        const color = [monolith[pos], monolith[pos + 1], monolith[pos + 2]];
        animatedPixels[pos] = [pos, animName, color, 1];
    }

    chunkStock[id].alreadyRuned = true;
}
