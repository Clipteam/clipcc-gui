const SET_LOAD_ERROR = 'clipcc-gui/load-error/SET_LOAD_ERROR';

const initialState = {
    errorId: '',
    detail: '',
    missingExtensions: []
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    if (action.type === SET_LOAD_ERROR) {
        return Object.assign({}, initialState, action.data);
    }
    return state;
};

const setLoadError = function (data) {
    return {
        type: SET_LOAD_ERROR,
        data: data
    };
};

export {
    reducer as default,
    initialState as loadErrorInitialState,
    setLoadError
};
