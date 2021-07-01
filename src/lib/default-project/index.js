import projectData from './project-data';

/* eslint-disable import/no-unresolved */
import backdrop from '!raw-loader!./cd21514d0531fdffb22204e0ec5ed84a.svg';
import sparrow from '!raw-loader!./75dabc032cdde1103729691730f1e4ca.svg';
import birdsing from '!raw-loader!./18e5a88512296cd96417449496bd8711.wav';
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

    const projectJson = projectData();
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
        id: '75dabc032cdde1103729691730f1e4ca',
        assetType: 'ImageVector',
        dataFormat: 'SVG',
        data: encoder.encode(sparrow)
    }, {
        id: '18e5a88512296cd96417449496bd8711',
        assetType: 'Sound',
        dataFormat: 'WAV',
        data: encoder.encode(sparrow)
    }];
};

export default defaultProject;
