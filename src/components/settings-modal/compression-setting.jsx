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
import ExtraInputHOC from '../forms/extra-input-hoc.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import {updateSetting, getSetting} from '../../reducers/settings';
import styles from './layout-setting.css';

const ExtraInput = ExtraInputHOC(Input);

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
            <ExtraInput
                tabIndex="1"
                type="number"
                value={props.compression}
                onSubmit={props.onChangeCompression}
                extra={props.setCompression}
            />
        </Box>
    </Box>
);

CompressionSetting.propTypes = {
    intl: intlShape.isRequired,
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
