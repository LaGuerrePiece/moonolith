import { chunkImport, setMonoHeightAndBuildIt } from './main';
import { changeViewPos, changeViewPosSmoothly, viewPosY, setInitialViewPos } from './display/view';
import { displayPalette, GUICatalog } from './display/GUI';
import { canvas, initDisplay } from './display/displayLoop';
import { animCatalog, launchAnim } from './display/animations';
import { shake } from './display/displayLoop';
import { displayImage } from './display/images';
import { skipManager, unlockControls, unlockScroll } from './controls/controls';
import { toggleMusic } from './assets/sounds';
import Const from './constants';

export let monolithDisplayHeightIntro = -10;
export let introState = false;

export async function launchIntro() {
    introState = true;
    let monoHeightSet = setMonoHeightAndBuildIt();
    changeViewPos(0, 400); // aller dans le ciel
    initDisplay();
    // Ask for metadata and build monolith
    // Ask for chunks but only display when monolith is built
    chunkImport(true, monoHeightSet);
    canvas.onmousedown = skipManager;

    launchAnim('collision');
    await new Promise((resolve) => setTimeout(resolve, animCatalog.collision.totalDelay + 1000));

    if (!introState) return;

    changeViewPosSmoothly(-350, 7);
    await new Promise((resolve) => {
        function waitForViewPos() {
            if (viewPosY == 50 || !introState) {
                resolve('Cette fonction est-elle propre ?');
                return;
            }
            setTimeout(waitForViewPos, 100);
        }
        waitForViewPos();
    });

    launchAnim('runPlan0');
    await new Promise((resolve) => setTimeout(resolve, animCatalog.runPlan0.totalDelay));

    if (!introState) return;

    changeViewPosSmoothly(70, 50);

    launchAnim('introRunB');
    await new Promise((resolve) => setTimeout(resolve, animCatalog.introRunB.totalDelay));

    launchAnim('introRunC');
    await new Promise((resolve) => setTimeout(resolve, animCatalog.introRunC.totalDelay));

    launchAnim('introRunD');
    await new Promise((resolve) => setTimeout(resolve, animCatalog.introRunD.totalDelay));

    if (!introState) return;

    monolithGoUpDuringIntro();

    if (!introState) return;

    displayImage('topAlien');
    displayImage('terreRetournee');
    unlockScroll();

    if (!introState) return;

    // When monolith is built :
    setTimeout(() => {
        console.log('Intro Finished');
        launchAnim('panneauRainbow');
        unlockControls();
        toggleMusic();
        displayPalette();
        GUICatalog.skipIntro.display = false;
        introState = false;
    }, 800 * Math.log(Const.MONOLITH_LINES) - 500);
}

export function skipIntro() {
    displayImage('topAlien');
    displayImage('terreRetournee');
    animCatalog.runPlan0.display = false;
    animCatalog.introRunB.display = false;
    animCatalog.collision.display = false;
    GUICatalog.skipIntro.display = false;
    changeViewPos(0, -999999);
    setInitialViewPos();
    unlockScroll();
    console.log('Intro Skipped');
    launchAnim('panneauRainbow');
    unlockControls();
    toggleMusic();
    displayPalette();
    introState = false;
}

function monolithGoUpDuringIntro() {
    for (let row = 0; row < Const.MONOLITH_LINES; row++) {
        let scalingValue = 800 * Math.log(row) - 500;
        setTimeout(() => {
            monolithDisplayHeightIntro++;
        }, scalingValue);
    }
    shake(Const.MONOLITH_LINES);
}
