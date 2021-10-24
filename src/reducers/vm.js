import VM from 'clipcc-vm';
import storage from '../lib/storage';
import {appVersion} from '../lib/app-info';

const SET_VM = 'clipcc-gui/vm/SET_VM';
const defaultVM = new VM(appVersion);
defaultVM.attachStorage(storage);
console.log("ClipCC" + appVersion);
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
