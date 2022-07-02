import {defineMessages} from 'react-intl';
import sharedMessages from '../shared-messages';

let messages = defineMessages({
    sparrow: {
        defaultMessage: 'Sparrow',
        description: 'Name for the sparrow',
        id: 'gui.defaultProject.sparrow'
    }
});

messages = {...messages, ...sharedMessages};

// use the default message if a translation function is not passed
const defaultTranslator = msgObj => msgObj.defaultMessage;

/**
 * Generate a localized version of the default project
 * @param {function} translateFunction a function to use for translating the default names
 * @return {object} the project data json for the default project
 */
const projectData = translateFunction => {
    const translator = translateFunction || defaultTranslator;
    return ({
        targets: [
            {
                isStage: true,
                name: 'Stage',
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {},
                comments: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: 'cd21514d0531fdffb22204e0ec5ed84a',
                        name: 'backdrop1',
                        md5ext: 'cd21514d0531fdffb22204e0ec5ed84a.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 240,
                        rotationCenterY: 180
                    }
                ],
                sounds: [],
                volume: 100,
                layerOrder: 0,
                tempo: 60,
                videoTransparency: 50,
                videoState: 'on',
                textToSpeechLanguage: null
            },
            {
                isStage: false,
                name: translator(messages.sparrow),
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {},
                comments: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: '8503e5b283cf0a746478e000a67c7e6f',
                        name: 'smile',
                        bitmapResolution: 1,
                        md5ext: '8503e5b283cf0a746478e000a67c7e6f.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 37.354164123535156,
                        rotationCenterY: 45.80350112915039
                    },
                    {
                        assetId: 'ade71c65863ef2b939bf573ab9cb0049',
                        name: 'ww',
                        bitmapResolution: 1,
                        md5ext: 'ade71c65863ef2b939bf573ab9cb0049.svg',
                        dataFormat: 'svg',
                        rotationCenterX: 37.35414650815025,
                        rotationCenterY: 45.803517747595805
                    }
                ],
                sounds: [
                    {
                        assetId: 'fd8543abeeba255072da239223d2d342',
                        name: 'Chatter',
                        dataFormat: 'wav',
                        rate: 22050,
                        sampleCount: 26417,
                        md5ext: 'fd8543abeeba255072da239223d2d342.wav'
                    }
                ],
                volume: 100,
                layerOrder: 1,
                visible: true,
                x: 0,
                y: 0,
                size: 100,
                direction: 90,
                draggable: false,
                rotationStyle: 'all around'
            }
        ],
        monitors: [],
        extensions: {},
        meta: {
            semver: '3.0.0',
            editor: 'clipcc',
            vm: '3.1.11',
            agent: ''
        }
    });
};


export default projectData;
