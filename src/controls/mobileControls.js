//prettier-ignore
import { increaseZoom, decreaseZoom } from './controls';
import { changeViewPos } from '../main';
import { canvas } from '../display/displayLoop';
import { startUsingTool } from '../monolith/tools';
import { clickManager } from './controls';
import Const from '../constants';

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

    hammertime.on('doubletap', function (e) {
        togglePanMode();
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
        clickManager(e);
    } else {
        //console.log(e);
        if (e.changedTouches[0].pageX < Const.MARGIN_LEFT || e.changedTouches[0].pageX > 370 - Const.MARGIN_RIGHT) {
            touchPan(e);
        } else if (e.touches.length == 1 && e.type == 'touchmove' && e.timeStamp > 3000) {
            console.log(e);
            touchDraw(e);
        }
    }

    //  else if (panMode) {
    //     touchPan(e);
    //     imageCatalog.palette.img = paletteCatalog.palettePAN.img;
    // } else if (!panMode) {
    //     touchDraw(e);
    //     updatePalette();
    // }

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
            let deltaY = e.changedTouches[0].clientY - e.touches[0].clientY;
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
