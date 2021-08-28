/**
 * @fileoverview
 * 设置窗口中的暗黑模式选项组件
 * @author SinanGentoo
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import {updateSetting, getSetting} from '../../reducers/settings';
import styles from './layout-setting.css';

const messages = defineMessages({
    label: {
        defaultMessage: 'Dark mode',
        description: 'Label of ClipCC dark mode',
        id: 'gui.settingsModal.darkmode.label'
    },
    system: {
        defaultMessage: 'System',
        description: 'Label of system',
        id: 'gui.settingsModal.darkmode.system'
    },
    dark: {
        defaultMessage: 'Dark',
        description: 'Label of dark',
        id: 'gui.settingsModal.darkmode.dark'
    },
    light: {
        defaultMessage: 'Light',
        description: 'Label of light',
        id: 'gui.settingsModal.darkmode.light'
    }
});

const darkModeSetting = props => (
    <Box
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
        style={{display: 'flex'}}
    >
        <strong>
            {props.intl.formatMessage(messages.label)}
        </strong>
        <Box
            alignContent="center"
            alignItems="center"
            style={{display: 'flex'}}
        >
            <span
                className={classNames(
                    styles.switchLeft,
                    styles.switch,
                    props.darkMode === 'system' ? styles.active : null
                )}
                onClick={props.onClickSystem}
            >
                <div>{props.intl.formatMessage(messages.system)}</div>
            </span>
            <span
                className={classNames(
                    styles.switch,
                    styles.switchCenter,
                    props.darkMode === 'dark' ? styles.active : null
                )}
                onClick={props.onClickDark}
            >
                <div>{props.intl.formatMessage(messages.dark)}</div>
            </span>
            <span
                className={classNames(
                    styles.switchRight,
                    styles.switch,
                    props.darkMode === 'light' ? styles.active : null
                )}
                onClick={props.onClickLight}
            >
                <div>{props.intl.formatMessage(messages.light)}</div>
            </span>
        </Box>
    </Box>
);

darkModeSetting.propTypes = {
    intl: intlShape.isRequired,
    darkMode: PropTypes.string.isRequired,
    onClickSystem: PropTypes.func.isRequired,
    onClickLight: PropTypes.func.isRequired,
    onClickDark: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    darkMode: getSetting(state, 'darkMode')
});

const mapDispatchToProps = dispatch => ({
    onClickSystem: () => dispatch(updateSetting('darkMode', 'system')),
    onClickDark: () => dispatch(updateSetting('darkMode', 'dark')),
    onClickLight: () => dispatch(updateSetting('darkMode', 'light'))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(darkModeSetting));
