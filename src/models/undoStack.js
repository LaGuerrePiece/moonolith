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
    console.log('eventToUndo', eventToUndo);
    for (let i = 0; i < eventToUndo.length; i++) {
        inverseCurrentEvent.push([
            eventToUndo[i][0],
            eventToUndo[i][1],
            monolith[eventToUndo[i][1]][eventToUndo[i][0]],
        ]);
        monolith[eventToUndo[i][1]][eventToUndo[i][0]] = eventToUndo[i][2];
    }
    inverseEventStack.push(inverseCurrentEvent);
    if (inverseEventStack.length > 20) inverseEventStack.shift();
    inverseCurrentEvent = [];
};

const redo = () => {
    if (inverseEventStack.length === 0) return;
    const eventToRedo = inverseEventStack.pop();

    for (let i = 0; i < eventToRedo.length; i++) {
        currentEvent.push([eventToRedo[i][0], eventToRedo[i][1], monolith[eventToRedo[i][1]][eventToRedo[i][0]]]);
        monolith[eventToRedo[i][1]][eventToRedo[i][0]] = eventToRedo[i][2];
    }
    eventStack.push(currentEvent);
    if (eventStack.length > 20) eventStack.shift();
    currentEvent = [];
};

export { closeCurrentEvent, addToCurrentEvent, undo, redo };
