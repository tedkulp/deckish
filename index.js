
const {obs, getScene, getSceneName, setScene, setPreviousScene, toggleSceneItem} = require('./lib/obs');
const {streamDeck, convertKey} = require('./lib/stream_deck');

const mainLayout = [
    [
        {
            type: 'switchScene',
            sceneName: 'Full Screen HDMI',
        },
        {
            type: 'switchScene',
            sceneName: 'Full Desktop Camera',
        },
        {
            type: 'switchScene',
            sceneName: 'Polaroid',
        },
        {
            type: 'switchScene',
            sceneName: 'Keyboard Cam',
        },
        {
            type: 'toggleScene',
            sceneName: 'BRB',
        },
    ],
    [
        {
            type: 'switchScene',
            sceneName: 'Local Browser',
        },
        {
            type: '',
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
            type: '',
        },
        {
            type: '',
        },
        {
            type: '',
        },
    ],
];

streamDeck.on('down', keyIndex => {
    const {row, col} = convertKey(keyIndex);
    console.log('key down row: ', row, "col:", col);

    const keyFound = mainLayout[row] && mainLayout[row][col];
    if (keyFound && keyFound.type) {
        switch(keyFound.type) {
            case 'momentaryScene':
                setScene(keyFound.sceneName);
                break;
        }
    }
});

let sceneToggled = false;

streamDeck.on('up', keyIndex => {
    const {row, col} = convertKey(keyIndex);
    console.log('key up row: ', row, "col:", col);

    const keyFound = mainLayout[row] && mainLayout[row][col];
    if (keyFound && keyFound.type) {
        switch(keyFound.type) {
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
        }
    }
});





// Fill the first button form the left in the first row with a solid red color. This is synchronous.
//streamDeck.fillColor(4, 255, 0, 0);
//console.log('Successfully wrote a red square to key 4.');



