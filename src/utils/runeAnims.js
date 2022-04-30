import { chunkStock } from './imageManager';
import { monolith } from '../models/monolith';
import { imageCatalog } from '../assets/imageData';

//Trigger it only once
let alreadyRuned = {};
export function animateRune(id) {
    if (alreadyRuned[id]) return;
    const rune = chunkStock[id];
    // console.log('rune to animate :', rune);
    // Let's animate the rune !

    setTimeout(() => {
        const limit = rune.width + Math.max(rune.width, rune.height);
        // console.log('limit', limit);
        for (let j = 0; j < rune.height; j++) {
            for (let i = 0; i < rune.width; i++) {
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
