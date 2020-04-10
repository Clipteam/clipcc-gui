import keyMirror from 'keymirror';
//import CryptoJS from 'crypto-js';

import api from '../lib/api';

const Types = keyMirror({
    SET_LOGIN_ERROR: null,
    SET_LOGIN_OPEN: null
});

const initialState = {
    loginError: null,
    loginOopen: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case Types.SET_LOGIN_ERROR:
        return defaults({loginError: action.loginError}, state);
    case Types.SET_LOGIN_OPEN:
        return defaults({loginOpen: action.isOpen}, state);
    default:
        return state;
    }
};

const setLoginError = function (loginError) {
    return {
        type: Types.SET_LOGIN_ERROR,
        loginError: loginError
    };
};

const setLoginOpen = function (isOpen) {
    return {
        type: Types.SET_LOGIN_OPEN,
        isOpen: isOpen
    };
};

const handleLogin = function (formData, callback) {
    return function (dispatch) {
        dispatch(setLoginError(null));
        formData.useMessages = true;
        api({
            method: 'post',
            host: '',
            uri: '',
            json: formData
        }, (err, body) => {
            if (err) dispatch(setLoginError(err.message));
            if (body) {
                body = body[0];
                if (body.success) {
                    dispatch(setLoginOpen(false));
                    dispatch(sessionActions.refreshSession());
                    callback({success: true});
                }
                dispatch(setLoginError(body.msg));
                callback({success: false});
            }
        });
    };
};

export {
    reducer as default,
    initialState as navigationInitialState,
    handleLogin,
    setLoginError,
    setLoginOpen
};

