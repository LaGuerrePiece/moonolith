import { chunkImport, setMonoHeightAndBuildIt, Opensea } from './main';
import { changeViewPos, changeViewPosSmoothly, viewPosY, setInitialViewPos } from './display/view';
import { displayPalette, GUICatalog } from './display/GUI';
import { canvas, initDisplay } from './display/displayLoop';
import { animCatalog, launchAnim } from './display/animations';
import { shake } from './display/displayLoop';
import { displayImage, imageCatalog } from './display/images';
import { deviceType, skipManager, unlockControls, unlockScroll } from './controls/controls';
import { toggleMusic } from './assets/sounds';
import Const from './constants';
import { getBrowserLocales } from './utils/web3';

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

    changeViewPosSmoothly(-390, 3);
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
    monolithDisplayHeightIntro += 17;
    launchAnim('introRunD');

    monolithGoUpDuringIntro();
    if (!introState) return;
    displayImage('TibonomEmporte');
    displayImage('terreRetournee');

    if (!introState) return;

    await new Promise((resolve) => setTimeout(resolve, animCatalog.introRunD.totalDelay));
    unlockScroll();

    if (!introState) return;

    // When monolith is built :
    setTimeout(async () => {
        if (!introState) return;
        console.log('Intro Finished');
        unlockControls();
        displayPanneau();
        toggleMusic();
        displayPalette();
        GUICatalog.skipIntro.display = false;
        imageCatalog.TibonomEmporte.display = false;
        launchAnim('postMonolith');
        await new Promise((resolve) => setTimeout(resolve, animCatalog.postMonolith.totalDelay));
        launchAnim('autourDuFeu');
        introState = false;
    }, 650 * Math.log(Const.MONOLITH_LINES - 7));
}

export function skipIntro(force = false) {
    if (!introState && !force) return;
    console.log('Intro Skipped');
    displayImage('terreRetournee');
    animCatalog.runPlan0.display = false;
    animCatalog.introRunB.display = false;
    animCatalog.introRunC.display = false;
    animCatalog.introRunD.display = false;
    animCatalog.postMonolith.display = false;
    animCatalog.collision.display = false;
    imageCatalog.moon.display = false;
    imageCatalog.TibonomEmporte.display = false;
    GUICatalog.skipIntro.display = false;
    unlockScroll();
    launchAnim('autourDuFeu');
    displayPanneau();
    unlockControls();
    toggleMusic();
    displayPalette();
    setInitialViewPos();
    introState = false;
}

function monolithGoUpDuringIntro() {
    for (let row = 0; row < Const.MONOLITH_LINES - 9; row++) {
        let scalingValue = 650 * Math.log(row);
        setTimeout(() => {
            if (!introState) return;
            monolithDisplayHeightIntro++;
        }, scalingValue);
    }
    shake(Const.MONOLITH_LINES, true);
}

export async function displayPanneau() {
    if (deviceType === 'mobile') return;
    await new Promise((resolve) => setTimeout(resolve, animCatalog.panneauRainbow.autourDuFeu));
    launchAnim('panneauRainbow');
    await new Promise((resolve) => setTimeout(resolve, animCatalog.panneauRainbow.totalDelay));
    let lang = getBrowserLocales()[0];
    if (lang !== 'fr') {
        GUICatalog.panneau.img.src = '/images/panneauQWERTY.png';
    }
    displayImage('panneauDecor');
}
