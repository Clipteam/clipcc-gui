/**
 * @fileoverview
 * 设置窗口中的布局选项组件
 * @author SteveXMH
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import {updateLayoutStyle, layoutStyle} from '../../reducers/layout';
import styles from './layout-setting.css';

// import sc1styleImg from './layout-style-sc1.png'; Just kidding :P
import sc2styleImg from './layout-style-sc2.png';
import sc3styleImg from './layout-style-sc3.png';

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
        alignContent="center"
        alignItems="center"
        style={{display: 'flex'}}
    >
        <strong>{props.intl.formatMessage(messages.label)}</strong>
        <span style={{flex: 1}} />
        <Box
            alignContent="center"
            alignItems="center"
            style={{display: 'flex'}}
        >
            <span
                className={[
                    styles.switchLeft,
                    styles.switch,
                    props.layoutStyle === 'scratch2' ? styles.active : ''
                ].join(' ')}
                onClick={props.onClickScratch2Style}
            >
                <img
                    draggable={false}
                    src={sc2styleImg}
                />
                <div>{props.intl.formatMessage(messages.scratch2)}</div>
            </span>
            <span
                className={[
                    styles.switchRight,
                    styles.switch,
                    props.layoutStyle === 'scratch3' ? styles.active : ''
                ].join(' ')}
                onClick={props.onClickScratch3Style}
            >
                <img
                    draggable={false}
                    src={sc3styleImg}
                />
                <div>{props.intl.formatMessage(messages.scratch3)}</div>
            </span>
        </Box>
    </Box>
);

LayoutSetting.propTypes = {
    intl: intlShape.isRequired,
    layoutStyle: PropTypes.bool.isRequired,
    onClickScratch2Style: PropTypes.func.isRequired,
    onClickScratch3Style: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    layoutStyle: layoutStyle(state)
});

const mapDispatchToProps = dispatch => ({
    onClickScratch2Style: () => dispatch(updateLayoutStyle('scratch2')),
    onClickScratch3Style: () => dispatch(updateLayoutStyle('scratch3'))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(LayoutSetting));
