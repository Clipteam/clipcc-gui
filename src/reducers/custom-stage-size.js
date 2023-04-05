const SET_CUTSOM_STAGE_SIZE = 'clipcc-gui/CustomStageSize/SET_CUSTOM_STAGE_SIZE';

const initialState = {
    width: 480,
    height: 360
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_CUTSOM_STAGE_SIZE:
        console.log('update custom stage size', action.width, action.height);
        return {
            width: action.width,
            height: action.height
        };
    default:
        return state;
    }
};

const setCustomStageSize = function (width, height) {
    return {
        type: SET_CUTSOM_STAGE_SIZE,
        width: width,
        height: height
    };
};

export {
    reducer as default,
    initialState as customStageSizeInitialState,
    setCustomStageSize
};
