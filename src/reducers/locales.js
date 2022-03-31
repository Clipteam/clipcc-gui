import {cloneDeep} from 'lodash';

import {isRtl} from 'clipcc-l10n';
import editorMessages from 'clipcc-l10n/dist/editor-msgs';

const UPDATE_LOCALE = 'clipcc-gui/locales/UPDATE_LOCALE';
const SELECT_LOCALE = 'clipcc-gui/locales/SELECT_LOCALE';
const ADD_LOCALE = 'clipcc-gui/locales/ADD_LOCALE';

const DEFAULT_LANGUAGE = 'default';

const initialState = {
    isRtl: false,
    locale: 'en',
    messagesByLocale: {
        [DEFAULT_LANGUAGE]: cloneDeep(editorMessages.en),
        ...editorMessages
    },
    messages: Object.assign({},
        editorMessages[DEFAULT_LANGUAGE],
        editorMessages.en
    )
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SELECT_LOCALE:
        return Object.assign({}, state, {
            isRtl: isRtl(action.locale),
            locale: action.locale,
            messages: Object.assign({},
                state.messagesByLocale[DEFAULT_LANGUAGE],
                state.messagesByLocale[action.locale]
            )
        });
    case UPDATE_LOCALE:
        Object.assign(state.messages,
            state.messagesByLocale[DEFAULT_LANGUAGE],
            state.messagesByLocale[state.locale]
        );
        return state;
    case ADD_LOCALE:
        const newState = Object.assign({}, state);
        for (const locale in action.messagesByLocale) {
            newState.messagesByLocale[locale] = Object.assign({},
                newState.messagesByLocale[locale],
                action.messagesByLocale[locale]
            );
        }
        return newState;
    default:
        return state;
    }
};

const selectLocale = function (locale) {
    return {
        type: SELECT_LOCALE,
        locale: locale
    };
};

const updateLocale = function () {
    return {
        type: UPDATE_LOCALE
    };
};

const addLocales = function (localesMessages) {
    return {
        type: ADD_LOCALE,
        messagesByLocale: localesMessages
    };
};

const initLocale = function (currentState, locale) {
    if (currentState.messagesByLocale.hasOwnProperty(locale)) {
        return Object.assign(
            {},
            currentState,
            {
                isRtl: isRtl(locale),
                locale: locale,
                messages: Object.assign({},
                    currentState.messagesByLocale[DEFAULT_LANGUAGE],
                    currentState.messagesByLocale[locale]
                )
            }
        );
    }
    // don't change locale if it's not in the current messages
    return currentState;
};
export {
    reducer as default,
    initialState as localesInitialState,
    initLocale,
    selectLocale,
    updateLocale,
    addLocales
};
