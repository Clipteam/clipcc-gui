/* eslint-disable no-unused-vars */
import {
    initExtension,
    enableExtension,
    disableExtension
} from '../reducers/extension';

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
import microbitConnectionIconURL from './libraries/extensions/microbit/microbit-illustration.svg';
import microbitConnectionSmallIconURL from './libraries/extensions/microbit/microbit-small.svg';

import ev3IconURL from './libraries/extensions/ev3/ev3.png';
import ev3InsetIconURL from './libraries/extensions/ev3/ev3-small.svg';
import ev3ConnectionIconURL from './libraries/extensions/ev3/ev3-hub-illustration.svg';
import ev3ConnectionSmallIconURL from './libraries/extensions/ev3/ev3-small.svg';

import wedo2IconURL from './libraries/extensions/wedo2/wedo.png';
import wedo2InsetIconURL from './libraries/extensions/wedo2/wedo-small.svg';
import wedo2ConnectionIconURL from './libraries/extensions/wedo2/wedo-illustration.svg';
import wedo2ConnectionSmallIconURL from './libraries/extensions/wedo2/wedo-small.svg';
import wedo2ConnectionTipIconURL from './libraries/extensions/wedo2/wedo-button-illustration.svg';

import boostIconURL from './libraries/extensions/boost/boost.png';
import boostInsetIconURL from './libraries/extensions/boost/boost-small.svg';
import boostConnectionIconURL from './libraries/extensions/boost/boost-illustration.svg';
import boostConnectionSmallIconURL from './libraries/extensions/boost/boost-small.svg';
import boostConnectionTipIconURL from './libraries/extensions/boost/boost-button-illustration.svg';

import gdxforIconURL from './libraries/extensions/gdxfor/gdxfor.png';
import gdxforInsetIconURL from './libraries/extensions/gdxfor/gdxfor-small.svg';
import gdxforConnectionIconURL from './libraries/extensions/gdxfor/gdxfor-illustration.svg';
import gdxforConnectionSmallIconURL from './libraries/extensions/gdxfor/gdxfor-small.svg';

import libraImage from './libraries/extensions/libra/Libra.png';
import libraInsetImage from './libraries/extensions/libra/Libra-small.svg';

import HTTPIOImage from './libraries/extensions/HTTPIO/HTTPIO.png';
import HTTPIOInsetImage from './libraries/extensions/HTTPIO/clipcc.httpio-small.svg';

import JSONImage from './libraries/extensions/JSON/JSON.png';
import JSONInsetImage from './libraries/extensions/JSON/clipcc.json-small.svg';

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
        extensionId: 'clipcc.json',
        iconURL: JSONImage,
        insetIconURL: JSONInsetImage,
        author: 'Clip Team',
        name: 'gui.extension.clipcc.json.name',
        description: 'gui.extension.clipcc.json.description'
    },
    {
        extensionId: 'libra',
        iconURL: libraImage,
        insetIconURL: libraInsetImage,
        author: 'SCPO',
        name: 'gui.extension.redlist.name',
        description: 'gui.extension.redlist.description',
        requirement: ['internet']
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
    },
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
        dispatch(initExtension(ext));
    }
};

const initExtensionAPI = vm => {
    ClipCCExtension.API.registExtensionAPI(vm.extensionAPI);
};

export {
    loadBuiltinExtension,
    initExtensionAPI
};
