/* eslint-disable linebreak-style */
// 异步加载 clipcc-block
let BlocksComponent = null;

const loaded = () => !!BlocksComponent;

const get = () => {
    if (!loaded()) return Error('blocks not loaded');
    return BlocksComponent;
};

const load = () => {
    if (BlocksComponent) return Promise.resolve(BlocksComponent);
    return import(/* webpackChunkName: "ccblocks" */'clipcc-block').then(data => {
        BlocksComponent = data.default;
        return BlocksComponent;
    });
};

export default {
    get,
    load,
    loaded
};
