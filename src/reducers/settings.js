const UPDATE = 'clipcc-gui/settings/UPDATE';
const RESET_DEFAULT = 'clipcc-gui/settings/RESET_DEFAULT';

const initialState = {
    layoutStyle: 'scratch3',
    darkMode: 'system',
    blur: true,
    seamless: false,
    autosave: false,
    autosaveInterval: 120,
    framerate: 30,
    compatibility: 'donotload',
    compression: 6
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') {
        state = {};
        for (const key in initialState) {
            state[key] = localStorage.getItem(key) || initialState[key];
        }
    }
    switch (action.type) {
    case UPDATE:
        localStorage.setItem(action.key, action.value);
        state[action.key] = action.value;
        return Object.assign({}, state);
    case RESET_DEFAULT:
        for (const key in initialState) {
            localStorage.setItem(key, initialState[key]);
        }
        return Object.assign({}, initialState);
    default:
        return state;
    }
};

const updateSetting = (key, value) => ({
    type: UPDATE,
    key,
    value
});

const resetSettingsToDefault = () => ({
    type: RESET_DEFAULT
});

const getSetting = (state, key) => state.scratchGui.settings[key];

export {
    reducer as default,
    initialState as settingsInitialState,
    updateSetting,
    resetSettingsToDefault,
    getSetting
};
