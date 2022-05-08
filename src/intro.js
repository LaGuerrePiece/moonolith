import { chunkImport, setMonoHeight } from './main';
import { changeViewPos } from './display/view';
import { displayPalette } from './display/GUI';
import { initDisplay } from './display/displayLoop';
import { animCatalog, launchAnim } from './display/animations';
import { shake } from './display/displayLoop';
import { imageCatalog, displayImage } from './display/images';
import { unlockControls } from './controls/controls';
import { buildMonolith } from './monolith/monolith';
import { toggleMusic } from './assets/sounds';
import Const from './constants';

export let monolithDisplayHeightIntro = 0;
export let introState = false;

export async function launchIntro() {
    introState = true;
    console.log('changing viewPos to the sky');
    changeViewPos(0, 400); // aller dans le ciel
    initDisplay();
    console.log('launching collision anim');
    launchAnim('collision');
    console.log('waiting 2 secs...');
    setTimeout(async () => {
        console.log('move viewPos :');
        let magrossebite = chunkImport(true);
        let mongrosbite = setMonoHeight();
        for (let i = 400; i > 110; i--) {
            setTimeout(function () {
                changeViewPos(0, -1);
            }, i * 10);
        }
        setTimeout(() => {
            launchAnim('runPlan0');
        }, 4500);
        setTimeout(() => {
            launchAnim('runPlan1');
        }, 5800);
        setTimeout(() => {
            displayImage('topAlien');
        }, 10000);

        //animCatalog.courgette1.display = true; // lancer l' anim d'invocation
        await mongrosbite;
        buildMonolith();
        setTimeout(() => {
            monolithGoUpDuringIntro();
        }, 6500);
        await magrossebite;
        setTimeout(() => {
            console.log('intro done');
            launchAnim('panneauRainbow');

            toggleMusic();
            introState = false;
            displayPalette();
            unlockControls();
        }, 15000);
    }, 5000);
    // lazyParseAPNG();
}

export function monolithGoUpDuringIntro() {
    // grows monolith
    setTimeout(() => {
        for (let rowAdded = 0; rowAdded < Const.MONOLITH_LINES; rowAdded++) {
            let scalingValue = 1000 * Math.log(rowAdded);
            setTimeout(() => {
                monolithDisplayHeightIntro++;
            }, scalingValue);
        }
        shake(Const.MONOLITH_LINES);
    }, 1000);
}
