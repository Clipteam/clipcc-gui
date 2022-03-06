import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import {injectIntl} from 'react-intl';
import VM from 'clipcc-vm';

import SettingsComponent from '../components/settings-modal/settings-modal.jsx';

import {updateSetting} from '../reducers/settings';
import {setSeamless} from '../reducers/mode';

class SettingsModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeLayoutStyle',
            'handleChangeDarkMode',
            'handleChangeBlurEffect',
            'handleChangeFramerate',
            'handleChangeSeamlessFullscreen',
            'handleChangeAutoSave',
            'handleChangeAutoSaveInterval',
            'handleChangeCompatibility',
            'handleChangeCompressionLevel'
        ]);
    }

    handleChangeLayoutStyle (style) {
        this.props.updateSettings('layoutStyle', style);
    }

    handleChangeDarkMode (mode) {
        this.props.updateSettings('darkMode', mode);
    }

    handleChangeBlurEffect (value) {
        this.props.updateSettings('blur', value);
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
        this.props.updateSettings('autosave', value);
    }

    handleChangeAutoSaveInterval (interval) {
        this.props.updateSettings('autoSaveSecs', interval);
    }

    handleChangeCompatibility (mode) {
        this.props.updateSettings('compatibility', mode);
        this.props.vm.setDeserializeOption(mode);
    }

    handleChangeCompressionLevel (level) {
        this.props.updateSettings('compression', level);
        this.props.vm.setCompressionLevel(level);
    }

    render () {
        return (
            <SettingsComponent
                onChangeLayoutStyle={this.handleChangeLayoutStyle}
                onChangeDarkMode={this.handleChangeDarkMode}
                onChangeBlurEffect={this.handleChangeBlurEffect}
                onChangeFramerate={this.handleChangeFramerate}
                onChangeSeamlessFullscreen={this.handleChangeSeamlessFullscreen}
                onChangeAutoSave={this.handleChangeAutoSave}
                onChangeAutosaveInterval={this.handleChangeAutoSaveInterval}
                onChangeCompatibility={this.handleChangeCompatibility}
                onChangeCompressionLevel={this.handleChangeCompressionLevel}
                {...this.props}
            />
        );
    }
}

SettingsModal.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    layoutStyle: PropTypes.string.isRequired,
    darkMode: PropTypes.string.isRequired,
    blur: PropTypes.bool.isRequired,
    framerate: PropTypes.number.isRequired,
    seamless: PropTypes.bool.isRequired,
    autosave: PropTypes.bool.isRequired,
    autosaveInterval: PropTypes.number.isRequired,
    compatibility: PropTypes.string.isRequired,
    compression: PropTypes.number.isRequired,
    updateSettings: PropTypes.func.isRequired,
    setSeamless: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    layoutStyle: state.scratchGui.settings.layoutStyle,
    darkMode: state.scratchGui.settings.darkMode,
    blur: state.scratchGui.settings.blur,
    framerate: state.scratchGui.settings.framerate,
    seamless: state.scratchGui.settings.seamless,
    autosave: state.scratchGui.settings.autosave,
    autosaveInterval: state.scratchGui.settings.autosaveInteval,
    compatibility: state.scratchGui.settings.compatibility,
    compression: state.scratchGui.settings.compression
});

const mapDispatchToProps = dispatch => ({
    updateSettings: (name, value) => dispatch(updateSetting(name, value)),
    setSeamless: value => dispatch(setSeamless(value))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsModal));
