import { chunkImport, setMonoHeightAndBuildIt } from './main';
import { changeViewPos, changeViewPosSmoothly, viewPosY, setInitialViewPos } from './display/view';
import { displayPalette, GUICatalog } from './display/GUI';
import { canvas, initDisplay } from './display/displayLoop';
import { animCatalog, launchAnim } from './display/animations';
import { shake } from './display/displayLoop';
import { displayImage, imageCatalog } from './display/images';
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

    changeViewPosSmoothly(-390, 7);
    await new Promise((resolve) => {
        function waitForViewPos() {
            if (viewPosY == 10 || !introState) {
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
    imageCatalog.moon.display = false;
    await new Promise((resolve) => setTimeout(resolve, animCatalog.introRunB.totalDelay));

    launchAnim('introRunC');
    await new Promise((resolve) => setTimeout(resolve, animCatalog.introRunC.totalDelay));
    monolithDisplayHeightIntro += 12;
    launchAnim('introRunD');
    monolithGoUpDuringIntro();

    if (!introState) return;

    // displayImage('topAlien');
    displayImage('TibonomEmporte');
    // await new Promise((resolve) => setTimeout(resolve, animCatalog.introRunD.totalDelay));

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
    }, 650 * Math.log(Const.MONOLITH_LINES - 12));
}

export function skipIntro() {
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
    for (let row = 0; row < Const.MONOLITH_LINES - 12; row++) {
        let scalingValue = 650 * Math.log(row);
        setTimeout(() => {
            monolithDisplayHeightIntro++;
        }, scalingValue);
    }
    shake(Const.MONOLITH_LINES);
}
