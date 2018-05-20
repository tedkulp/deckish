import _ from 'lodash';
import store from './store';
import OBSWebSocket from 'obs-websocket-js';

export const obs = new OBSWebSocket();

const hostname = 'localhost:4444';
let   reconnecting = false;

const reconnectToOBS = () => {
    return obs.connect({ address: hostname })
    .then(() => reconnecting = false)
    .then(() => obs.getStudioModeStatus())
    .then(data => {
        store.dispatch({ type: 'SET_STUDIO_MODE', value: data.studioMode });
    })
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
    .then(() => reconnecting = false)
    .then(() => obs.getStudioModeStatus())
    .then(data => {
        store.dispatch({ type: 'SET_STUDIO_MODE', value: data.studioMode });
    })
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

obs.onPreviewSceneChanged(data => {
    if (data['scene-name']) data.name = data['scene-name'];
    store.dispatch({ type: 'SET_PREVIEW_SCENE', value: data });
});

obs.onStudioModeSwitched(data => {
    store.dispatch({ type: 'SET_STUDIO_MODE', value: data.newState });
});

obs.onSceneItemVisibilityChanged(data => {
    if (data['scene-name']) data.name = data['scene-name'];
    obs.getCurrentScene().then(currentSceneObj => {
        store.dispatch({ type: 'UPDATE_CURRENT_SCENE', value: currentSceneObj });
    }).catch(err => console.error(err));
});

obs.on('ConnectionClosed', err => {
    if (!reconnecting) {
        console.log('[obs-websocket] Connection closed, attempting to reconnect.');
        reconnectToOBS();
        reconnecting = true;
    }
});

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
    console.error('socket error:', err);
});

export function getScene() {
    return store.getState().currentScene || {};
};

export function getSceneName() {
    return getScene().name || getScene()['scene-name'];
};

const getPreviousScene = () => {
    return store.getState().previousScene || {};
};

const getPreviousSceneName = () => {
    return getPreviousScene().name || getPreviousScene()['scene-name'];
};

export function setScene(sceneName) {
    if (store.getState().studioMode) {
        obs.setPreviewScene({'scene-name': sceneName})
            .catch(err => console.error(err));        
    } else {
        obs.setCurrentScene({'scene-name': sceneName})
            .catch(err => console.error(err));
    }
};

export function setPreviousScene() {
    setScene(getPreviousSceneName());
};

export function toggleSceneItem(sceneName, sceneItemName) {
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

export default {
    obs,
    getScene,
    getSceneName,
    setScene,
    toggleSceneItem,
    setPreviousScene,
};