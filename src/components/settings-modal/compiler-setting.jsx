/**
 * @fileoverview
 * 设置窗口中的即时编译选项组件
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
        defaultMessage: 'Compiler',
        description: 'Label of Compiler',
        id: 'gui.settingsModal.compiler.label'
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

const CompilerSetting = props => (
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
                    props.useCompiler === 'true' ? styles.active : null
                )}
                onClick={props.onEnable}
            >
                <div>{props.intl.formatMessage(messages.enabled)}</div>
            </span>
            <span
                className={classNames(
                    styles.switchRight,
                    styles.switch,
                    props.useCompiler === 'false' ? styles.active : ''
                )}
                onClick={props.onDisable}
            >
                <div>{props.intl.formatMessage(messages.disabled)}</div>
            </span>
        </Box>
    </Box>
);

CompilerSetting.propTypes = {
    intl: intlShape.isRequired,
    layoutStyle: PropTypes.string.isRequired,
    onEnable: PropTypes.func.isRequired,
    onDisable: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    useCompiler: getSetting(state, 'useCompiler')
});

const mapDispatchToProps = dispatch => ({
    onEnable: () => dispatch(updateSetting('useCompiler', 'true')),
    onDisable: () => dispatch(updateSetting('useCompiler', 'false'))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(CompilerSetting));
