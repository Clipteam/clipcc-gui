import {initExtensionAPI} from './extension-manager';
import blocks from './blocks.js';
/* eslint-disable linebreak-style */
// 异步加载 clipcc-block
let BlocksComponent = null;

const loaded = () => !!BlocksComponent;

const get = () => {
    if (!loaded()) return Error('blocks not loaded');
    return BlocksComponent;
};

const load = (gui, vm) => {
    if (BlocksComponent) return Promise.resolve(BlocksComponent);
    return import(/* webpackChunkName: "ccblocks" */'clipcc-block').then(data => {
        BlocksComponent = data.default;
        initExtensionAPI(gui, vm, blocks(vm));
        return BlocksComponent;
    });
};

export default {
    get,
    load,
    loaded
};
