import dotProp from 'dot-prop-immutable';
import { createStore } from 'redux';

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
            return dotProp.setAll(state, {
                currentScene: action.value,
                previousScene: action.value,
            });
        case "SET_SCENE":
            if (!state.studioMode) {
                return dotProp.setAll(state, {
                    currentScene: action.value,
                    previousScene: state.currentScene,
                });
            } else {
                return state;
            }
        case "SET_PREVIEW_SCENE":
            if (state.studioMode) {
                return dotProp.setAll(state, {
                    currentScene: action.value,
                    previousScene: state.currentScene,
                });
            } else {
                return state;
            }
        case "UPDATE_CURRENT_SCENE":
            return dotProp
                .set(state, 'currentScene', action.value);
        case "SET_LAYOUT":
            return dotProp.setAll(state, {
                currentLayout: action.value,
                previousLayout: state.currentLayout,
            });
        case "REVERT_LAYOUT":
            return dotProp.setAll(state, {
                currentLayout: state.previousLayout,
                previousLayout: state.currentLayout,
            })
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
        case "CLEAR_LAYOUTS":
            return dotProp
                .setAll(state, {
                    buttonState: initialState.buttonState,
                    layouts: null,
                    currentHeldButton: initialState.currentHeldButton,
                    currentMomentaryButton: initialState.currentMomentaryButton,
                });
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
            return dotProp
                .set(state, `layouts.${action.layout}.${action.row}.${action.index}.visual.${action.imageType}.image`, action.image);
    }
};

let store = createStore(reducer);

/*
store.subscribe(() => {
    console.log(store.getState());
});
*/

export default store;