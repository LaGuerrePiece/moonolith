import { chunkImport, setMonoHeightAndBuildIt } from './main';
import { changeViewPos, changeViewPosSmoothly } from './display/view';
import { displayPalette } from './display/GUI';
import { initDisplay } from './display/displayLoop';
import { launchAnim } from './display/animations';
import { shake } from './display/displayLoop';
import { displayImage } from './display/images';
import { unlockControls } from './controls/controls';
import { toggleMusic } from './assets/sounds';
import Const from './constants';

export let monolithDisplayHeightIntro = 0;
export let introState = false;

export async function launchIntro() {
    introState = true;
    console.log('changing viewPos to the sky');
    changeViewPos(0, 400); // aller dans le ciel
    initDisplay();
    launchAnim('collision');
    // Ask for metadata and build monolith
    let monoHeightSet = setMonoHeightAndBuildIt();
    // Ask for chunks but only display when monolith is built
    chunkImport(true, monoHeightSet);

    delay(2000, changeViewPosSmoothly, -350, 7);
    delay(5500, launchAnim, 'runPlan0');
    delay(6300, changeViewPosSmoothly, 60, 7);
    delay(6800, launchAnim, 'runPlan1');
    delay(7500, monolithGoUpDuringIntro);
    delay(10000, displayImage, 'topAlien');

    // lazyParseAPNG();
}

export function monolithGoUpDuringIntro() {
    // grows monolith
    for (let rowAdded = 0; rowAdded < Const.MONOLITH_LINES; rowAdded++) {
        let scalingValue = 1000 * Math.log(rowAdded);
        setTimeout(() => {
            monolithDisplayHeightIntro++;
        }, scalingValue);
    }
    shake(Const.MONOLITH_LINES);

    // When monolith is built :
    delay(1000 * Math.log(Const.MONOLITH_LINES), () => {
        console.log('intro done');
        introState = false;
        launchAnim('panneauRainbow');
        toggleMusic();
        displayPalette();
        unlockControls();
    });
}

function delay(ms, funct, arg1, arg2) {
    setTimeout(() => {
        funct(arg1, arg2);
    }, ms);
}
