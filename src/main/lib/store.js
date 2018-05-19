const dotProp = require('dot-prop-immutable');
const createStore = require('redux').createStore;

const initialState = {
    currentLayout: 'main',
    previousLayout: 'main',
    currentMomentaryButton: null,
    currentHeldButton: null,
    buttonState: Array(15).fill({}),
    studioMode: false,
};

const reducer = (state = initialState, action) => {
    // console.log(state, action);
    switch(action.type) {
        case "SET_INITIAL_SCENE":
            const tmp = dotProp.set(state, 'currentScene', action.value);
            return dotProp.set(tmp, 'previousScene', action.value);
        case "SET_SCENE":
        case "SET_PREVIEW_SCENE":
            if (!state.studioMode) {
                const tmp2 = dotProp.set(state, 'previousScene', state.currentScene);
                return dotProp.set(tmp2, 'currentScene', action.value);
            } else {
                return state;
            }
        case "UPDATE_CURRENT_SCENE":
            return dotProp
                .set(state, 'currentScene', action.value);
        case "SET_LAYOUT":
            const tmp3 = dotProp.set(state, 'previousLayout', state.currentLayout);
            return dotProp.set(tmp3, 'currentLayout', action.value);
        case "REVERT_LAYOUT":
            const tm4 = dotProp.set(state, 'currentLayout', state.previousLayout);
            return dotProp.set(tm4, 'previousLayout', state.currentLayout);
        case "SET_MOMENTARY_BUTTON":
            return dotProp
                .set(state, 'currentMomentaryButton', action.value);
        case "CLEAR_MOMENTARY_BUTTON":
            return dotProp
                .set(state, 'currentMomentaryButton', null);
        case "SET_HELD_BUTTON":
            return dotProp
                .set(state, 'currentHeldButton', action.value);
        case "CLEAR_HELD_BUTTON":
            return dotProp
                .set(state, 'currentHeldButton', null);
        case "INIT_LAYOUTS":
            return dotProp
                .set(state, 'layouts', action.value);
        case "SET_BUTTON":
            return dotProp
                .set(state, 'buttonState', state.buttonState.map((btn, idx) => {
                    return idx === action.index ? action.value : btn;
                }));
        case "RESET_BUTTON":
            return dotProp
                .set(state, 'buttonState', state.buttonState.map((btn, idx) => {
                    return idx === action.index ? {} : btn;
                }));
        case "SET_STUDIO_MODE":
            return dotProp
                .set(state, 'studioMode', action.value);
        case "UPDATE_BUTTON_IMG":
            return dotProp.set(state, `layouts.${action.layout}.${action.row}.${action.index}.visual.${action.imageType}.image`, action.image);
    }
};

let store = createStore(reducer);

/*
store.subscribe(() => {
    console.log(store.getState());
});
*/

//export default store;
exports.store = store;
