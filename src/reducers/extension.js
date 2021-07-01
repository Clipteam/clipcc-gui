const EXTENSION_ENABLE = 'clipcc-gui/extension/EXTENSION_ENABLE';
const EXTENSION_DISABLE = 'clipcc-gui/extension/EXTENSION_DISABLE';
const EXTENSION_INIT = 'clipcc-gui/extension/EXTENSION_INIT';

const initialState = {
    extension: {}
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case EXTENSION_INIT: {
        if (state.extension.hasOwnProperty(action.extension)) {
            return state;
        }
        const newState = Object.assign({}, state.extension);
        newState[action.id] = {
            ...action.extension,
            enabled: false
        };
        return Object.assign({}, state, {
            extension: newState
        });
    }
    case EXTENSION_ENABLE: {
        if (!state.extension.hasOwnProperty(action.id)) {
            return state;
        }
        const newState = Object.assign({}, state);
        newState.extension[action.id].enabled = true;
        return newState;
    }
    case EXTENSION_DISABLE: {
        if (!state.extension.hasOwnProperty(action.id)) {
            return state;
        }
        const newState = Object.assign({}, state);
        newState.extension[action.id].enabled = false;
        return newState;
    }
    default:
        return state;
    }
};

const initExtension = extension => ({
    type: EXTENSION_INIT,
    id: extension.extensionId,
    extension: extension
});

const enableExtension = id => ({
    type: EXTENSION_ENABLE,
    id: id
});

const disableExtension = id => ({
    type: EXTENSION_DISABLE,
    id: id
});

export {
    reducer as default,
    initialState as extensionInitialState,
    initExtension,
    enableExtension,
    disableExtension
};
