import { monolith } from './monolith';

// Arrays of events
let eventStack = [];
let inverseEventStack = [];

// Events = Array of changes
// change structure = {x, y, oldColor, oldZIndex}
let currentEvent = [];
let inverseCurrentEvent = [];

const closeCurrentEvent = () => {
    if (currentEvent.length === 0) return;
    eventStack.push(currentEvent);
    if (eventStack.length > 20) eventStack.shift();
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
        inverseCurrentEvent.push({
            x: change.x,
            y: change.y,
            oldColor: monolith[change.y][change.x].target,
            oldZIndex: monolith[change.y][change.x].zIndex,
        });

        monolith[change.y][change.x].setTargetColor(change.oldColor);
        monolith[change.y][change.x].zIndex = change.oldZIndex;
    }

    inverseEventStack.push(inverseCurrentEvent);
    if (inverseEventStack.length > 20) inverseEventStack.shift();
    inverseCurrentEvent = [];
};

const redo = () => {
    if (inverseEventStack.length === 0) return;
    if (currentEvent.length > 0) return;

    const eventToRedo = inverseEventStack.pop();

    for (let change of eventToRedo) {
        currentEvent.push({
            x: change.x,
            y: change.y,
            oldColor: monolith[change.y][change.x].target,
            oldZIndex: monolith[change.y][change.x].zIndex,
        });
        monolith[change.y][change.x].setTargetColor(change.oldColor);
        monolith[change.y][change.x].zIndex = change.oldZIndex;
    }

    eventStack.push(currentEvent);
    if (eventStack.length > 20) eventStack.shift();
    currentEvent = [];
};

export { closeCurrentEvent, addToCurrentEvent, undo, redo };
