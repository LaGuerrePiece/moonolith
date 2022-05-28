import Const from '../constants';
import { playSound } from '../assets/sounds';
import { drawPixel, getColor } from './monolith';
import { convertToMonolithPos, mousePosInGrid } from '../utils/conversions';
import { closeCurrentEvent } from './undoStack';
import { canvas } from '../display/displayLoop';
import { updatePalette } from '../display/GUI';

export let tool = 'smol';
let colorPicked1 = Const.RGB16;
let colorPicked2 = Const.DEFAULT_COLOR;
export let colorNumber1 = 1;
export let colorNumber2 = 16;

let button;

export function startUsingTool(e, mousePos) {
    if (e.button == 1) {
        colorPicker(mousePos);
        e.preventDefault();
        return;
    }
    button = e.button;
    useTool(e);
    canvas.onmousemove = useTool;
    canvas.onmouseup = () => {
        closeCurrentEvent();
        canvas.onmousemove = null;
    };
}

function useTool(e) {
    const color = button === 0 ? colorPicked1 : colorPicked2;
    const zIndex =
        color[0] === Const.DEFAULT_COLOR[0] &&
        color[1] === Const.DEFAULT_COLOR[1] &&
        color[2] === Const.DEFAULT_COLOR[2]
            ? undefined
            : 0;

    //If e is passed it's already formated, else it's a mouse event
    const mousePos = e.type ? convertToMonolithPos(mousePosInGrid({ x: e.x, y: e.y })) : e;
    if (!mousePos) return;

    switch (tool) {
        case 'smol':
            drawPixel(mousePos.x, mousePos.y, zIndex, color);
            break;
        case 'medium':
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, zIndex, color);
                }
            }
            break;
        case 'large':
            for (let i = -2; i <= 2; i++) {
                for (let j = -2; j <= 2; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, zIndex, color);
                }
            }
            for (let i = -1; i <= 1; i++) {
                drawPixel(mousePos.x + i, mousePos.y + 3, zIndex, color);
                drawPixel(mousePos.x + i, mousePos.y - 3, zIndex, color);
                drawPixel(mousePos.x + 3, mousePos.y + i, zIndex, color);
                drawPixel(mousePos.x - 3, mousePos.y + i, zIndex, color);
            }
            break;
        case 'giga':
            for (let i = -50; i <= 50; i++) {
                for (let j = -50; j <= 50; j++) {
                    drawPixel(mousePos.x + i, mousePos.y + j, zIndex, color);
                }
            }
            break;
    }
}

export function brushSwitch() {
    switch (tool) {
        case 'smol':
            playSound('clickB2B', 50);
            tool = 'medium';
            break;
        case 'medium':
            playSound('clickB2C', 50);
            tool = 'large';
            break;
        case 'large':
            playSound('clickB2', 50);
            tool = 'smol';
            break;
        case 'giga':
            playSound('clickB2', 50);
            tool = 'smol';
            break;
    }
    updatePalette();
}

export function selectBrush(brush) {
    tool = brush;
    updatePalette();
}

function colorPicker(mousePos) {
    const color = getColor(mousePos.x, mousePos.y);
    for (let i = 0; i < Const.GUI_PALETTE.length; i++) {
        if (
            color[0] === Const.GUI_PALETTE[i][0] &&
            color[1] === Const.GUI_PALETTE[i][1] &&
            color[2] === Const.GUI_PALETTE[i][2]
        ) {
            colorSwitch({ button: 0 }, i + 1);
            return;
        }
    }
}

export function colorSwitch(e, color) {
    if (e.button == 0) {
        if (color === colorNumber2) {
            colorNumber2 = colorNumber1;
            colorPicked2 = Const.GUI_PALETTE[colorNumber1 - 1];
        }
        colorNumber1 = color;
        colorPicked1 = Const.GUI_PALETTE[color - 1];
    } else if (e.button == 2) {
        if (color === colorNumber1) {
            colorNumber1 = colorNumber2;
            colorPicked1 = Const.GUI_PALETTE[colorNumber2 - 1];
        }
        colorNumber2 = color;
        colorPicked2 = Const.GUI_PALETTE[color - 1];
    }
    playSound('click6', 50);
}
