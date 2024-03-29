const ACTIVATE_CUSTOM_PROCEDURES = 'clipcc-gui/custom-procedures/ACTIVATE_CUSTOM_PROCEDURES';
const DEACTIVATE_CUSTOM_PROCEDURES = 'clipcc-gui/custom-procedures/DEACTIVATE_CUSTOM_PROCEDURES';
const SET_CALLBACK = 'clipcc-gui/custom-procedures/SET_CALLBACK';

const initialState = {
    active: false,
    mutator: null,
    callback: null,
    create: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case ACTIVATE_CUSTOM_PROCEDURES:
        return Object.assign({}, state, {
            active: true,
            mutator: action.mutator,
            callback: action.callback,
            create: action.create
        });
    case DEACTIVATE_CUSTOM_PROCEDURES:
        // Can be called without a mutator to deactivate without new procedure
        // i.e. when clicking on the modal background
        if (action.mutator) {
            state.callback(action.mutator);
        }
        return Object.assign({}, state, {
            active: false,
            mutator: null,
            callback: null,
            create: false
        });
    case SET_CALLBACK:
        return Object.assign({}, state, {callback: action.callback});
    default:
        return state;
    }
};

/**
 * Action creator to open the custom procedures modal.
 * @param {!Element} mutator The XML node of the mutator for the procedure.
 * @param {!function(!Element)} callback The function to call when done editing procedure.
 *     Expect the callback to be a function that takes a new XML mutator node.
 * @param {!boolean} create Create a new procedure or edit an existing one.
 * @returns {object} An action object with type ACTIVATE_CUSTOM_PROCEDURES.
 */
const activateCustomProcedures = (mutator, callback, create) => ({
    type: ACTIVATE_CUSTOM_PROCEDURES,
    mutator: mutator,
    callback: callback,
    create: create
});

/**
 * Action creator to close the custom procedures modal.
 * @param {?Element} mutator The new mutator, or null if the callback should not be called.
 * @returns {object} An action object with type ACTIVATE_CUSTOM_PROCEDURES.
 */
const deactivateCustomProcedures = mutator => ({
    type: DEACTIVATE_CUSTOM_PROCEDURES,
    mutator: mutator
});

export {
    reducer as default,
    initialState as customProceduresInitialState,
    activateCustomProcedures,
    deactivateCustomProcedures
};
