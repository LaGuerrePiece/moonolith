let eventStack = [];
let inverseEventStack = [];

let currentEvent = [];
let inverseCurrentEvent = [];

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

const undo = (grid) => {
    if (eventStack.length === 0) return grid;
    const eventToUndo = eventStack.pop();

    for (let i = 0; i < eventToUndo.length; i++) {
        inverseCurrentEvent.push([eventToUndo[i][0], grid.persistent[eventToUndo[i][0]]]);
        grid.persistent[eventToUndo[i][0]] = eventToUndo[i][1];
    }
    inverseEventStack.push(inverseCurrentEvent);
    if (inverseEventStack.length > 20) inverseEventStack.shift();
    inverseCurrentEvent = [];

    return grid;
};

const redo = (grid) => {
    if (inverseEventStack.length === 0) return grid;
    const eventToRedo = inverseEventStack.pop();

    for (let i = 0; i < eventToRedo.length; i++) {
        currentEvent.push([eventToRedo[i][0], grid.persistent[eventToRedo[i][0]]]);
        grid.persistent[eventToRedo[i][0]] = eventToRedo[i][1];
    }
    eventStack.push(currentEvent);
    if (eventStack.length > 20) eventStack.shift();
    currentEvent = [];

    return grid;
};

export { closeCurrentEvent, addToCurrentEvent, undo, redo };
