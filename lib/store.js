import { createStore } from 'redux';

const initialState = {
    currentLayout: 'main',
    previousLayout: 'main',
    currentMomentaryButton: null,
};

const reducer = (state = initialState, action) => {
    // console.log(state, action);
    switch(action.type) {
        case "SET_INITIAL_SCENE":
            return {
                ...state,
                currentScene: action.value,
                previousScene: action.value,
            };
        case "SET_SCENE":
            return {
                ...state,
                currentScene: action.value,
                previousScene: state.currentScene,
            };
        case "SET_LAYOUT":
            return {
                ...state,
                currentLayout: action.value,
                previousLayout: state.currentLayout,
            };
        case "REVERT_LAYOUT":
            return {
                ...state,
                currentLayout: state.previousLayout,
                previousLayout: state.currentLayout,
            };
        case "SET_MOMENTARY_BUTTON":
            return {
                ...state,
                currentMomentaryButton: action.value,
            };
        case "CLEAR_MOMENTARY_BUTTON":
            return {
                ...state,
                currentMomentaryButton: null,
            };
        case "INIT_LAYOUTS":
            return {
                ...state,
                layouts: action.value,
            };
    }
};

let store = createStore(reducer);

store.subscribe(() => {
    console.log(store.getState());
});

export default store;