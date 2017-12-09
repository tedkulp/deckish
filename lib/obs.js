const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

let scene = null;
let previousScene = null;

obs.connect({ address: 'localhost:4444' })
.then(() => obs.getCurrentScene())
.then(currentSceneObj => {
    console.log(currentSceneObj);
    scene = previousScene = currentSceneObj;
});

// TODO: Add some verbose flag or something
obs.onSwitchScenes(data => {
    previousScene = scene;
    scene = data;
});

// You must add this handler to avoid uncaught exceptions.
obs.on('error', err => {
    console.error('socket error:', err);
});

const getScene = () => {
    return scene;
};

const setScene = sceneName => {
    obs.setCurrentScene({'scene-name': sceneName});
};

const setPreviousScene = () => {
    if (previousScene != '')
        obs.setCurrentScene({'scene-name': previousScene.name});
};

const toggleSource = (sceneObj, sourceName) => {
    obs.toggleMute(sourceName);
};

module.exports.obs = obs;
module.exports.getScene = getScene;
module.exports.setScene = setScene;
module.exports.toggleSource = toggleSource;
module.exports.setPreviousScene = setPreviousScene;$9