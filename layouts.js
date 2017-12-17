import store from './lib/store';

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
                type: 'sceneSourceToggle',
                scenes: {
                    'Full Screen HDMI': 'HDMI Scene',
                },
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

store.dispatch({ type: 'INIT_LAYOUTS', value: layouts });

export default layouts;