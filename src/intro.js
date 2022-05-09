import { chunkImport, setMonoHeightAndBuildIt } from './main';
import { changeViewPos, changeViewPosSmoothly, viewPosY } from './display/view';
import { displayPalette } from './display/GUI';
import { initDisplay } from './display/displayLoop';
import { animCatalog, launchAnim } from './display/animations';
import { shake } from './display/displayLoop';
import { displayImage } from './display/images';
import { unlockControls, unlockScroll } from './controls/controls';
import { toggleMusic } from './assets/sounds';
import Const from './constants';

export let monolithDisplayHeightIntro = 0;
export let introState = false;

export async function launchIntro() {
    introState = true;
    let monoHeightSet = setMonoHeightAndBuildIt();
    changeViewPos(0, 400); // aller dans le ciel
    initDisplay();
    // Ask for metadata and build monolith
    // Ask for chunks but only display when monolith is built
    chunkImport(true, monoHeightSet);

    launchAnim('collision');
    await new Promise((resolve) => setTimeout(resolve, animCatalog.collision.totalDelay + 1000));

    changeViewPosSmoothly(-350, 7);
    await new Promise((resolve) => {
        function waitForViewPos() {
            if (viewPosY == 50) {
                resolve('Cette fonction est-elle propre ?');
                return;
            }
            setTimeout(waitForViewPos, 300);
        }
        waitForViewPos();
    });

    launchAnim('runPlan0');
    await new Promise((resolve) => setTimeout(resolve, animCatalog.runPlan0.totalDelay));

    changeViewPosSmoothly(70, 50);

    launchAnim('runPlan1');
    await new Promise((resolve) => setTimeout(resolve, animCatalog.runPlan1.totalDelay));

    monolithGoUpDuringIntro();
    displayImage('topAlien');
    toggleMusic();
    unlockScroll();

    // When monolith is built :
    setTimeout(() => {
        console.log('Intro Finished');
        launchAnim('panneauRainbow');
        unlockControls();
        displayPalette();
        introState = false;
    }, 1000 * Math.log(Const.MONOLITH_LINES));
}

function monolithGoUpDuringIntro() {
    for (let rowAdded = 0; rowAdded < Const.MONOLITH_LINES; rowAdded++) {
        let scalingValue = 1000 * Math.log(rowAdded);
        setTimeout(() => {
            monolithDisplayHeightIntro++;
        }, scalingValue);
    }
    shake(Const.MONOLITH_LINES);
}
