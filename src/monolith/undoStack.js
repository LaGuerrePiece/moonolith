import Const from '../constants';
import { monolith, monolithIndexes } from './monolith';

// Arrays of events
let eventStack = [];
let inverseEventStack = [];

// Events = Array of changes
// change structure = {x, y, oldColor, oldZIndex}
let currentEvent = [];
let inverseCurrentEvent = [];

const maxSize = 1000;

const closeCurrentEvent = () => {
    if (currentEvent.length === 0) return;
    eventStack.push(currentEvent);
    if (eventStack.length > maxSize) eventStack.shift();
    currentEvent = [];
    inverseEventStack = [];
};

const addToCurrentEvent = (x, y, oldColor, oldZIndex) => {
    currentEvent.push({ x, y, oldColor, oldZIndex });
};

const undo = () => {
    if (eventStack.length === 0) return;
    if (currentEvent.length > 0) return;

    const eventToUndo = eventStack.pop();

    for (let change of eventToUndo) {
        const pos = (change.y * Const.MONOLITH_COLUMNS + change.x) * 4;
        inverseCurrentEvent.push({
            x: change.x,
            y: change.y,
            oldColor: [monolith[pos], monolith[pos + 1], monolith[pos + 2]],
            oldZIndex: monolithIndexes[change.y][change.x],
        });
        monolith[pos] = change.oldColor[0];
        monolith[pos + 1] = change.oldColor[1];
        monolith[pos + 2] = change.oldColor[2];
        monolithIndexes[change.y][change.x] = change.oldZIndex;
    }

    inverseEventStack.push(inverseCurrentEvent);
    if (inverseEventStack.length > maxSize) inverseEventStack.shift();
    inverseCurrentEvent = [];
};

const redo = () => {
    if (inverseEventStack.length === 0) return;
    if (currentEvent.length > 0) return;

    const eventToRedo = inverseEventStack.pop();

    for (let change of eventToRedo) {
        const pos = (change.y * Const.MONOLITH_COLUMNS + change.x) * 4;
        currentEvent.push({
            x: change.x,
            y: change.y,
            oldColor: [monolith[pos], monolith[pos + 1], monolith[pos + 2]],
            oldZIndex: monolithIndexes[change.y][change.x],
        });
        monolith[pos] = change.oldColor[0];
        monolith[pos + 1] = change.oldColor[1];
        monolith[pos + 2] = change.oldColor[2];
        monolithIndexes[change.y][change.x] = change.oldZIndex;
    }

    eventStack.push(currentEvent);
    if (eventStack.length > maxSize) eventStack.shift();
    currentEvent = [];
};

export { closeCurrentEvent, addToCurrentEvent, undo, redo };
