/**
 * @fileoverview
 * 设置窗口中的FPS组件
 * @author SinanGentoo
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Box from '../box/box.jsx';
import Input from '../forms/input.jsx';
import classNames from 'classnames';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import {defineMessages, injectIntl} from 'react-intl';
import {updateSetting, getSetting} from '../../reducers/settings';
import styles from './layout-setting.css';

const BufferedInput = BufferedInputHOC(Input);

const messages = defineMessages({
    label: {
        defaultMessage: 'FPS',
        description: 'Label of FPS',
        id: 'gui.settingsModal.fps.label'
    }
});

const FPSSetting = props => (
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
            <BufferedInput
                tabIndex="1"
                min="10"
                max="360"
                type="number"
                value={props.fps}
                onSubmit={value => {
                	props.onChangeFPS(value);
                	props.setFramerate(value);
            	}}
            />
        </Box>
    </Box>
);

FPSSetting.propTypes = {
    fps: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    fps: getSetting(state, 'fps')
});

const mapDispatchToProps = dispatch => ({
    onChangeFPS: fps => {
        dispatch(updateSetting('fps', fps));
    }
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(FPSSetting));
