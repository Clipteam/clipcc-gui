/**
 * @fileoverview
 * 设置窗口中的未知扩展兼容性选项组件
 * @author SinanGentoo
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl} from 'react-intl';
import {updateSetting, getSetting} from '../../reducers/settings';
import styles from './layout-setting.css';

const messages = defineMessages({
    label: {
        defaultMessage: 'Handling unknown blocks',
        description: 'Label of Handling unknown blocks',
        id: 'gui.settingsModal.compatibility.label'
    },
    donotload: {
        defaultMessage: 'Don\'t load',
        description: 'Label of donot load',
        id: 'gui.settingsModal.compatibility.donotload'
    },
    convert: {
        defaultMessage: 'Convert to procedures',
        description: 'Label of convert to procedures',
        id: 'gui.settingsModal.compatibility.convert'
    },
    delete: {
        defaultMessage: 'Delete them',
        description: 'Label of delete',
        id: 'gui.settingsModal.compatibility.delete'
    }
});

const CompatibilitySetting = props => (
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
                    props.compatibility === 'donotload' ? styles.active : null
                )}
                onClick={() => {
                    try {
                        props.setDeserializeOption('donotload');
                        props.onClickDoNotLoad();
                    } catch (e) {
                        alert('Failed to change setting:' + e);
                        console.error('Failed to change setting:', e);
                    }
                }}
            >
                <div>{props.intl.formatMessage(messages.donotload)}</div>
            </span>
            <span
                className={classNames(
                    styles.switch,
                    styles.switchRight,
                    props.compatibility === 'replace' ? styles.active : null
                )}
                onClick={() => {
                    try {
                        props.setDeserializeOption('replace');
                        props.onClickReplace();
                    } catch (e) {
                        alert('Failed to change setting:' + e);
                        console.error('Failed to change setting:', e);
                    }
                }}
            >
                <div>{props.intl.formatMessage(messages.convert)}</div>
            </span>
        </Box>
    </Box>
);

CompatibilitySetting.propTypes = {
    compatibility: PropTypes.string.isRequired,
    onClickDoNotLoad: PropTypes.func.isRequired,
    onClickReplace: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    compatibility: getSetting(state, 'compatibility')
});

const mapDispatchToProps = dispatch => ({
    onClickDoNotLoad: () => dispatch(updateSetting('compatibility', 'donotload')),
    onClickReplace: () => dispatch(updateSetting('compatibility', 'replace')),
    onClickDelete: () => dispatch(updateSetting('compatibility', 'delete'))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(CompatibilitySetting));
