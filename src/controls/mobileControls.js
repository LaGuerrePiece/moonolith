//prettier-ignore
import { changeViewPos, increaseZoom, decreaseZoom, scaleFactor } from '../display/view';
import { canvas } from '../display/displayLoop';
import { startUsingTool } from '../monolith/tools';
import { clickManager } from './controls';
import { GUICatalog } from '../display/GUI';
import { isInSquare, mousePosInGrid } from '../utils/conversions';

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
    console.log('Pan mode', panMode);
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
        console.log('tap', e);
        if (isInSquare(mousePosInGrid(e), 0, 120, 0, 40, 'mobileDraw')) {
            togglePanMode();
            console.log('Clicked on togglePanMode');
        } else if (!panMode) clickManager(e);
    } else if (panMode) {
        touchPan(e);
    } else if (!panMode) {
        touchDraw(e);
        // updatePalette();
    }

    function touchDraw(e) {
        e = {
            x: Math.floor(e.changedTouches[0].clientX),
            y: Math.floor(e.changedTouches[0].clientY),
            type: 'touch',
            button: 0,
        };
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
