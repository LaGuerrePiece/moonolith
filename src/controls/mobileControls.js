//prettier-ignore
import { changeViewPos, increaseZoom, decreaseZoom } from '../display/view';
import { canvas } from '../display/displayLoop';
import { startUsingTool } from '../monolith/tools';
import { clickManager } from './controls';
import { GUICatalog } from '../display/GUI';
import { isInSquare, mousePosInGrid } from '../utils/conversions';

var prevTouchY = null;
var prevTouchX = null;
var panMode = false;

export function mobileEventListener() {
    var hammertime = new Hammer(canvas);

    hammertime.get('pinch').set({ enable: true });
    hammertime.on('pinchend', function (e) {
        //console.log('pinch', e);
        if (e.scale > 2) increaseZoom();
        else if (e.scale < 0.5) decreaseZoom();
    });

    hammertime.on('tap', function (e) {
        touchManager(e);
    });

    // hammertime.on('doubletap', function (e) {
    //     togglePanMode();
    // });

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
        } else clickManager(e);
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
            changeViewPos(-Math.floor(changedX / 2), Math.floor(changedY / 2));
            prevTouchY = Math.floor(e.changedTouches[0].clientY);
            prevTouchX = Math.floor(e.changedTouches[0].clientX);
        } else if (e.type === 'touchend') {
            prevTouchY = null;
            prevTouchX = null;
        }
    }
}
