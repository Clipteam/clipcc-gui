import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import VM from 'clipcc-vm';

import Box from '../box/box.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants.js';
import StageHeader from '../../containers/stage-header.jsx';
import Stage from '../../containers/stage.jsx';
import Loader from '../loader/loader.jsx';

import styles from './stage-wrapper.css';

const StageWrapperComponent = function (props) {
    const {
        isFullScreen,
        isRtl,
        isRendererSupported,
        loading,
        layoutStyle,
        stageSize,
        stageWidth,
        stageHeight,
        vm
    } = props;

    return (
        <Box
            className={classNames(
                styles.stageWrapper,
                {[styles.fullScreen]: isFullScreen}
            )}
            // style={{
            //     width: stageWidth,
            //     height: stageHeight
            // }}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <Box className={styles.stageMenuWrapper}>
                <StageHeader
                    layoutStyle={layoutStyle}
                    stageSize={stageSize}
                    vm={vm}
                    stageWidth={stageWidth}
                    stageHeight={stageHeight}
                />
            </Box>
            <Box className={styles.stageCanvasWrapper}>
                {
                    isRendererSupported ?
                        <Stage
                            layoutStyle={layoutStyle}
                            isFullScreen={isFullScreen}
                            stageSize={stageSize}
                            stageWidth={stageWidth}
                            stageHeight={stageHeight}
                            // style={{
                            //     width: stageWidth,
                            //     height: stageHeight
                            // }}
                            vm={vm}
                        /> :
                        null
                }
            </Box>
            {loading ? (
                <Loader isFullScreen={isFullScreen} />
            ) : null}
        </Box>
    );
};

StageWrapperComponent.propTypes = {
    isFullScreen: PropTypes.bool,
    isRendererSupported: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    layoutStyle: PropTypes.string,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default StageWrapperComponent;
