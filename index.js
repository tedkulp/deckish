
const {obs, getScene, getSceneName, setScene, setPreviousScene, toggleSceneItem} = require('./lib/obs');
const {streamDeck, convertKey} = require('./lib/stream_deck');

const robot = require('robotjs');

import store from './lib/store';
import './layouts';

streamDeck.on('down', keyIndex => {
    const { row, col } = convertKey(keyIndex);
    const { currentLayout, layouts } = store.getState();

    // console.log('key down row: ', row, "col:", col);

    const keyFound = layouts[currentLayout][row] && layouts[currentLayout][row][col];
    if (keyFound && keyFound.type) {
        switch(keyFound.type) {
            case 'momentaryScene':
                setScene(keyFound.sceneName);
                break;
            case 'momentaryLayout':
                if (keyFound.layoutName && layouts[keyFound.layoutName]) {
                    store.dispatch({ type: 'SET_LAYOUT', value: keyFound.layoutName });
                    store.dispatch({ type: 'SET_MOMENTARY_BUTTON', value: { key: keyFound, x: col, y: row }});
                }
                break;
            case 'keyBind':
                if (keyFound.key) {
                    robot.keyToggle(keyFound.key, "down", keyFound.modifiers || []);
                    store.dispatch({ type: 'SET_HELD_BUTTON', value: { key: keyFound, x: col, y: row, index: keyIndex }});
                }
                break;
        }
    }
});

let sceneToggled = false;

streamDeck.on('up', keyIndex => {

    const { row, col } = convertKey(keyIndex);
    const { currentLayout, currentMomentaryButton, layouts } = store.getState();

    // console.log('key up row: ', row, "col:", col);

    const keyFound = (currentMomentaryButton && currentMomentaryButton.x === col && currentMomentaryButton.y === row && currentMomentaryButton.key) ||
        (layouts[currentLayout][row] && layouts[currentLayout][row][col]);
    if (keyFound && keyFound.type) {
        switch(keyFound.type) {
            case 'debug':
                if (keyFound.message)
                    console.log(keyFound.message);
                break;
            case 'switchScene':
                sceneToggled = false;
                setScene(keyFound.sceneName);
                break;
            case 'momentaryScene':
                setPreviousScene();
                break;
            case 'toggleScene':
                if (!sceneToggled) {
                    setScene(keyFound.sceneName);
                } else {
                    setPreviousScene();
                }
                sceneToggled = !sceneToggled;
                break;
            case 'sceneSourceToggle':
                if (keyFound.scenes) {
                    const currentSceneName = getSceneName();
                    if (keyFound.scenes[currentSceneName]) {
                        const sceneItemName = keyFound.scenes[currentSceneName];
                        toggleSceneItem(currentSceneName, sceneItemName);
                    }
                }
                break;
            case 'globalSceneSourceToggle':
                if (keyFound.scene && keyFound.source) {
                    toggleSceneItem(keyFound.scene, keyFound.source);
                }
                break;
            case 'momentaryLayout':
                store.dispatch({ type: 'CLEAR_MOMENTARY_BUTTON' });
                if (keyFound.layoutName && keyFound.layoutName === currentLayout) {
                    store.dispatch({ type: 'REVERT_LAYOUT' });
                }
                break;
            case 'keyBind':
                store.dispatch({ type: 'CLEAR_HELD_BUTTON' });
                if (keyFound.key) {
                    robot.keyToggle(keyFound.key, "up", keyFound.modifiers || []);
                }
                break;
            case "previewTransition":
                obs.transitionToProgram();
                break;
            case "toggleStudio":
                obs.toggleStudioMode();
                break;
        }
    }
});





// Fill the first button form the left in the first row with a solid red color. This is synchronous.
//streamDeck.fillColor(4, 255, 0, 0);
//console.log('Successfully wrote a red square to key 4.');



