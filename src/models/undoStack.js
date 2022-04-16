import { getMonolith, replaceMonolith } from './monolith';

let eventStack = [];
let inverseEventStack = [];

let currentEvent = [];
let inverseCurrentEvent = [];
let monolith;

const closeCurrentEvent = () => {
    if (currentEvent.length === 0) return;
    eventStack.push(currentEvent);
    if (eventStack.length > 20) eventStack.shift();
    currentEvent = [];
    inverseEventStack = [];
};

const addToCurrentEvent = (pos, oldKlon) => {
    currentEvent.push([pos, oldKlon]);
};

const undo = () => {
    monolith = getMonolith();
    if (eventStack.length === 0) return monolith;
    const eventToUndo = eventStack.pop();

    for (let i = 0; i < eventToUndo.length; i++) {
        inverseCurrentEvent.push([eventToUndo[i][0], monolith[eventToUndo[i][0]]]);
        monolith[eventToUndo[i][0]] = eventToUndo[i][1];
    }
    inverseEventStack.push(inverseCurrentEvent);
    if (inverseEventStack.length > 20) inverseEventStack.shift();
    inverseCurrentEvent = [];

    replaceMonolith(monolith);
};

const redo = () => {
    monolith = getMonolith();
    if (inverseEventStack.length === 0) return monolith;
    const eventToRedo = inverseEventStack.pop();

    for (let i = 0; i < eventToRedo.length; i++) {
        currentEvent.push([eventToRedo[i][0], monolith[eventToRedo[i][0]]]);
        monolith[eventToRedo[i][0]] = eventToRedo[i][1];
    }
    eventStack.push(currentEvent);
    if (eventStack.length > 20) eventStack.shift();
    currentEvent = [];

    replaceMonolith(monolith);
};

export { closeCurrentEvent, addToCurrentEvent, undo, redo };
