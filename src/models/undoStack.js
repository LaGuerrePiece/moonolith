import { monolith } from './monolith';

// Arrays of events
let eventStack = [];
let inverseEventStack = [];

// Events = Array of changes
// change structure = [x, y, oldKlon]
let currentEvent = [];
let inverseCurrentEvent = [];

const closeCurrentEvent = () => {
    if (currentEvent.length === 0) return;
    eventStack.push(currentEvent);
    if (eventStack.length > 20) eventStack.shift();
    currentEvent = [];
    inverseEventStack = [];
};

const addToCurrentEvent = (x, y, oldKlon) => {
    currentEvent.push([x, y, oldKlon]);
};

const undo = () => {
    if (eventStack.length === 0) return;
    const eventToUndo = eventStack.pop();

    for (let change of eventToUndo) {
        inverseCurrentEvent.push([change[0], change[1], monolith[change[1]][change[0]]]);
        monolith[change[1]][change[0]] = change[2];
    }

    inverseEventStack.push(inverseCurrentEvent);
    if (inverseEventStack.length > 20) inverseEventStack.shift();
    inverseCurrentEvent = [];
};

const redo = () => {
    if (inverseEventStack.length === 0) return;
    const eventToRedo = inverseEventStack.pop();

    for (let change of eventToRedo) {
        currentEvent.push([change[0], change[1], monolith[change[1]][change[0]]]);
        monolith[change[1]][change[0]] = change[2];
    }

    eventStack.push(currentEvent);
    if (eventStack.length > 20) eventStack.shift();
    currentEvent = [];
};

export { closeCurrentEvent, addToCurrentEvent, undo, redo };
