const _ = require('lodash');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

import store from './store';

obs.connect({ address: 'localhost:4444' })
.then(() => obs.getCurrentScene())
.then(currentSceneObj => {
    store.dispatch({ type: 'SET_INITIAL_SCENE', value: currentSceneObj });
});

// TODO: Add some verbose flag or something
obs.onSwitchScenes(data => {
    store.dispatch({ type: 'SET_SCENE', value: data });
});

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
    console.error('socket error:', err);
});

const getScene = () => {
    return store.getState().currentScene || {};
};

const getSceneName = () => {
    return getScene().name || getScene()['scene-name'];
};

const getPreviousScene = () => {
    return store.getState().previousScene || {};
};

const getPreviousSceneName = () => {
    return getPreviousScene().name || getPreviousScene()['scene-name'];
};

const setScene = sceneName => {
    obs.setCurrentScene({'scene-name': sceneName})
        .catch(err => console.error(err));
};

const setPreviousScene = () => {
    obs.setCurrentScene({'scene-name': getPreviousSceneName()});
};

const toggleSceneItem = (sceneName, sceneItemName) => {
    // TODO: When the next version of the obj websocket plugin comes out, switch this to use
    // the more direct function for handling scene items
    obs.getSceneList().then(resp => {
        const foundScene = _.find(resp.scenes, foundScene => foundScene.name === sceneName);
        if (foundScene) {
            const foundSceneItem = _.find(foundScene.sources, sceneItem => sceneItem.name === sceneItemName)
            obs.setSourceRender({source: sceneItemName, render: !foundSceneItem.render, 'scene-name': sceneName})
            .catch(err => console.error(err));
        }
    }).catch(err => console.error(err));
};

module.exports.obs = obs;
module.exports.getScene = getScene;
module.exports.getSceneName = getSceneName;
module.exports.setScene = setScene;
module.exports.toggleSceneItem = toggleSceneItem;
module.exports.setPreviousScene = setPreviousScene;