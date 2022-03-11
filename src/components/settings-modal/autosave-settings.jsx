import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import Input from '../forms/input.jsx';
import Box from '../box/box.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import {defineMessages, injectIntl} from 'react-intl';
import {updateSetting, getSetting} from '../../reducers/settings';
import styles from './layout-setting.css';


const BufferedInput = BufferedInputHOC(Input);

const messages = defineMessages({
    label: {
        defaultMessage: 'Auto Save',
        description: 'Label of Handling Auto Save',
        id: 'gui.settingsModal.autosave.label'
    },
    on: {
        defaultMessage: 'Enabled',
        description: 'Label of enabled',
        id: 'gui.settingsModal.autosave.on'
    },
    off: {
        defaultMessage: 'Disabled',
        description: 'Label of disabled',
        id: 'gui.settingsModal.autosave.off'
    },
    AutoSaveSecs: {
        defaultMessage: 'Auto Save interval',
        description: 'Label of Auto Save interval',
        id: 'gui.settingsModal.autosave.autosaveinterval'
    },
    unSupport: {
        defaultMessage: 'Your browser not support autosave :(',
        description: 'Label of unsupport browser',
        id: 'gui.settingsModal.autosave.unsupport'
    }
});

const AutoSaveSetting = props => (
    <React.Fragment>
        <Box
            justifyContent="space-between"
            alignContent="center"
            alignItems="center"
            style={{display: 'flex'}}
        >
            <p
                className={classNames(
                    styles.text
                )}
            >
                {props.intl.formatMessage(messages.label)}
            </p>
            <Box
                alignContent="center"
                alignItems="center"
                style={{display: 'flex'}}
            >
                <span
                    className={classNames(
                        styles.switch,
                        styles.switchLeft,
                        props.autoSave === 'on' ? styles.active : null
                    )}
                    /* eslint-disable react/jsx-no-bind,no-alert */
                    onClick={() => {
                        if (!window.showSaveFilePicker) return alert(props.intl.formatMessage(messages.unSupport));
                        props.onEnable();
                    }}
                /* eslint-enable react/jsx-no-bind,no-alert */
                >
                    <div>{props.intl.formatMessage(messages.on)}</div>
                </span>
                <span
                    className={classNames(
                        styles.switchRight,
                        styles.switch,
                        props.autoSave === 'off' ? styles.active : null
                    )}
                    onClick={props.onDisable}
                >
                    <div>{props.intl.formatMessage(messages.off)}</div>
                </span>
            </Box>
        </Box>
        <Box
            justifyContent="space-between"
            alignContent="center"
            alignItems="center"
            style={{display: 'flex'}}
        >
            <p
                className={classNames(
                    styles.text
                )}
            >
                {props.intl.formatMessage(messages.AutoSaveSecs)}
            </p>
            <Box
                alignContent="center"
                alignItems="center"
                style={{display: 'flex'}}
            >
                <BufferedInput
                    tabIndex="1"
                    type="number"
                    min="10"
                    max="360"
                    disabled={props.autoSave === 'off'}
                    value={props.autoSaveSecs}
                    onSubmit={props.onSetAutoSaveSecs}
                />
            </Box>
        </Box>
    </React.Fragment>
);

AutoSaveSetting.propTypes = {
    autoSaveSecs: PropTypes.number.isRequired,
    autoSave: PropTypes.string.isRequired,
    onEnable: PropTypes.func.isRequired,
    onSetAutoSaveSecs: PropTypes.func.isRequired,
    onDisable: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    autoSave: getSetting(state, 'autosave'),
    autoSaveSecs: getSetting(state, 'autoSaveSecs')
});

const mapDispatchToProps = dispatch => ({
    onEnable: () => dispatch(updateSetting('autosave', 'on')),
    onDisable: () => dispatch(updateSetting('autosave', 'off')),
    onSetAutoSaveSecs: secs => dispatch(updateSetting('autoSaveSecs', secs))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(AutoSaveSetting));
