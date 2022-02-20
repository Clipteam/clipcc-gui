/**
 * @fileoverview
 * 设置窗口的组件
 * @author SteveXMH
 */

import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Modal from '../../containers/modal.jsx';
import styles from './settings-modal.css';
// eslint-disable-next-line no-unused-vars
import classNames from 'classnames';
import {connect} from 'react-redux';
// eslint-disable-next-line no-unused-vars
import {getSetting} from '../../reducers/settings';

import LayoutSetting from './layout-setting.jsx';
import FPSSetting from './fps-setting.jsx';
import DarkModeSetting from './darkmode-setting.jsx';
import BlurSetting from './blur-setting.jsx';
import SeamlessSetting from './seamless-setting.jsx';
import CompatibilitySetting from './compatibility-setting.jsx';
import CompressionSetting from './compression-setting.jsx';
import AutoSaveSetting from './autosave-settings.jsx';

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
    }
});

const Setting = props => (
    <Box
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
        style={{display: 'flex'}}
    >
        <h3>{props.intl.formatMessage(props.message)}</h3>
        {props.children}
    </Box>
);

Setting.propTypes = {
    intl: intlShape.isRequired,
    children: PropTypes.node,
    message: PropTypes.shape({
        defaultMessage: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.string
    })
};

const SettingsModal = ({
    intl,
    onRequestClose,
    setFramerate,
    setCompression,
    setDeserializeOption
}) => (
    <Modal
        className={styles.modalContent}
        contentLabel={intl.formatMessage(messages.title)}
        onRequestClose={onRequestClose}
        id="settingsModal"
    >
        <Box
            className={classNames(styles.body)}
            justifyContent="space-between"
        >
            <strong>{intl.formatMessage(messages.appearance)}</strong>
            <Box
                className={classNames(styles.settingGrid)}
                justifyContent="space-between"
            >
                <LayoutSetting />
                <DarkModeSetting />
                <BlurSetting />
            </Box>
            <strong>{intl.formatMessage(messages.player)}</strong>
            <Box
                className={classNames(styles.settingGrid)}
                justifyContent="space-between"
            >
                <FPSSetting
                    setFramerate={setFramerate}
                />
                <SeamlessSetting />
            </Box>
            <strong>{intl.formatMessage(messages.project)}</strong>
            <Box
                className={classNames(styles.settingGrid)}
                justifyContent="space-between"
            >
                <CompatibilitySetting
                    setDeserializeOption={setDeserializeOption}
                />
                <AutoSaveSetting />
                <CompressionSetting
                    setCompression={setCompression}
                />
            </Box>
        </Box>
    </Modal>
);


SettingsModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

// eslint-disable-next-line no-unused-vars
const mapStateToProps = state => ({

});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
    // onUpdateDarkFullscreenStage: v => dispatch(updateSetting('darkFullscreenStage', v))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsModal));
