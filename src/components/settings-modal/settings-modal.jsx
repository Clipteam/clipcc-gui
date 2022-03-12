import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import Switch from '../switch/switch.jsx';
import TextSwitch from '../text-switch/text-switch.jsx';
import Input from '../forms/input.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';

import styles from './settings-modal.css';

const BufferedInput = BufferedInputHOC(Input);

const messages = defineMessages({
    title: {
        defaultMessage: 'Settings',
        description: 'Settings Modal Title',
        id: 'gui.settingsModal.title'
    },
    appearance: {
        defaultMessage: 'Appearance',
        description: 'Label of Appearance',
        id: 'gui.settingsModal.appearance'
    },
    player: {
        defaultMessage: 'Player',
        description: 'Label of Player',
        id: 'gui.settingsModal.player'
    },
    project: {
        defaultMessage: 'Project',
        description: 'Label of project',
        id: 'gui.settingsModal.project'
    },
    framerate: {
        defaultMessage: 'FPS',
        description: 'Label of FPS',
        id: 'gui.settingsModal.fps.label'
    },
    layout: {
        defaultMessage: 'Layout Style',
        description: 'Label of ClipCC layout',
        id: 'gui.settingsModal.layout.label'
    },
    scratch1: {
        defaultMessage: 'Scratch 1.4 Style',
        description: 'Label of ClipCC layout',
        id: 'gui.settingsModal.layout.scratch1'
    },
    scratch2: {
        defaultMessage: 'Scratch 2.0 Style',
        description: 'Label of ClipCC layout',
        id: 'gui.settingsModal.layout.scratch2'
    },
    scratch3: {
        defaultMessage: 'Scratch 3.0 Style',
        description: 'Label of ClipCC layout',
        id: 'gui.settingsModal.layout.scratch3'
    },
    darkmode: {
        defaultMessage: 'Dark Mode',
        description: 'Label of ClipCC dark mode',
        id: 'gui.settingsModal.darkmode.label'
    },
    darkmodeSystem: {
        defaultMessage: 'System',
        description: 'Label of system',
        id: 'gui.settingsModal.darkmode.system'
    },
    darkmodeLight: {
        defaultMessage: 'Light',
        description: 'Label of light',
        id: 'gui.settingsModal.darkmode.light'
    },
    darkmodeDark: {
        defaultMessage: 'Dark',
        description: 'Label of dark',
        id: 'gui.settingsModal.darkmode.dark'
    },
    blur: {
        defaultMessage: 'Blur Effect',
        description: 'Label of Blur Effect',
        id: 'gui.settingsModal.blur.label'
    },
    seamless: {
        defaultMessage: 'Seamless Fullscreen',
        description: 'Label of Seamless Fullscreen',
        id: 'gui.settingsModal.seamless.label'
    },
    autosave: {
        defaultMessage: 'Auto Save',
        description: 'Label of Handling Auto Save',
        id: 'gui.settingsModal.autosave.label'
    },
    autosaveUnsupported: {
        defaultMessage: 'Your browser not support autosave :(',
        description: 'Label of unsupport browser',
        id: 'gui.settingsModal.autosave.unsupport'
    },
    autosaveInterval: {
        defaultMessage: 'Auto Save interval',
        description: 'Label of Auto Save interval',
        id: 'gui.settingsModal.autosave.autosaveinterval'
    },
    compatibility: {
        defaultMessage: 'Handling unknown blocks',
        description: 'Label of Handling unknown blocks',
        id: 'gui.settingsModal.compatibility.label'
    },
    compatibilityDoNotLoad: {
        defaultMessage: 'Don\'t load',
        description: 'Label of donot load',
        id: 'gui.settingsModal.compatibility.donotload'
    },
    compatibilityConvert: {
        defaultMessage: 'Convert to procedures',
        description: 'Label of convert to procedures',
        id: 'gui.settingsModal.compatibility.convert'
    },
    compatibilityDelete: {
        defaultMessage: 'Delete them',
        description: 'Label of delete',
        id: 'gui.settingsModal.compatibility.delete'
    },
    compression: {
        defaultMessage: 'Compression level',
        description: 'Label of Compression',
        id: 'gui.settingsModal.compression.label'
    },
    saveExtension: {
        defaultMessage: 'Save Extension to Project File',
        description: 'Label of Save Extension',
        id: 'gui.settingsModal.saveExtension.label'
    },
    saveOptionalExtension: {
        defaultMessage: 'Save Optional Extension to Project File',
        description: 'Label of Save Optional Extension',
        id: 'gui.settingsModal.saveOptionalExtension.label'
    }
});

class SettingsModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeFramerate',
            'handleChangeAutosave',
            'handleChangeAutosaveInterval',
            'handleChangeCompressionLevel'
        ]);
    }

    calcBound (value, upper, lower) {
        if (value < lower) return lower;
        if (value > upper) return upper;
        return value;
    }

    handleChangeFramerate (framerate) {
        this.props.onChangeFramerate(this.calcBound(framerate, 10, 120));
    }

    handleChangeAutosave (autosave) {
        if (window.showSaveFilePicker) {
            this.props.onChangeAutoSave(autosave);
        } else {
            /* eslint-disable no-alert */
            alert(this.props.intl.formatMessage(messages.autosaveUnsupproted));
        }
    }

    handleChangeAutosaveInterval (interval) {
        this.props.onChangeAutosaveInterval(this.calcBound(interval, 60, 600));
    }

    handleChangeCompressionLevel (level) {
        this.props.onChangeCompressionLevel(this.calcBound(level, 1, 9));
    }

    render () {
        const layoutStyleItems = [{
            id: 'scratch2',
            text: this.props.intl.formatMessage(messages.scratch2)
        }, {
            id: 'scratch3',
            text: this.props.intl.formatMessage(messages.scratch3)
        }];

        const darkModeItems = [{
            id: 'system',
            text: this.props.intl.formatMessage(messages.darkmodeSystem)
        }, {
            id: 'light',
            text: this.props.intl.formatMessage(messages.darkmodeLight)
        }, {
            id: 'dark',
            text: this.props.intl.formatMessage(messages.darkmodeDark)
        }];

        const compatibilityItems = [{
            id: 'donotload',
            text: this.props.intl.formatMessage(messages.compatibilityDoNotLoad)
        }, {
            id: 'replace',
            text: this.props.intl.formatMessage(messages.compatibilityConvert)
        }/* , {
            id: 'delete',
            text: this.props.intl.formatMessage(messages.compatibilityDelete)
        } */];

        return (
            <Modal
                className={styles.modalContent}
                contentLabel={this.props.intl.formatMessage(messages.title)}
                onRequestClose={this.props.onRequestClose}
                id="settingsModal"
            >
                <Box
                    className={classNames(styles.body)}
                    justifyContent="space-between"
                    scrollbar
                >
                    <p className={classNames(styles.category)}>
                        {this.props.intl.formatMessage(messages.appearance)}
                    </p>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.layout)}
                        </p>
                        <TextSwitch
                            items={layoutStyleItems}
                            onChange={this.props.onChangeLayoutStyle}
                            value={this.props.layoutStyle}
                        />
                    </div>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.darkmode)}
                        </p>
                        <TextSwitch
                            items={darkModeItems}
                            onChange={this.props.onChangeDarkMode}
                            value={this.props.darkMode}
                        />
                    </div>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.blur)}
                        </p>
                        <Switch
                            onChange={this.props.onChangeBlurEffect}
                            value={this.props.blur}
                        />
                    </div>
                    <p className={classNames(styles.category)}>
                        {this.props.intl.formatMessage(messages.player)}
                    </p>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.framerate)}
                        </p>
                        <BufferedInput
                            small
                            tabIndex="0"
                            type="text"
                            placeholder="30"
                            value={this.props.framerate}
                            onSubmit={this.handleChangeFramerate}
                            className={classNames(styles.input)}
                        />
                    </div>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.seamless)}
                        </p>
                        <Switch
                            onChange={this.props.onChangeSeamlessFullscreen}
                            value={this.props.seamless}
                        />
                    </div>
                    <p className={classNames(styles.category)}>
                        {this.props.intl.formatMessage(messages.project)}
                    </p>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.autosave)}
                        </p>
                        <Switch
                            onChange={this.handleChangeAutosave}
                            value={this.props.autosave}
                        />
                    </div>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.autosaveInterval)}
                        </p>
                        <BufferedInput
                            small
                            tabIndex="0"
                            type="text"
                            placeholder="300"
                            disabled={!this.props.autosave}
                            value={this.props.autosaveInterval}
                            onSubmit={this.handleChangeAutosaveInterval}
                            className={classNames(styles.input)}
                        />
                    </div>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.compatibility)}
                        </p>
                        <TextSwitch
                            items={compatibilityItems}
                            onChange={this.props.onChangeCompatibility}
                            value={this.props.compatibility}
                        />
                    </div>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.compression)}
                        </p>
                        <BufferedInput
                            small
                            tabIndex="0"
                            type="text"
                            placeholder="6"
                            value={this.props.compression}
                            onSubmit={this.handleChangeCompressionLevel}
                            className={classNames(styles.input)}
                        />
                    </div>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.saveExtension)}
                        </p>
                        <Switch
                            onChange={this.props.onChangeSaveExtension}
                            value={this.props.saveExtension}
                        />
                    </div>
                    <div className={classNames(styles.item)}>
                        <p className={classNames(styles.text)}>
                            {this.props.intl.formatMessage(messages.saveOptionalExtension)}
                        </p>
                        <Switch
                            onChange={this.props.onChangeSaveOptionalExtension}
                            value={this.props.saveOptionalExtension}
                        />
                    </div>
                </Box>
            </Modal>
        );
    }
}

SettingsModal.propTypes = {
    intl: intlShape.isRequired,
    layoutStyle: PropTypes.string.isRequired,
    darkMode: PropTypes.string.isRequired,
    blur: PropTypes.bool.isRequired,
    framerate: PropTypes.number.isRequired,
    seamless: PropTypes.bool.isRequired,
    autosave: PropTypes.bool.isRequired,
    autosaveInterval: PropTypes.number.isRequired,
    compatibility: PropTypes.string.isRequired,
    compression: PropTypes.number.isRequired,
    saveExtension: PropTypes.bool.isRequired,
    saveOptionalExtension: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onChangeLayoutStyle: PropTypes.func.isRequired,
    onChangeDarkMode: PropTypes.func.isRequired,
    onChangeBlurEffect: PropTypes.func.isRequired,
    onChangeFramerate: PropTypes.func.isRequired,
    onChangeSeamlessFullscreen: PropTypes.func.isRequired,
    onChangeAutoSave: PropTypes.func.isRequired,
    onChangeAutosaveInterval: PropTypes.func.isRequired,
    onChangeCompatibility: PropTypes.func.isRequired,
    onChangeCompressionLevel: PropTypes.func.isRequired,
    onChangeSaveExtension: PropTypes.func.isRequired,
    onChangeSaveOptionalExtension: PropTypes.func.isRequired
};

export default injectIntl(SettingsModal);
