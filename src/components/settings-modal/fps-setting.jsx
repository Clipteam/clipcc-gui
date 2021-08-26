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
import {defineMessages, injectIntl, intlShape} from 'react-intl';
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
        <strong className={classNames(
            { [styles.darkText]: props.darkMode === 'dark' }
        )}>
            {props.intl.formatMessage(messages.label)}
        </strong>
        <Box
            alignContent="center"
            alignItems="center"
            style={{display: 'flex'}}
        >
            <BufferedInput
                tabIndex="1"
                type="number"
                value={props.fps}
                onSubmit={props.onChangeFPS}
            />
        </Box>
    </Box>
);

FPSSetting.propTypes = {
    intl: intlShape.isRequired,
    fps: PropTypes.number.isRequired,
    darkMode: PropTypes.string.isRequired,
    onChangeFPS: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    fps: getSetting(state, "fps"),
    darkMode: getSetting(state, 'darkMode')
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
