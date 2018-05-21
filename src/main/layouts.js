import watch from 'redux-watch'
import _ from 'lodash';

import store from './lib/store';
import { streamDeck, convertKey } from './lib/stream_deck';
import { getSceneName, getScene } from './lib/obs';
import image from './lib/image';
import ConfigFile from './lib/config-file';

const configFile = new ConfigFile();
let subscribed = false;

export function load() {
    store.dispatch({ type: 'CLEAR_LAYOUTS' });

    const layouts = configFile.load().get();
    
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
        console.log('[debug] \'%s\' changed from %s to %s', objectPath, _.get(oldVal, 'name', oldVal), _.get(newVal, 'name', newVal));
    
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
    
    if (!subscribed) {
        let currentLayoutWatcher = watch(store.getState, 'currentLayout');
        store.subscribe(currentLayoutWatcher(updateButtonState));
        
        let currentLayoutWatcherTwo = watch(store.getState, 'currentScene');
        store.subscribe(currentLayoutWatcherTwo(updateButtonState));
        
        let currentHeldButtonWatcher = watch(store.getState, 'currentHeldButton');
        store.subscribe(currentHeldButtonWatcher(updateButtonState));

        subscribed = true;
    }
    
    // Wait for all the images to be generated
    // before updating all the buttons
    Promise.all(promises).then(hmm => {
        let { currentLayout, previousLayout } = store.getState();
        updateButtonState(currentLayout, previousLayout, 'currentLayout');
    });
}

export default {
    load,
};