import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import {defineMessages, injectIntl} from 'react-intl';
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
            'handleChangeSettingsItem',
            'handleJumpToCategory',
            'renderExtensionSettings'
        ]);
        this.categoryRef = {
            appearance: createRef(),
            player: createRef(),
            project: createRef()
        };
    }

    handleChangeSettingsItem (id) {
        return value => {
            this.props.onChangeSettingsItem(id, value);
        };
    }

    handleJumpToCategory (id) {
        return () => {
            this.categoryRef[id].current.scrollIntoView({
                behavior: 'smooth'
            });
        };
    }

    renderExtensionSettings () {
        const ids = Object.keys(this.props.extensionSettings);
        const content = [];
        for (const id of ids) {
            const settings = this.props.extensionSettings[id];
            if (!this.categoryRef.hasOwnProperty(id)) {
                this.categoryRef[id] = createRef();
            }
            const currentContent = [(<p
                key={id}
                className={classNames(styles.category)}
                ref={this.categoryRef[id]}
            >
                {this.props.intl.formatMessage({id: `${id}.name`})}
            </p>)];
            for (const item of settings) {
                let element = null;
                switch (item.type) {
                case 'boolean': {
                    element = (<Switch
                        key={item.id}
                        onChange={this.handleChangeSettingsItem(item.id)}
                        value={this.props.settings[item.id]}
                    />);
                    break;
                }
                case 'number': {
                    element = (<BufferedInput
                        key={item.id}
                        small
                        tabIndex="0"
                        type="number"
                        min={item.min}
                        max={item.max}
                        precision={item.precision}
                        placeholder="6"
                        value={this.props.settings[item.id]}
                        onSubmit={this.handleChangeSettingsItem(item.id)}
                        className={classNames(styles.input)}
                    />);
                    break;
                }
                case 'selector': {
                    const selectorItems = item.items.map(v => ({
                        id: v.id,
                        text: this.props.intl.formatMessage({id: v.message})
                    }));
                    element = (<TextSwitch
                        items={selectorItems}
                        onChange={this.handleChangeSettingsItem(item.id)}
                        value={this.props.settings[item.id]}
                    />);
                    break;
                }
                default: {
                    element = (<p>{'Error Type'}</p>);
                }
                }

                currentContent.push(<div
                    key={item.id}
                    className={classNames(styles.item)}
                >
                    <p className={classNames(styles.text)}>
                        {this.props.intl.formatMessage({id: item.message})}
                    </p>
                    {element}
                </div>);
            }
            content.push(currentContent);
        }
        return content;
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
                <Box className={classNames(styles.body)}>
                    <Box
                        className={classNames(styles.menu)}
                        justifyContent="space-between"
                        scrollbar
                    >
                        <p onClick={this.handleJumpToCategory('appearance')}>{this.props.intl.formatMessage(messages.appearance)}</p>
                        <p onClick={this.handleJumpToCategory('player')}>{this.props.intl.formatMessage(messages.player)}</p>
                        <p onClick={this.handleJumpToCategory('project')}>{this.props.intl.formatMessage(messages.project)}</p>
                        {Object.keys(this.props.extensionSettings).map(id => (
                            <p
                                key={id}
                                onClick={this.handleJumpToCategory(id)}
                            >
                                {this.props.intl.formatMessage({id: `${id}.name`})}
                            </p>
                        ))}
                    </Box>
                    <Box
                        className={classNames(styles.content)}
                        justifyContent="space-between"
                        scrollbar
                    >
                        <p
                            className={classNames(styles.category)}
                            ref={this.categoryRef.appearance}
                        >
                            {this.props.intl.formatMessage(messages.appearance)}
                        </p>
                        <div className={classNames(styles.item)}>
                            <p className={classNames(styles.text)}>
                                {this.props.intl.formatMessage(messages.layout)}
                            </p>
                            <TextSwitch
                                items={layoutStyleItems}
                                onChange={this.handleChangeSettingsItem('layoutStyle')}
                                value={this.props.layoutStyle}
                            />
                        </div>
                        <div className={classNames(styles.item)}>
                            <p className={classNames(styles.text)}>
                                {this.props.intl.formatMessage(messages.darkmode)}
                            </p>
                            <TextSwitch
                                items={darkModeItems}
                                onChange={this.handleChangeSettingsItem('darkMode')}
                                value={this.props.darkMode}
                            />
                        </div>
                        <div className={classNames(styles.item)}>
                            <p className={classNames(styles.text)}>
                                {this.props.intl.formatMessage(messages.blur)}
                            </p>
                            <Switch
                                onChange={this.handleChangeSettingsItem('blur')}
                                value={this.props.blur}
                            />
                        </div>
                        <p
                            className={classNames(styles.category)}
                            ref={this.categoryRef.player}
                        >
                            {this.props.intl.formatMessage(messages.player)}
                        </p>
                        <div className={classNames(styles.item)}>
                            <p className={classNames(styles.text)}>
                                {this.props.intl.formatMessage(messages.framerate)}
                            </p>
                            <BufferedInput
                                small
                                tabIndex="0"
                                type="number"
                                min={10}
                                max={240}
                                precision={0}
                                placeholder="30"
                                value={this.props.framerate}
                                onSubmit={this.props.onChangeFramerate}
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
                        <p
                            className={classNames(styles.category)}
                            ref={this.categoryRef.project}
                        >
                            {this.props.intl.formatMessage(messages.project)}
                        </p>
                        <div className={classNames(styles.item)}>
                            <p className={classNames(styles.text)}>
                                {this.props.intl.formatMessage(messages.autosave)}
                            </p>
                            <Switch
                                onChange={this.props.onChangeAutoSave}
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
                                type="number"
                                min={60}
                                max={600}
                                precision={0}
                                placeholder="300"
                                disabled={!this.props.autosave}
                                value={this.props.autosaveInterval}
                                onSubmit={this.handleChangeSettingsItem('autosaveInterval')}
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
                                type="number"
                                min={1}
                                max={9}
                                precision={0}
                                placeholder="6"
                                value={this.props.compression}
                                onSubmit={this.props.onChangeCompressionLevel}
                                className={classNames(styles.input)}
                            />
                        </div>
                        <div className={classNames(styles.item)}>
                            <p className={classNames(styles.text)}>
                                {this.props.intl.formatMessage(messages.saveExtension)}
                            </p>
                            <Switch
                                onChange={this.handleChangeSettingsItem('saveExtension')}
                                value={this.props.saveExtension}
                            />
                        </div>
                        <div className={classNames(styles.item)}>
                            <p className={classNames(styles.text)}>
                                {this.props.intl.formatMessage(messages.saveOptionalExtension)}
                            </p>
                            <Switch
                                onChange={this.handleChangeSettingsItem('saveOptionalExtension')}
                                value={this.props.saveOptionalExtension}
                                disabled={!this.props.saveExtension}
                            />
                        </div>
                        {this.renderExtensionSettings()}
                    </Box>
                </Box>
            </Modal>
        );
    }
}

SettingsModal.propTypes = {
    extensionSettings: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
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
    onChangeSettingsItem: PropTypes.func.isRequired,
    onChangeFramerate: PropTypes.func.isRequired,
    onChangeSeamlessFullscreen: PropTypes.func.isRequired,
    onChangeAutoSave: PropTypes.func.isRequired,
    onChangeCompatibility: PropTypes.func.isRequired,
    onChangeCompressionLevel: PropTypes.func.isRequired
};

export default injectIntl(SettingsModal);
