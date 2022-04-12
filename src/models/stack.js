let eventStack = [];
let inverseEventStack = [];

let currentEvent = [];
let inverseCurrentEvent = [];

const closeCurrentEvent = () => {
    if (currentEvent.length === 0) return;
    eventStack.push(currentEvent);
    if (eventStack.length > 20) eventStack.shift();
    currentEvent = [];
};

//When using move or erase_all_pixels, we need to save the old grid to revert back to it
const addGridToCurrentEvent = (persistent) => {
    console.log('addGridToCurrentEvent');
    eventStack.push({ type: 'grid', persistent });
};

const addToCurrentEvent = (pos, oldKlon) => {
    currentEvent.push([pos, oldKlon]);
};

const undo = (grid) => {
    if (eventStack.length === 0) return grid;
    const eventToUndo = eventStack.pop();

    //Case : the event is a saved grid
    if (!Array.isArray(eventToUndo)) {
        console.log('eventToUndo', eventToUndo.persistent);

        inverseEventStack.push({ type: 'grid', persistent: structuredClone(grid.persistent) });
        if (inverseEventStack.length > 20) inverseEventStack.shift();

        grid.persistent = eventToUndo.persistent;

        return grid;
    }
    //Case : the event is a series of saved klons
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

    //Case : the event is a saved grid
    if (!Array.isArray(eventToRedo)) {
        console.log('eventToRedo', eventToRedo.persistent);

        eventStack.push({ type: 'grid', persistent: structuredClone(grid.persistent) });
        if (eventStack.length > 20) eventStack.shift();

        grid.persistent = eventToRedo.persistent;
        return grid;
    }
    //Case : the event is a series of saved klons
    for (let i = 0; i < eventToRedo.length; i++) {
        currentEvent.push([eventToRedo[i][0], grid.persistent[eventToRedo[i][0]]]);
        grid.persistent[eventToRedo[i][0]] = eventToRedo[i][1];
    }
    eventStack.push(currentEvent);
    if (eventStack.length > 20) eventStack.shift();
    currentEvent = [];

    return grid;
};

export { closeCurrentEvent, addToCurrentEvent, addGridToCurrentEvent, undo, redo };
