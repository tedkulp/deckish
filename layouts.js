import watch from 'redux-watch'
import store from './lib/store';
import _ from 'lodash';
const { streamDeck, convertKey } = require('./lib/stream_deck');
const { getSceneName, getScene } = require('./lib/obs');
const image = require('./lib/image');

const layouts = {
    main: [
        [
            {
                type: 'switchScene',
                sceneName: 'Full Screen HDMI',
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/scene.png',
                        text: '!Full Screen',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/scene.png',
                        text: 'Full Screen',
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Full Desktop Camera',
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/scene.png',
                        text: 'Full Face',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/scene.png',
                        text: 'Full Face',
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Polaroid',
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/scene.png',
                        text: 'Polaroid',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/scene.png',
                        text: 'Polaroid',
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Keyboard Cam',
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/scene.png',
                        text: 'Key Cam',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/scene.png',
                        text: 'Key Cam',
                    },
                },
            },
            {
                type: 'toggleScene',
                sceneName: 'BRB',
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/pause.png',
                        text: 'BRB',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/pause.png',
                        text: 'BRB',
                    },
                },
            },
        ],
        [
            {
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'HDMI Blurred',
                },
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/gears.png',
                        text: 'Display',
                    },
                    toggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/gears.png',
                        text: 'Display',
                    },
                },
            },
            {
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'HDMI',
                },
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/gears.png',
                        text: 'Blur',
                    },
                    toggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/gears.png',
                        text: 'Blur',
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Room View',
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/scene.png',
                        text: 'Room',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/scene.png',
                        text: 'Room',
                    },
                },
            },
            {
                type: 'switchScene',
                sceneName: 'Starting Up',
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/scene.png',
                        text: 'Starting',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/scene.png',
                        text: 'Starting',
                    },
                },
            },
            {
                type: 'momentaryScene',
                sceneName: 'ZOOM!',
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/scene.png',
                        text: 'ZOOM!',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/scene.png',
                        text: 'ZOOM!',
                    },
                },
            },
        ],
        [
            {
                type: 'none',
            },
            {
                type: 'none',
            },
            {
                type: 'keyBind',
                key: 'w',
                modifiers: ['shift', 'alt', 'control'],
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/crossbones-white.png',
                        text: 'Mute',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/crossbones-white.png',
                        text: 'Mute',
                    },
                }
            },
            {
                type: 'momentaryLayout',
                layoutName: 'sources',
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#33c',
                        backgroundImage: './images/folder.png',
                        text: 'Sources',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/folder.png',
                        text: 'Sources',
                    },
                }
            },
            {
                type: 'momentaryLayout',
                layoutName: 'sounds',
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#33c',
                        backgroundImage: './images/folder.png',
                        text: 'Sounds',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/folder.png',
                        text: 'Sounds',
                    },
                }
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
        [],
        [
            {},
            {},
            {
                type: 'keyBind',
                key: 'e',
                modifiers: ['shift', 'alt', 'control'],
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#000',
                        backgroundImage: './images/crossbones-white.png',
                        text: 'Toggle Mute',
                    },
                }
            },

        ]
    ],
    sources: [
        [
            {
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'Face Camera Scene - Green Screen',
                    'Polaroid': 'Face Camera Scene 2 - Colours',
                },
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#33c',
                        backgroundImage: './images/gears.png',
                        text: 'Face',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/gears.png',
                        text: 'Face',
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
                        type: 'image',
                        color: '#33c',
                        backgroundImage: './images/gears.png',
                        text: 'Desk',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/gears.png',
                        text: 'Desk',
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
                        type: 'image',
                        color: '#33c',
                        backgroundImage: './images/gears.png',
                        text: 'Room',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/gears.png',
                        text: 'Room',
                    },
                },
            },
            {
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'HDMI',
                },
                visual: {
                    untoggled: {
                        type: 'image',
                        color: '#33c',
                        backgroundImage: './images/gears.png',
                        text: 'Blur',
                    },
                    toggled: {
                        type: 'image',
                        color: '#c33',
                        backgroundImage: './images/gears.png',
                        text: 'Blur',
                    },
                },
            },
        ]
    ]
};

store.dispatch({ type: 'INIT_LAYOUTS', value: layouts });

let promises = [];
try {
    promises = _.flattenDeep(_.map(layouts, (layoutButtons, layoutName, idx) => {
        return _.map(layoutButtons, (row, rowIdx) => {
            return _.map(row, async (btn, btnIdx) => {
                let innerPromsies = [];
                if (_.get(btn, 'visual.untoggled.type') === 'image') {
                    const generatedImage = await image.generateImage(btn.visual.untoggled);
                    store.dispatch({ type: 'UPDATE_BUTTON_IMG', layout: layoutName, row: rowIdx, index: btnIdx, image: generatedImage, imageType: 'untoggled' });
                    innerPromsies.push(generatedImage);
                }
                if (_.get(btn, 'visual.toggled.type') === 'image') {
                    const generatedImage = await image.generateImage(btn.visual.toggled);
                    store.dispatch({ type: 'UPDATE_BUTTON_IMG', layout: layoutName, row: rowIdx, index: btnIdx, image: generatedImage, imageType: 'toggled' });
                    innerPromsies.push(generatedImage);
                }
                return innerPromsies;
            });
        });
    }));
} catch (err) {
    console.error(err);
}

const updateActualButtons = (newVal, oldVal) => {
    newVal.forEach(async (val, idx) => {
        if (!_.isEmpty(val)) {
            if (val.type === 'color') {
                streamDeck.fillColor(idx, ...val.color);
            } else if (val.type === 'image') {
                if ((oldVal[idx] && val != oldVal[idx]) && val.image) {
                    streamDeck.fillImage(idx, val.image);
                }
                //const generatedImage = await image.generateImage(val);
                //streamDeck.fillImage(idx, generatedImage);
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
                    const mySceneName = getSceneName();
                    if (key.scenes && key.scenes[mySceneName]) {
                        const sourceName = key.scenes[mySceneName];
                        const foundSceneItem = _.find(currentScene.sources, sceneItem => sceneItem.name === sourceName);
                        if (foundSceneItem && foundSceneItem.render) {
                            return store.dispatch({ type: 'SET_BUTTON', index: idx, value: key.visual.toggled });
                        }
                    }
                    break;
                case 'keyBind':
                    const heldKey = store.getState().currentHeldButton;
                    if (heldKey && key.key === heldKey.key.key && key.modifiers === heldKey.key.modifiers) {
                        return store.dispatch({ type: 'SET_BUTTON', index: idx, value: key.visual.toggled });
                    }
                    break;
            }
        }

        if (key.visual.untoggled) {
            if (key.type) {
                switch (key.type) {
                    case 'sceneSourceToggle':
                        const currentScene = getScene();
                        const currentSceneName = getSceneName();
                        if (key.scenes && key.scenes[currentSceneName]) {
                            const sourceName = key.scenes[currentSceneName];
                            const foundSceneItem = _.find(currentScene.sources, sceneItem => sceneItem.name === sourceName);
                            if (foundSceneItem && !foundSceneItem.render) {
                                return store.dispatch({ type: 'SET_BUTTON', index: idx, value: key.visual.untoggled });
                            }
                        }
                        break;
                    default:
                        return store.dispatch({ type: 'SET_BUTTON', index: idx, value: key.visual.untoggled });
                }
            } else {
                return store.dispatch({ type: 'SET_BUTTON', index: idx, value: key.visual.untoggled });
            }
        }
    }
};

const updateButtonState = (newVal, oldVal, objectPath) => {
    console.log('[debug] \'%s\' changed from %s to %s', objectPath, oldVal, newVal);

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

let currentHeldButtonWatcher = watch(store.getState, 'currentHeldButton');
store.subscribe(currentHeldButtonWatcher(updateButtonState));

// Wait for all the images to be generated
// before updating all the buttons
Promise.all(promises).then(hmm => {
    let { currentLayout, previousLayout } = store.getState();
    updateButtonState(currentLayout, previousLayout, 'currentLayout');
});

export default layouts;