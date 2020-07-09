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

import LayoutSetting from './layout-setting.jsx';

const messages = defineMessages({
    title: {
        defaultMessage: 'Settings',
        description: 'Settings Modal Title',
        id: 'gui.settingsModal.title'
    }
});

const SettingsModal = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={props.intl.formatMessage(messages.title)}
        onRequestClose={props.onRequestClose}
    >
        <Box className={styles.body}>
            <LayoutSetting />
        </Box>
    </Modal>
);

SettingsModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

export default injectIntl(SettingsModal);
