import projectData from './project-data';

/* eslint-disable import/no-unresolved */
import backdrop from '!raw-loader!./cd21514d0531fdffb22204e0ec5ed84a.svg';
import sparrow_smile from '!raw-loader!./c6b1479621329fac5f2f8321678cc8d9.svg';
import sparrow_ww from '!raw-loader!./ade067a9d36b483c33c3660fe4be5f39.svg';
import sparrow_angry from '!raw-loader!./6ef589152edc575109df924e625cc434.svg';
import sparrow_unhappy from '!raw-loader!./bd3a66cf64c3b49faa05ca0533fefc7e.svg';
import tropical_birds from '!arraybuffer-loader!./18e5a88512296cd96417449496bd8711.wav';

/* eslint-enable import/no-unresolved */

const defaultProject = translator => {
    let _TextEncoder;
    if (typeof TextEncoder === 'undefined') {
        _TextEncoder = require('text-encoding').TextEncoder;
    } else {
        /* global TextEncoder */
        _TextEncoder = TextEncoder;
    }
    const encoder = new _TextEncoder();

    const projectJson = projectData(translator);
    return [{
        id: 0,
        assetType: 'Project',
        dataFormat: 'JSON',
        data: JSON.stringify(projectJson)
    }, {
        id: 'cd21514d0531fdffb22204e0ec5ed84a',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(backdrop)
    }, {
        id: 'c6b1479621329fac5f2f8321678cc8d9',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(sparrow_smile)
    }, {
        id: 'ade067a9d36b483c33c3660fe4be5f39',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(sparrow_ww)
    }, {
        id: 'bd3a66cf64c3b49faa05ca0533fefc7e',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(sparrow_unhappy)
    }, {
        id: '6ef589152edc575109df924e625cc434',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(sparrow_angry)
    }, {
        id: '18e5a88512296cd96417449496bd8711',
        assetType: 'Sound',
        dataFormat: 'WAV',
        data: new Uint8Array(tropical_birds)
    }];
};

export default defaultProject;
