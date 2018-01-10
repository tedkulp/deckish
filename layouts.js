import watch from 'redux-watch'
import store from './lib/store';
import _ from 'lodash';
const { streamDeck, convertKey } = require('./lib/stream_deck');
const { getSceneName, getScene } = require('./lib/obs');

const layouts = {
    main: [
        [
            {
                type: 'switchScene',
                sceneName: 'Full Screen HDMI',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 255, 0],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 0, 0],
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Full Desktop Camera',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 255, 0],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 0, 0],
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Polaroid',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 255, 0],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 0, 0],
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Keyboard Cam',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 255, 0],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 0, 0],
                    },
                },
            },
            {
                type: 'toggleScene',
                sceneName: 'BRB',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 255, 0],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 0, 0],
                    },
                },
            },
        ],
        [
            {
                type: 'switchScene',
                sceneName: 'Local Browser',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 255, 0],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 0, 0],
                    },
                },
            },
            {
                type: 'debug',
                message: "I'm a button on the main layout",
            },
            {
                type: 'switchScene',
                sceneName: 'Room View',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 255, 0],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 0, 0],
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Starting Up',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 255, 0],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 0, 0],
                    },
                },
            },
            {
                type: 'momentaryScene',
                sceneName: 'ZOOM!',
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 255, 0],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 0, 0],
                    },
                },
            },
        ],
        [
            {
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'Face Camera Scene - Green Screen',
                    'Polaroid': 'Face Camera Scene 2 - Colours',
                },
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 0, 255],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 255, 0],
                    },
                },
            },
            {
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'Keyboard Camera Scene',
                },
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 0, 255],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 255, 0],
                    },
                },
            },
            {
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'Room Camera',
                },
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [0, 0, 255],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 255, 0],
                    },
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
                visual: {
                    untoggled: {
                        type: 'color',
                        color: [255, 0, 255],
                    },
                    toggled: {
                        type: 'color',
                        color: [255, 0, 0],
                    },
                },
            },
        ],
    ]
};

store.dispatch({ type: 'INIT_LAYOUTS', value: layouts });

const updateActualButtons = (newVal, oldVal) => {
    newVal.forEach((val, idx) => {
        if (!_.isEmpty(val)) {
            if (val.type === 'color') {
                streamDeck.fillColor(idx, ...val.color);
            }
        } else {
            streamDeck.clearKey(idx);
        }
    });
};

const updateIndividualButtonState = (key, idx) => {
    store.dispatch({ type: 'RESET_BUTTON', index: idx });

    if (key && key.visual) {
        if (key.type && key.visual.toggled) {
            switch (key.type) {
                case 'switchScene':
                case 'toggleScene':
                case 'momentaryScene':
                    const currentSceneName = getSceneName();
                    if (key.sceneName === currentSceneName) {
                        return store.dispatch({ type: 'SET_BUTTON', index: idx, value: key.visual.toggled });
                    }
                    break;
                case 'sceneSourceToggle':
                    const currentScene = getScene();
                    if (key.scenes && key.scenes[currentScene.name]) {
                        const sourceName = key.scenes[currentScene.name];
                        const foundSceneItem = _.find(currentScene.sources, sceneItem => sceneItem.name === sourceName);
                        if (foundSceneItem && foundSceneItem.render) {
                            return store.dispatch({ type: 'SET_BUTTON', index: idx, value: key.visual.toggled });
                        }
                    }
                    break;
            }
        }

        if (key.visual.untoggled) {
            return store.dispatch({ type: 'SET_BUTTON', index: idx, value: key.visual.untoggled });
        }
    }
};

const updateButtonState = (newVal, oldVal, objectPath) => {
    console.log('%s changed from %s to %s', objectPath, oldVal, newVal);

    let layout = store.getState().layouts[store.getState().currentLayout];
    let previousButtonState = store.getState().buttonState;

    for (let idx = 0; idx < 15; idx++) {
        const { row, col } = convertKey(idx);
        let key = layout && layout[row] && layout[row][col];
        updateIndividualButtonState(key, idx);
    }

    let newButtonState = store.getState().buttonState;
    updateActualButtons(newButtonState, previousButtonState);
};

let currentLayoutWatcher = watch(store.getState, 'currentLayout');
store.subscribe(currentLayoutWatcher(updateButtonState));

let currentLayoutWatcherTwo = watch(store.getState, 'currentScene');
store.subscribe(currentLayoutWatcherTwo(updateButtonState));

let { currentLayout, previousLayout } = store.getState();
updateButtonState(currentLayout, previousLayout, 'currentLayout');

export default layouts;