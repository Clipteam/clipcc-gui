const LAYOUT_UPDATE = 'clipcc-gui/layout/LAYOUT_UPDATE';

const LAYOUT_STYLE_SCRATCH3 = 'scratch3';

const initialState = {
    layoutStyle: localStorage.getItem('layoutStyle') || LAYOUT_STYLE_SCRATCH3
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case LAYOUT_UPDATE:
        localStorage.setItem('layoutStyle', action.state.layoutStyle || LAYOUT_STYLE_SCRATCH3);
        return Object.assign({}, state, action.state);
    default:
        return state;
    }
};

const updateLayoutStyle = styleName => ({
    type: LAYOUT_UPDATE,
    state: {
        layoutStyle: styleName
    }
});

const layoutStyle = state => state.scratchGui.layout.layoutStyle;

export {
    reducer as default,
    initialState as layoutInitialState,
    updateLayoutStyle,
    layoutStyle
};
