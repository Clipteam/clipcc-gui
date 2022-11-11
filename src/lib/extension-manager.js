/* eslint-disable no-unused-vars */
import {initExtension, disableExtension, enableExtension} from '../reducers/extension';
import {addLocales, updateLocale} from '../reducers/locales';
import {addNewSetting} from '../reducers/settings';
import {newExtensionSettings} from '../reducers/extension-settings';

import JSZip from 'jszip';
import mime from 'mime-types';
import log from '../lib/log';
import vm from 'vm';

import ClipCCExtension from 'clipcc-extension';

import musicIconURL from './libraries/extensions/music/music.png';
import musicInsetIconURL from './libraries/extensions/music/music-small.svg';

import penIconURL from './libraries/extensions/pen/pen.png';
import penInsetIconURL from './libraries/extensions/pen/pen-small.svg';

import videoSensingIconURL from './libraries/extensions/videoSensing/video-sensing.png';
import videoSensingInsetIconURL from './libraries/extensions/videoSensing/video-sensing-small.svg';

import text2speechIconURL from './libraries/extensions/text2speech/text2speech.png';
import text2speechInsetIconURL from './libraries/extensions/text2speech/text2speech-small.svg';

import translateIconURL from './libraries/extensions/translate/translate.png';
import translateInsetIconURL from './libraries/extensions/translate/translate-small.png';
import makeymakeyIconURL from './libraries/extensions/makeymakey/makeymakey.png';
import makeymakeyInsetIconURL from './libraries/extensions/makeymakey/makeymakey-small.svg';

import microbitIconURL from './libraries/extensions/microbit/microbit.png';
import microbitInsetIconURL from './libraries/extensions/microbit/microbit-small.svg';

import ev3IconURL from './libraries/extensions/ev3/ev3.png';
import ev3InsetIconURL from './libraries/extensions/ev3/ev3-small.svg';

import wedo2IconURL from './libraries/extensions/wedo2/wedo.png';
import wedo2InsetIconURL from './libraries/extensions/wedo2/wedo-small.svg';

import boostIconURL from './libraries/extensions/boost/boost.png';
import boostInsetIconURL from './libraries/extensions/boost/boost-small.svg';
import gdxforIconURL from './libraries/extensions/gdxfor/gdxfor.png';
import gdxforInsetIconURL from './libraries/extensions/gdxfor/gdxfor-small.svg';
import HTTPIOImage from './libraries/extensions/HTTPIO/HTTPIO.png';
import HTTPIOInsetImage from './libraries/extensions/HTTPIO/clipcc.httpio-small.svg';

import JSONImage from './libraries/extensions/JSON/JSON.png';
import JSONInsetImage from './libraries/extensions/JSON/ccjson-small.svg';

import ClipCCDefaultImage from './libraries/extensions/clipcc/CCUnknownExtension.jpg';
import ClipCCDefaultInsetImage from './libraries/extensions/clipcc/CCUnknownExtension.svg';

const builtinExtensions = [
    {
        extensionId: 'music',
        iconURL: musicIconURL,
        insetIconURL: musicInsetIconURL,
        author: 'Scratch Team',
        name: 'gui.extension.music.name',
        description: 'gui.extension.music.description'
    },
    {
        extensionId: 'pen',
        iconURL: penIconURL,
        insetIconURL: penInsetIconURL,
        author: 'Scratch Team',
        name: 'gui.extension.pen.name',
        description: 'gui.extension.pen.description'
    },
    {
        extensionId: 'httpio',
        iconURL: HTTPIOImage,
        insetIconURL: HTTPIOInsetImage,
        author: 'Clip Team',
        name: 'gui.extension.HTTPIO.name',
        description: 'gui.extension.HTTPIO.description',
        requirement: ['internet']
    },
    {
        extensionId: 'ccjson',
        iconURL: JSONImage,
        insetIconURL: JSONInsetImage,
        author: 'Clip Team',
        name: 'gui.extension.ccjson.name',
        description: 'gui.extension.ccjson.description'
    },
    {
        extensionId: 'videoSensing',
        iconURL: videoSensingIconURL,
        insetIconURL: videoSensingInsetIconURL,
        author: 'Scratch Team',
        name: 'gui.extension.videosensing.name',
        description: 'gui.extension.videosensing.description'
    },
    {
        extensionId: 'text2speech',
        iconURL: text2speechIconURL,
        insetIconURL: text2speechInsetIconURL,
        author: ['Scratch Team', 'Amazon Web Services'],
        name: 'gui.extension.text2speech.name',
        description: 'gui.extension.text2speech.description',
        requirement: ['internet']
    },
    {
        extensionId: 'translate',
        iconURL: translateIconURL,
        insetIconURL: translateInsetIconURL,
        author: ['Scratch Team', 'Google'],
        name: 'gui.extension.translate.name',
        description: 'gui.extension.translate.description',
        requirement: ['internet']
    }
];

const deprecatedExtensions = [
    {
        extensionId: 'makeymakey',
        iconURL: makeymakeyIconURL,
        insetIconURL: makeymakeyInsetIconURL,
        author: ['Scratch Team', 'JoyLabz'],
        name: 'gui.extension.makeymakey.name',
        description: 'gui.extension.makeymakey.description'
    },
    {
        extensionId: 'micro:bit',
        iconURL: microbitIconURL,
        insetIconURL: microbitInsetIconURL,
        author: ['Scratch Team', 'micro:bit'],
        name: 'gui.extension.microbit.name',
        description: 'gui.extension.microbit.description',
        requirement: ['internet', 'bluetooth']
    },
    {
        extensionId: 'ev3',
        iconURL: ev3IconURL,
        insetIconURL: ev3InsetIconURL,
        author: ['Scratch Team', 'LEGO'],
        name: 'gui.extension.ev3.name',
        description: 'gui.extension.ev3.description',
        requirement: ['internet', 'bluetooth']
    },
    {
        extensionId: 'boost',
        iconURL: boostIconURL,
        insetIconURL: boostInsetIconURL,
        author: ['Scratch Team', 'LEGO'],
        name: 'gui.extension.boost.name',
        description: 'gui.extension.boost.description',
        requirement: ['internet', 'bluetooth']
    },
    {
        extensionId: 'wedo2',
        iconURL: wedo2IconURL,
        insetIconURL: wedo2InsetIconURL,
        author: ['Scratch Team', 'LEGO'],
        name: 'gui.extension.wedo2.name',
        description: 'gui.extension.wedo2.description',
        requirement: ['internet', 'bluetooth']
    },
    {
        extensionId: 'gdxfor',
        iconURL: gdxforIconURL,
        insetIconURL: gdxforInsetIconURL,
        author: ['Scratch Team', 'Vernier'],
        name: 'gui.extension.gdxfor.name',
        description: 'gui.extension.gdxfor.description',
        requirement: ['internet', 'bluetooth']
    }
];

const loadBuiltinExtension = dispatch => {
    for (const ext of builtinExtensions) {
        ClipCCExtension.extensionManager.addInstance(ext.extensionId, {
            id: ext.extensionId,
            icon: ext.iconURL,
            inset_icon: ext.insetIconURL,
            author: ext.author,
            requirement: ext.requirement,
            api: 0,
            version: '1.0.0'
        }, new ClipCCExtension.Extension());
        dispatch(initExtension(ext));
    }
    // 弃用的扩展仍需要被加载，但是不会被显示
    for (const ext of deprecatedExtensions) {
        ClipCCExtension.extensionManager.addInstance(ext.extensionId, {
            id: ext.extensionId,
            icon: ext.iconURL,
            inset_icon: ext.insetIconURL,
            author: ext.author,
            requirement: ext.requirement,
            api: 0,
            version: '1.0.0'
        }, new ClipCCExtension.Extension());
    }
};

const initExtensionAPI = (gui, vm, blocks) => {
    const apiInstance = {
        gui: gui.extensionAPI,
        vm: vm.extensionAPI,
        blocks: blocks,
        document: document,
        window: window
    };
    ClipCCExtension.api.registExtensionAPI(apiInstance);
};

const loadSettings = (dispatch, id, settings) => {
    if (!Array.isArray(settings)) {
        throw Error('Bad settings format: Expect an array.');
    }
    for (const item of settings) {
        item.message = `${id}.settings.${item.id}`;
        item.id = `${id}.${item.id}`;
        dispatch(addNewSetting(item.id, item.default));
    }
    dispatch(newExtensionSettings(id, settings));
};

const loadExtensionFromFile = async (dispatch, file, type) => {
    let info = {};
    let isReload = false;
    switch (type) {
    case 'ccx': {
        const zipData = await JSZip.loadAsync(file);
        let settings = null;
        let instance = null;

        // Load info
        if ('info.json' in zipData.files) {
            const content = await zipData.files['info.json'].async('text');
            info = JSON.parse(content);
            if (ClipCCExtension.extensionManager.exist(info.id)) {
                log.warn('reloading extension...');
                try {
                    ClipCCExtension.extensionManager.removeInstance(info.id);
                    ClipCCExtension.extensionManager.unloadExtensions(
                        [info.id],
                        extension => ClipCCExtension.api.getVmInstance().extensionManager.unloadExtensionURL(info.id)
                    );
                    dispatch(disableExtension(info.id));
                    isReload = true;

                    log.info('reload complete');
                } catch (e) {
                    log.error('error occurred while reloading', e);
                }
            }
            if (info.icon) {
                const data = await zipData.files[info.icon].async('arraybuffer');
                info.icon = URL.createObjectURL(new Blob(
                    [data], {type: mime.lookup(info.icon) || 'image/png'}
                ));
            }
            if (info.inset_icon) {
                const data = await zipData.files[info.inset_icon].async('arraybuffer');
                info.inset_icon = URL.createObjectURL(new Blob(
                    [data], {type: mime.lookup(info.inset_icon) || 'image/svg+xml'}
                ));
            }
            info.api = 1;
        } else {
            throw new Error('Cannot find \'info.json\' in ccx extension.');
        }


        // Load extension class
        if ('main.js' in zipData.files) {
            const script = new vm.Script(await zipData.files['main.js'].async('text'));
            const ExtensionPrototype = script.runInThisContext();
            instance = new ExtensionPrototype();
        } else {
            throw new Error('Cannot find \'main.js\' in ccx extension');
        }

        // Load settings
        if ('settings.json' in zipData.files) {
            const content = await zipData.files['settings.json'].async('text');
            settings = JSON.parse(content);
        }

        // Load locale
        const locale = {};
        for (const fileName in zipData.files) {
            const result = fileName.match(/^locales\/([A-Za-z0-9_-]+).json$/);
            if (result) {
                locale[result[1]] = JSON.parse(await zipData.files[fileName].async('text'));
            }
        }
        if (info.default_language && locale.hasOwnProperty(info.default_language)) { // default language param
            locale.default = locale[info.default_language];
        } else {
            locale.default = locale.en;
        }

        const extensionInfo = {
            extensionId: info.id,
            name: `${info.id}.name`,
            description: `${info.id}.description`,
            iconURL: info.icon,
            insetIconURL: info.inset_icon,
            author: info.author,
            requirement: info.requirement,
            instance: instance,
            api: info.api,
            version: info.version,
            fileContent: file
        };

        if (settings) loadSettings(dispatch, info.id, settings);
        ClipCCExtension.extensionManager.addInstance(info.id, info, instance);
        dispatch(addLocales(locale));
        dispatch(updateLocale());
        dispatch(initExtension(extensionInfo));
        if (isReload) dispatch(enableExtension(info.id));
        break;
    }
    case 'js': {
        const Extension = vm.runInThisContext(file);
        const instance = new Extension();
        info = instance.getInfo();
        const apiInstance = new ClipCCExtension.CompatibleExtension(instance);
        const extensionInfo = {
            extensionId: info.id,
            iconURL: info.blockIconURL,
            insetIconURL: info.blockIconURL,
            author: 'External Extension',
            name: info.name,
            description: 'External Extension',
            requirement: [],
            instance: apiInstance,
            api: 1,
            fileContent: file
        };

        ClipCCExtension.extensionManager.addInstance(info.id, {
            id: info.id,
            icon: info.blockIconURL,
            inset_icon: info.blockIconURL,
            author: info.author,
            requirement: info.requirement,
            api: 1
        }, instance);
        dispatch(initExtension(extensionInfo));
        break;
    }
    /* case 'scx': {
        const url = URL.createObjectURL(file);
        this.props.vm.extensionManager.loadExtensionURL(url);
        break;
    }*/
    default: {
        throw new Error(`Unkown extension type *.${type}`);
    }
    }
    return info;
};

export {
    loadBuiltinExtension,
    initExtensionAPI,
    loadExtensionFromFile
};
