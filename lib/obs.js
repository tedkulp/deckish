const _ = require('lodash');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

import store from './store';

const hostname = 'localhost:4444';

const reconnectToOBS = () => {
    return obs.connect({ address: hostname })
    .then(() => obs.getCurrentScene())
    .then(data => {
        if (data['scene-name']) data.name = data['scene-name'];
        store.dispatch({ type: 'SET_SCENE', value: data });
    })
    .then(() => console.log('[obs-websocket] Connected'))
    .catch(err => {
        console.log('[obs-websocket] Can\'t connect, attempting to reconnect in 5 seconds.');
        setTimeout(reconnectToOBS, 5000);
    });
}

const connectToOBS = () => {
    obs.connect({ address: hostname })
    .then(() => obs.getCurrentScene())
    .then(currentSceneObj => {
        store.dispatch({ type: 'SET_INITIAL_SCENE', value: currentSceneObj });
    })
    .then(() => console.log('[obs-websocket] Connected'))
    .catch(err => {
        console.log('[obs-websocket] Can\'t connect, attempting to reconnect in 5 seconds.');
        setTimeout(connectToOBS, 5000);
    });
}

connectToOBS();

// TODO: Add some verbose flag or something
obs.onSwitchScenes(data => {
    if (data['scene-name']) data.name = data['scene-name'];
    store.dispatch({ type: 'SET_SCENE', value: data });
});

obs.onSceneItemVisibilityChanged(data => {
    if (data['scene-name']) data.name = data['scene-name'];
    obs.getCurrentScene().then(currentSceneObj => {
        store.dispatch({ type: 'UPDATE_CURRENT_SCENE', value: currentSceneObj });
    });
});

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
    if (err.code && err.code === 'ECONNRESET') {
        console.log('[obs-websocket] Connection closed, attempting to reconnect in 5 seconds.');
        setTimeout(reconnectToOBS, 5000);
    } else {
        console.error('socket error:', err);
    }
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
    obs.getSceneItemProperties({
        'scene-name': sceneName,
        item: sceneItemName,
    }).then(resp => {
        obs.setSceneItemProperties({
            item: sceneItemName,
            visible: !resp.visible,
            'scene-name': sceneName,
        });
    });
};

module.exports.obs = obs;
module.exports.getScene = getScene;
module.exports.getSceneName = getSceneName;
module.exports.setScene = setScene;
module.exports.toggleSceneItem = toggleSceneItem;
module.exports.setPreviousScene = setPreviousScene;