import VM from 'clipcc-vm';
import storage from '../lib/storage';
import { extensionManager } from 'clipcc-extension';

const SET_VM = 'clipcc-gui/vm/SET_VM';
const defaultVM = new VM(extensionManager);
defaultVM.attachStorage(storage);
const initialState = defaultVM;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_VM:
        return action.vm;
    default:
        return state;
    }
};
const setVM = function (vm) {
    return {
        type: SET_VM,
        vm: vm
    };
};

export {
    reducer as default,
    initialState as vmInitialState,
    setVM
};
