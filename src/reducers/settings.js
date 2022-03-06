const UPDATE = 'clipcc-gui/settings/UPDATE';
const RESET_DEFAULT = 'clipcc-gui/settings/RESET_DEFAULT';

const defaultState = {
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

const initialState = JSON.parse(localStorage.getItem('settings')) || {};
let needUpdate = false;
for (const key in defaultState) {
    if (!initialState.hasOwnProperty(key)) {
        initialState[key] = defaultState[key];
        needUpdate = true;
    }
}
if (needUpdate) localStorage.setItem('settings', JSON.stringify(initialState));

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case UPDATE:
        state[action.key] = action.value;
        localStorage.setItem('settings', JSON.stringify(state));
        return Object.assign({}, state);
    case RESET_DEFAULT:
        localStorage.setItem('settings', JSON.stringify(defaultState));
        return Object.assign({}, defaultState);
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
