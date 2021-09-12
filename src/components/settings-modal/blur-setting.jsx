/**
 * @fileoverview
 * 设置窗口中的模糊选项组件
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
        defaultMessage: 'Blur Effect',
        description: 'Label of Blur Effect',
        id: 'gui.settingsModal.blur.label'
    },
    enabled: {
        defaultMessage: 'Enabled',
        description: 'Label of Enabled',
        id: 'gui.settingsModal.blur.enabled'
    },
    disabled: {
        defaultMessage: 'Disabled',
        description: 'Label of Disabled',
        id: 'gui.settingsModal.blur.disabled'
    }
});

const BlurSetting = props => (
    <Box
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
        style={{display: 'flex'}}
    >
        <strong className={classNames(
            styles.text
        )}>
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
                    props.blur === 'on' ? styles.active : null
                )}
                onClick={props.onEnable}
            >
                <div>{props.intl.formatMessage(messages.enabled)}</div>
            </span>
            <span
                className={classNames(
                    styles.switchRight,
                    styles.switch,
                    props.blur === 'off' ? styles.active : ''
                )}
                onClick={props.onDisable}
            >
                <div>{props.intl.formatMessage(messages.disabled)}</div>
            </span>
        </Box>
    </Box>
);

BlurSetting.propTypes = {
    intl: intlShape.isRequired,
    layoutStyle: PropTypes.string.isRequired,
    onEnable: PropTypes.func.isRequired,
    onDisable: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    blur: getSetting(state, 'blur')
});

const mapDispatchToProps = dispatch => ({
    onEnable: () => dispatch(updateSetting('blur', 'on')),
    onDisable: () => dispatch(updateSetting('blur', 'off'))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(BlurSetting));
