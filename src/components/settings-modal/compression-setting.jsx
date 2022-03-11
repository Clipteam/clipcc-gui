/**
 * @fileoverview
 * 设置窗口中的压缩率修改组件
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
        defaultMessage: 'Compression level',
        description: 'Label of Compression',
        id: 'gui.settingsModal.compression.label'
    }
});

const CompressionSetting = props => (
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
                value={props.compression}
                onSubmit={value => {
                    try {
                        props.setCompression(value);
                        props.onChangeCompression(value);
                    } catch (e) {
                        alert('Failed to change setting:' + e);
                        console.error('Failed to change setting:', e);
                    }
                }}
            />
        </Box>
    </Box>
);

CompressionSetting.propTypes = {
    compression: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    compression: getSetting(state, 'compression')
});

const mapDispatchToProps = dispatch => ({
    onChangeCompression: compression => {
        dispatch(updateSetting('compression', compression));
    }
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(CompressionSetting));
