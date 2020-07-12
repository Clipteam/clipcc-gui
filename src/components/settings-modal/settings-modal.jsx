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
import Switch from './switch.jsx';
import {connect} from 'react-redux';
// eslint-disable-next-line no-unused-vars
import {updateSetting, getSetting} from '../../reducers/settings';

import LayoutSetting from './layout-setting.jsx';

const messages = defineMessages({
    title: {
        defaultMessage: 'Settings',
        description: 'Settings Modal Title',
        id: 'gui.settingsModal.title'
    },
    darkFullscreenStage: {
        defaultMessage: 'Dark fullscreen stage',
        description: 'Setting of making stage dark when fullscreen.',
        id: 'gui.settingsModal.darkFullscreenStage'
    }
});

const Setting = props => (
    <Box
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
        style={{display: 'flex'}}
    >
        <strong>{props.intl.formatMessage(props.message)}</strong>
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
    onUpdateDarkFullscreenStage,
    darkFullscreenStage
}) => (
    <Modal
        className={styles.modalContent}
        contentLabel={intl.formatMessage(messages.title)}
        onRequestClose={onRequestClose}
    >
        <Box className={styles.body}>
            <LayoutSetting />
            <Setting
                intl={intl}
                message={messages.darkFullscreenStage}
            >
                <Switch
                    onChanged={onUpdateDarkFullscreenStage}
                    default={darkFullscreenStage}
                />
            </Setting>
        </Box>
    </Modal>
);


SettingsModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onUpdateDarkFullscreenStage: PropTypes.func.isRequired,
    darkFullscreenStage: PropTypes.bool.isRequired
};

// eslint-disable-next-line no-unused-vars
const mapStateToProps = state => ({
    // darkFullscreenStage: getSetting(state, 'darkFullscreenStage')
});

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = dispatch => ({
    // onUpdateDarkFullscreenStage: v => dispatch(updateSetting('darkFullscreenStage', v))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(SettingsModal));
