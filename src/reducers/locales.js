import {addLocaleData} from 'react-intl';

import {localeData, isRtl} from 'clipcc-l10n';
import editorMessages from 'clipcc-l10n/dist/editor-msgs';

addLocaleData(localeData);

const UPDATE_LOCALES = 'clipcc-gui/locales/UPDATE_LOCALES';
const SELECT_LOCALE = 'clipcc-gui/locales/SELECT_LOCALE';
const ADD_LOCALE = 'clipcc-gui/locales/ADD_LOCALE';

const initialState = {
    isRtl: false,
    locale: 'en',
    messagesByLocale: editorMessages,
    messages: editorMessages.en
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SELECT_LOCALE:
        return Object.assign({}, state, {
            isRtl: isRtl(action.locale),
            locale: action.locale,
            messagesByLocale: state.messagesByLocale,
            messages: state.messagesByLocale[action.locale]
        });
    case UPDATE_LOCALES:
        return Object.assign({}, state, {
            isRtl: state.isRtl,
            locale: state.locale,
            messagesByLocale: action.messagesByLocale,
            messages: action.messagesByLocale[state.locale]
        });
    case ADD_LOCALE:
        let newState = Object.assign({}, state);
        for (const locale in action.messagesByLocale) {
            newState.messagesByLocale[locale] = Object.assign(
                newState.messagesByLocale[locale],
                action.messagesByLocale[locale]
            );
        }
        newState.messages = newState.messagesByLocale[state.locale]
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

const setLocales = function (localesMessages) {
    return {
        type: UPDATE_LOCALES,
        messagesByLocale: localesMessages
    };
};

const addLocales = function (localesMessages) {
    return {
        type: ADD_LOCALE,
        messagesByLocale: localesMessages
    }
}

const initLocale = function (currentState, locale) {
    if (currentState.messagesByLocale.hasOwnProperty(locale)) {
        return Object.assign(
            {},
            currentState,
            {
                isRtl: isRtl(locale),
                locale: locale,
                messagesByLocale: currentState.messagesByLocale,
                messages: currentState.messagesByLocale[locale]
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
    setLocales,
    addLocales
};
