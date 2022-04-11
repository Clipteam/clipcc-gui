const NEW_EXTENSION = 'clipcc-gui/extension-settings/NEW_EXTENSION';

const initialState = {};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case NEW_EXTENSION:
        state[action.id] = action.options;
        return Object.assign({}, state);
    default:
        return state;
    }
};

const newExtensionSettings = (id, options) => ({
    type: NEW_EXTENSION,
    id,
    options
});

export {
    reducer as default,
    initialState as extensionSettingsInitialState,
    newExtensionSettings
};
