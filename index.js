
const {obs, getScene, getSceneName, setScene, setPreviousScene, toggleSceneItem} = require('./lib/obs');
const {streamDeck, convertKey} = require('./lib/stream_deck');

const layouts = {
    main: [
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
                type: 'debug',
                message: "I'm a button on the main layout",
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
            },
        ],
    ]
};

let currentLayout = 'main';
let previousLayout = currentLayout;
let currentMomentaryButton = null;

streamDeck.on('down', keyIndex => {
    const {row, col} = convertKey(keyIndex);
    console.log('key down row: ', row, "col:", col);

    const keyFound = layouts[currentLayout][row] && layouts[currentLayout][row][col];
    if (keyFound && keyFound.type) {
        switch(keyFound.type) {
            case 'momentaryScene':
                setScene(keyFound.sceneName);
                break;
            case 'momentaryLayout':
                if (keyFound.layoutName && layouts[keyFound.layoutName]) {
                    previousLayout = currentLayout;
                    currentLayout = keyFound.layoutName;
                    currentMomentaryButton = {key: keyFound, x: col, y: row};
                }
                break;
        }
    }
});

let sceneToggled = false;

streamDeck.on('up', keyIndex => {
    const {row, col} = convertKey(keyIndex);
    console.log('key up row: ', row, "col:", col);

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
            case 'momentaryLayout':
                currentMomentaryButton = null;
                if (keyFound.layoutName && keyFound.layoutName === currentLayout) {
                    currentLayout = previousLayout;
                    previousLayout = keyFound.layoutName;
                }
                break;
        }
    }
});





// Fill the first button form the left in the first row with a solid red color. This is synchronous.
//streamDeck.fillColor(4, 255, 0, 0);
//console.log('Successfully wrote a red square to key 4.');



