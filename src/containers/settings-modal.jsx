import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import {defineMessages, injectIntl} from 'react-intl';
import VM from 'clipcc-vm';

import SettingsComponent from '../components/settings-modal/settings-modal.jsx';

import {updateSetting} from '../reducers/settings';
import {setSeamless} from '../reducers/mode';

const messages = defineMessages({
    autosaveUnsupported: {
        defaultMessage: 'Your browser not support autosave :(',
        description: 'Label of unsupport browser',
        id: 'gui.settingsModal.autosave.unsupport'
    }
});

class SettingsModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeSettingsItem',
            'handleChangeFramerate',
            'handleChangeCompiler',
            'handleChangeSeamlessFullscreen',
            'handleChangeAutoSave',
            'handleChangeCompatibility',
            'handleChangeCompressionLevel',
            'handleChangeHQPen',
            'handleChangeSaveSettings',
            'handleChangeStageX',
            'handleChangeStageY'
        ]);
    }

    handleChangeSettingsItem (id, value) {
        this.props.updateSettings(id, value);
    }

    handleChangeCompiler (option) {
        this.props.vm.runtime.setCompiler(option);
    }

    handleChangeHQPen (option) {
        this.props.vm.renderer.setUseHighQualityPen(option);
    }
    
    handleChangeSaveSettings (option) {
        this.props.vm.runtime.storeSettings = !!option;
    }

    handleChangeFramerate (framerate) {
        this.props.updateSettings('framerate', framerate);
        this.props.vm.runtime.setFramerate(framerate);
    }

    handleChangeSeamlessFullscreen (value) {
        this.props.updateSettings('seamless', value);
        this.props.setSeamless(value);
    }

    handleChangeAutoSave (value) {
        if (window.showSaveFilePicker) {
            this.props.updateSettings('autosave', value);
        } else {
            /* eslint-disable no-alert */
            alert(this.props.intl.formatMessage(messages.autosaveUnsupproted));
        }
    }

    handleChangeCompatibility (mode) {
        this.props.updateSettings('compatibility', mode);
        this.props.vm.setDeserializeOption(mode);
    }

    handleChangeCompressionLevel (level) {
        this.props.updateSettings('compression', level);
        this.props.vm.setCompressionLevel(level);
    }
    handleChangeStageX (value) {
        this.props.updateSettings('stageX', value);
        this.props.vm.runtime.setStageSize(value, this.props.stageY);
    }
    handleChangeStageY (value) {
        this.props.updateSettings('stageY', value);
        this.props.vm.runtime.setStageSize(this.props.stageX, value);
    }
    render () {
        return (
            <SettingsComponent
                onChangeSettingsItem={this.handleChangeSettingsItem}
                onChangeFramerate={this.handleChangeFramerate}
                onChangeSeamlessFullscreen={this.handleChangeSeamlessFullscreen}
                onChangeAutoSave={this.handleChangeAutoSave}
                onChangeCompatibility={this.handleChangeCompatibility}
                onChangeCompressionLevel={this.handleChangeCompressionLevel}
                onChangeCompiler={this.handleChangeCompiler}
                onChangeHQPen={this.handleChangeHQPen}
                onChangeSaveSettings={this.handleChangeSaveSettings}
                onChangeStageX={this.handleChangeStageX}
                onChangeStageY={this.handleChangeStageY}
                {...this.props}
            />
        );
    }
}

SettingsModal.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    extensionSettings: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    layoutStyle: PropTypes.string.isRequired,
    darkMode: PropTypes.string.isRequired,
    blur: PropTypes.bool.isRequired,
    framerate: PropTypes.number.isRequired,
    compiler: PropTypes.bool.isRequired,
    seamless: PropTypes.bool.isRequired,
    hqpen: PropTypes.bool.isRequired,
    autosave: PropTypes.bool.isRequired,
    hideNonOriginalBlocks: PropTypes.bool.isRequired,
    autosaveInterval: PropTypes.number.isRequired,
    compatibility: PropTypes.string.isRequired,
    compression: PropTypes.number.isRequired,
    saveSettings: PropTypes.bool.isRequired,
    saveExtension: PropTypes.bool.isRequired,
    saveOptionalExtension: PropTypes.bool.isRequired,
    updateSettings: PropTypes.func.isRequired,
    setSeamless: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    extensionSettings: state.scratchGui.extensionSettings,
    settings: state.scratchGui.settings,
    layoutStyle: state.scratchGui.settings.layoutStyle,
    darkMode: state.scratchGui.settings.darkMode,
    blur: state.scratchGui.settings.blur,
    framerate: state.scratchGui.settings.framerate,
    compiler: state.scratchGui.settings.compiler,
    hqpen: state.scratchGui.settings.hqpen,
    seamless: state.scratchGui.settings.seamless,
    autosave: state.scratchGui.settings.autosave,
    autosaveInterval: state.scratchGui.settings.autosaveInterval,
    compatibility: state.scratchGui.settings.compatibility,
    compression: state.scratchGui.settings.compression,
    hideNonOriginalBlocks: state.scratchGui.settings.hideNonOriginalBlocks,
    saveSettings: state.scratchGui.settings.saveSettings,
    saveExtension: state.scratchGui.settings.saveExtension,
    saveOptionalExtension: state.scratchGui.settings.saveOptionalExtension,
    stageX: state.scratchGui.settings.stageX,
    stageY: state.scratchGui.settings.stageY
});

const mapDispatchToProps = dispatch => ({
    updateSettings: (name, value) => dispatch(updateSetting(name, value)),
    setSeamless: value => dispatch(setSeamless(value))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsModal));
