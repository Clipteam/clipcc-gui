const UPDATE = 'clipcc-gui/settings/UPDATE';
const NEW_ITEM = 'clipcc-gui/settings/NEW_ITEM';
const RESET_DEFAULT = 'clipcc-gui/settings/RESET_DEFAULT';

const defaultState = {
    layoutStyle: 'scratch3',
    darkMode: 'system',
    blur: false,
    seamless: false,
    autosave: false,
    autosaveInterval: 120,
    framerate: 30,
    compiler: false,
    hqpen: false,
    compatibility: 'donotload',
    compression: 6,
    hideNonOriginalBlocks: false,
    saveSettings: false,
    saveExtension: true,
    saveOptionalExtension: false,
    stageX: 480,
    stageY: 360,
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
    case NEW_ITEM:
        if (state.hasOwnProperty(action.key)) {
            // if the setting item already exists
            return state;
        }
        state[action.key] = action.defaultValue;
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

const addNewSetting = (key, defaultValue) => ({
    type: NEW_ITEM,
    key,
    defaultValue
});

const resetSettingsToDefault = () => ({
    type: RESET_DEFAULT
});

export {
    reducer as default,
    initialState as settingsInitialState,
    updateSetting,
    addNewSetting,
    resetSettingsToDefault
};
