import keyMirror from 'keymirror';
import defaults from 'lodash.defaultsdeep';

import {requestSession, requestSessionWithHRetry} from '../lib/session';
//import {getCount} from './message-count';
//import {storePermissions} from './permissions';

const Types = keyMirror({
    SET_SESSION: null,
    SET_SESSION_ERROR: null,
    SET_STATUS: null
});

const banWhitelistPaths = [
    '/accounts/banned-response/',
    '/community_guidelines/',
    '/community_guidelines'
];

const Status = keyMirror({
    FETCHED: null,
    NOT_FETCHED: null,
    FETCHING: null
});

const initialState = {
    status: Status.NOT_FETCHED,
    session: {}
};

const reducer = (state, action) => {
    // Reducer for handling changes to session state
    if (typeof state === 'undefined') {
        state = initialState;
    }
    switch (action.type) {
    case Types.SET_SESSION:
        return defaults({session: action.session}, state);
    case Types.SET_STATUS:
        return defaults({status: action.status}, state);
    case Types.SET_SESSION_ERROR:
        // TODO: do something with action.error
        return state;
    default:
        return state;
    }
};

const setSessionError = error => ({
    type: Types.SET_SESSION_ERROR,
    error: error
});

const setSession = session => ({
    type: Types.SET_SESSION,
    session: session
});

const setStatus = status => ({
    type: Types.SET_STATUS,
    status: status
});

const handleSessionResponse = (dispatch, body) => {
    if (typeof body === 'undefined') {
        return dispatch(setSessionError('No session content'));
    }
    if (
        body.user &&
        body.user.banned &&
        banWhitelistPaths.indexOf(window.location.pathname) === -1
    ) {
        window.location = '/accounts/banned-response/';
        return;
    }
    else if (
        body.flags &&
        body.flags.must_complete_registration &&
        window.location.pathname !== '/classes/complete_registration'
    ) {
        window.location = '/classes/complete_registration';
        return;
    }
    else if (
        body.flags &&
        body.flags.must_reset_password &&
        !body.flags.must_complete_registration &&
        window.location.pathname !== '/classes/student_password_reset/'
    ) {
        window.location = '/classes/student_password_reset/';
        return;
    }
    dispatch(setSession(body));
    dispatch(setStatus(Status.FETCHED));

    // get the permissions from the updated session
    //dispatch(storePermissions(body.permissions));
    //if (typeof body.user !== 'undefined') {
        //dispatch(getCount(body.user.username));
    //}
    return;
};

const refreshSession = () => (dispatch => {
    dispatch(setStatus(Status.FETCHING));
    return new Promise((resolve, reject) => {
        requestSession(resolve, reject);
    }).then(body => {
        handleSessionResponse(dispatch, body);
    }, err => {
        dispatch(setSessionError(err));
    });
});

const refreshSessionWithRetry = () => (dispatch => {
    dispatch(setStatus(Status.FETCHING));
    return new Promise((resolve, reject) => {
        requestSessionWithRetry(resolve, reject, 4, 7500);
    }).then(body => {
        handleSessionResponse(dispatch, body);
    }, err => {
        dispatch(setSessionError(err));
    });
});

export {
    reducer as default,
    initialState as sessionInitialState,
    Status,
    setSessionError,
    setSession,
    setStatus,
    refreshSession,
    refreshSessionWithRetry
};
