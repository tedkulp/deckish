const _ = require('lodash');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

let currentScene = null;
let previousScene = null;

obs.connect({ address: 'localhost:4444' })
.then(() => obs.getCurrentScene())
.then(currentSceneObj => {
    currentScene = previousScene = currentSceneObj;
});

// TODO: Add some verbose flag or something
obs.onSwitchScenes(data => {
    previousScene = currentScene;
    currentScene = data;
});

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
    console.error('socket error:', err);
});

const getScene = () => {
    return currentScene;
};

const getSceneName = () => {
    return currentScene.name || currentScene['scene-name'];
};

const setScene = sceneName => {
    obs.setCurrentScene({'scene-name': sceneName})
        .catch(err => console.error(err));
};

const setPreviousScene = () => {
    if (previousScene != '')
        obs.setCurrentScene({'scene-name': previousScene.name});
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