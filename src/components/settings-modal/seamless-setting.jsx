/**
 * @fileoverview
 * 设置窗口中的无缝全屏选项组件
 * @author SinanGentoo
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import {updateSetting, getSetting} from '../../reducers/settings';
import {setSeamless} from '../../reducers/mode';
import styles from './layout-setting.css';

const messages = defineMessages({
    label: {
        defaultMessage: 'Seamless Fullscreen',
        description: 'Label of Seamless Fullscreen',
        id: 'gui.settingsModal.seamless.label'
    },
    enabled: {
        defaultMessage: 'Enabled',
        description: 'Label of Enabled',
        id: 'gui.settingsModal.seamless.enabled'
    },
    disabled: {
        defaultMessage: 'Disabled',
        description: 'Label of Disabled',
        id: 'gui.settingsModal.seamless.disabled'
    }
});

const SeamlessSetting = props => (
    <Box
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
        style={{display: 'flex'}}
    >
        <p className={classNames(
            styles.text
        )}>
            {props.intl.formatMessage(messages.label)}
        </p>
        <Box
            alignContent="center"
            alignItems="center"
            style={{display: 'flex'}}
        >
            <span
                className={classNames(
                    styles.switchLeft,
                    styles.switch,
                    props.seamless === 'on' ? styles.active : null
                )}
                onClick={props.onEnable}
            >
                <div>{props.intl.formatMessage(messages.enabled)}</div>
            </span>
            <span
                className={classNames(
                    styles.switchRight,
                    styles.switch,
                    props.seamless === 'off' ? styles.active : ''
                )}
                onClick={props.onDisable}
            >
                <div>{props.intl.formatMessage(messages.disabled)}</div>
            </span>
        </Box>
    </Box>
);

SeamlessSetting.propTypes = {
    intl: intlShape.isRequired,
    seamless: PropTypes.string.isRequired,
    onEnable: PropTypes.func.isRequired,
    onDisable: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    seamless: getSetting(state, 'seamless')
});

const mapDispatchToProps = dispatch => ({
    onEnable: () => {
        dispatch(updateSetting('seamless', 'on'));
        dispatch(setSeamless(true));
    },
    onDisable: () => {
        dispatch(updateSetting('seamless', 'off'));
        dispatch(setSeamless(false));
    }
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(SeamlessSetting));
