/* eslint-disable linebreak-style */
// 异步加载 clipcc-block
let BlocksComponent = null;

const get = () => {
    if (BlocksComponent) return Promise.resolve(BlocksComponent);
    return import('clipcc-block').then(data => {
        BlocksComponent = data.default;
        return BlocksComponent;
    });
};

export default {get};
