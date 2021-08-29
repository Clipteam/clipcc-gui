/**
 * @fileoverview
 * 设置窗口中的布局选项组件
 * @author SteveXMH
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
        defaultMessage: 'Layout Style',
        description: 'Label of ClipCC layout',
        id: 'gui.settingsModal.layout.label'
    },
    scratch1: {
        defaultMessage: 'Scratch 1.4 Style',
        description: 'Label of ClipCC layout',
        id: 'gui.settingsModal.layout.scratch1'
    },
    scratch2: {
        defaultMessage: 'Scratch 2.0 Style',
        description: 'Label of ClipCC layout',
        id: 'gui.settingsModal.layout.scratch2'
    },
    scratch3: {
        defaultMessage: 'Scratch 3.0 Style',
        description: 'Label of ClipCC layout',
        id: 'gui.settingsModal.layout.scratch3'
    }
});

const LayoutSetting = props => (
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
                    props.layoutStyle === 'scratch2' ? styles.active : null
                )}
                onClick={props.onClickScratch2Style}
            >
                <div>{props.intl.formatMessage(messages.scratch2)}</div>
            </span>
            <span
                className={classNames(
                    styles.switchRight,
                    styles.switch,
                    { [styles.darkSwitch]: props.darkMode === 'dark' },
                    props.layoutStyle === 'scratch3' ? styles.active : ''
                )}
                onClick={props.onClickScratch3Style}
            >
                <div>{props.intl.formatMessage(messages.scratch3)}</div>
            </span>
        </Box>
    </Box>
);

LayoutSetting.propTypes = {
    intl: intlShape.isRequired,
    layoutStyle: PropTypes.string.isRequired,
    darkMode: PropTypes.string.isRequired,
    onClickScratch2Style: PropTypes.func.isRequired,
    onClickScratch3Style: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    layoutStyle: getSetting(state, 'layoutStyle'),
    darkMode: getSetting(state, 'darkMode')
});

const mapDispatchToProps = dispatch => ({
    onClickScratch2Style: () => dispatch(updateSetting('layoutStyle', 'scratch2')),
    onClickScratch3Style: () => dispatch(updateSetting('layoutStyle', 'scratch3'))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(LayoutSetting));
