import watch from 'redux-watch'
import store from './lib/store';
const { convertKey } = require('./lib/stream_deck');

const layouts = {
    main: [
        [
            {
                type: 'switchScene',
                sceneName: 'Full Screen HDMI',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: 'green',
                    },
                    toggled: {
                        type: 'color',
                        color: 'red',
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Full Desktop Camera',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: 'green',
                    },
                    toggled: {
                        type: 'color',
                        color: 'red',
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Polaroid',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: 'green',
                    },
                    toggled: {
                        type: 'color',
                        color: 'red',
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Keyboard Cam',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: 'green',
                    },
                    toggled: {
                        type: 'color',
                        color: 'red',
                    },
                },
            },
            {
                type: 'toggleScene',
                sceneName: 'BRB',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: 'green',
                    },
                    toggled: {
                        type: 'color',
                        color: 'red',
                    },
                },
            },
        ],
        [
            {
                type: 'switchScene',
                sceneName: 'Local Browser',
            },
            {
                type: 'debug',
                message: "I'm a button on the main layout",
            },
            {
                type: '',
            },
            {
                type: '',
            },
            {
                type: 'momentaryScene',
                sceneName: 'ZOOM!',
            },
        ],
        [
            {
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'Face Camera Scene - Green Screen',
                    'Polaroid': 'Face Camera Scene 2 - Colours',
                },
            },
            {
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'Keyboard Camera Scene',
                },
            },
            {
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'HDMI Scene',
                },
            },
            {
                type: '',
            },
            {
                type: 'momentaryLayout',
                layoutName: 'sounds',
            },
        ],
    ],
    sounds: [
        [
            {
                type: 'debug',
                message: "I'm a button on the sounds layout",
            },
        ],
    ]
};

store.dispatch({ type: 'INIT_LAYOUTS', value: layouts });

const updateButtonState = (newVal, oldVal, objectPath) => {
    console.log('%s changed from %s to %s', objectPath, oldVal, newVal);

    let layout = store.getState().layouts[store.getState().currentLayout];

    for (let idx = 0; idx < 15; idx++) {
        const { row, col } = convertKey(idx);
        let key = layout[row][col];
        if (key && key.visual) {
            if (key.visual.untoggled) {
                store.dispatch({ type: 'SET_BUTTON', index: idx, value: key.visual.untoggled });
            }
        }
    }
};


let w = watch(store.getState, 'currentLayout');
store.subscribe(w(updateButtonState));

let { currentLayout, previousLayout } = store.getState();
updateButtonState(currentLayout, previousLayout, 'currentLayout');

export default layouts;