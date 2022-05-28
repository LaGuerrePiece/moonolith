//prettier-ignore
import { changeViewPos, increaseZoom, decreaseZoom, scaleFactor } from '../display/view';
import { canvas } from '../display/displayLoop';
import { startUsingTool } from '../monolith/tools';
import { clickManager } from './controls';
import { GUICatalog } from '../display/GUI';
import { FAQ, displayFAQ } from '../display/FAQ';
import { isInCircle, isInSquare, mousePosInGrid } from '../utils/conversions';

var prevTouchY = null;
var prevTouchX = null;
export var panMode = true;
let pinchTimeStamp = new Date();

export function mobileEventListener() {
    var hammertime = new Hammer(canvas);

    hammertime.get('pinch').set({ enable: true });

    hammertime.on('pinch', (e) => {
        pinchTimeStamp = new Date();
        if (!panMode) return;
        if (e.scale > 1) increaseZoom(0.02);
        else decreaseZoom(0.02);
    });

    hammertime.on('tap', (e) => {
        touchManager(e);
    });

    document.addEventListener(
        'touchmove',
        (e) => {
            e.preventDefault();
            touchManager(e);
        },
        { passive: false }
    );
    document.addEventListener('touchend', (e) => {
        touchManager(e);
    });
    document.addEventListener('touchstart', (e) => {
        touchManager(e);
    });
}

function togglePanMode() {
    panMode = !panMode;
    GUICatalog.palette.display = !GUICatalog.palette.display;
    GUICatalog.selectorA.display = !GUICatalog.selectorA.display;
    GUICatalog.mobileDraw.display = !GUICatalog.mobileDraw.display;
    GUICatalog.mobileMove.display = !GUICatalog.mobileMove.display;
}

function touchManager(e) {
    if (new Date() - pinchTimeStamp < 300) return;
    if (e.type == 'tap') {
        e = {
            x: Math.floor(e.center.x),
            y: Math.floor(e.center.y),
            type: 'touch',
            button: 0,
        };
        const mousePos = mousePosInGrid(e);

        if (FAQ) {
            clickManager(e);
        } else {
            // prettier-ignore
            if (isInSquare(mousePos, 0, GUICatalog.mobileDraw.img.width, 0, GUICatalog.mobileDraw.img.height, 'mobileDraw', 'GUICatalog')) {
                togglePanMode();
            } else if (isInCircle(mousePos, 38, 74, 13, 'planLogos', 'imageCatalog')) {
                window.open('https://discord.gg/RTeJgSwacN', '_blank');
            } else if (isInCircle(mousePos, 72, 72, 13, 'planLogos', 'imageCatalog')) {
                window.open('https://github.com/laguerrepiece/moonolith', '_blank');
            } else if (isInCircle(mousePos, 58, 116, 15, 'planLogos', 'imageCatalog')) {
                displayFAQ('FAQ');
            } else if (isInCircle(mousePos, 21, 21, 18, 'faqButtonOpen', 'GUICatalog') && GUICatalog.faqButtonOpen.display) {
                displayFAQ('FAQ')
            } else if (isInSquare(mousePos, 141, 150, 84, 91, 'plan0', 'imageCatalog')) {
                window.open('https://twitter.com/moonolith_eth');
            } else if (!panMode) clickManager(e);
        }
    } else if (panMode) {
        touchPan(e);
    } else if (!panMode) {
        touchDraw(e);
    }

    // prettier-ignore
    function touchDraw(e) {
        e = {
            x: Math.floor(e.changedTouches[0].clientX),
            y: Math.floor(e.changedTouches[0].clientY),
            type: 'touch',
            button: 0,
        };
        if (isInSquare(mousePosInGrid({ x: e.x, y: e.y }), 0, GUICatalog.palette.img.width, 0, GUICatalog.palette.img.height, 'palette', 'GUICatalog')) return
        startUsingTool(e);
    }

    function touchPan(e) {
        if (e.type === 'touchstart') {
            prevTouchY = e.touches[0].clientY;
            prevTouchX = e.touches[0].clientX;
        } else if (e.type === 'touchmove') {
            const touch = e.touches[0];
            const changedY = touch.clientY - prevTouchY;
            const changedX = touch.clientX - prevTouchX;
            if (scaleFactor == 1) changeViewPos(-Math.floor(changedX / 2), Math.floor(changedY));
            else changeViewPos(-Math.floor(changedX / 2), Math.floor(changedY / 2));
            prevTouchY = Math.floor(e.changedTouches[0].clientY);
            prevTouchX = Math.floor(e.changedTouches[0].clientX);
        } else if (e.type === 'touchend') {
            prevTouchY = null;
            prevTouchX = null;
        }
    }
}

export function setPanMode(mode) {
    if (mode === panMode) return;
    else togglePanMode();
}
