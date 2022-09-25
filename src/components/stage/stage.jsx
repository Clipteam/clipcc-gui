import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';


import Box from '../box/box.jsx';
import DOMElementRenderer from '../../containers/dom-element-renderer.jsx';
import Loupe from '../loupe/loupe.jsx';
import MonitorList from '../../containers/monitor-list.jsx';
import TargetHighlight from '../../containers/target-highlight.jsx';
import GreenFlagOverlay from '../../containers/green-flag-overlay.jsx';
import Question from '../../containers/question.jsx';
import MicIndicator from '../mic-indicator/mic-indicator.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants.js';
import {getStageDimensions} from '../../lib/screen-utils.js';
import styles from './stage.css';

class StageComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            width: props.stageWidth,
            height: props.stageHeight
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.stageWidth !== nextProps.stageWidth || this.props.stageHeight !== nextProps.stageHeight) {
            this.setState({
                width: nextProps.stageWidth,
                height: nextProps.stageHeight
            });
        }
    }

    render () {
        const {
            canvas,
            dragRef,
            isColorPicking,
            isFullScreen,
            isStarted,
            colorInfo,
            micIndicator,
            question,
            stageSize,
            useEditorDragStyle,
            onDeactivateColorPicker,
            onDoubleClick,
            onQuestionAnswered,
            layoutStyle,
            ...boxProps
        } = this.props;

        const stageDimensions = getStageDimensions({
            width: this.state.width,
            height: this.state.height,
        }, stageSize, isFullScreen);

        return (
            <>
                <Box
                    className={classNames(
                        styles.stageWrapper,
                        {[styles.stageWrapperOverlay]: isFullScreen},
                        {[styles.withColorPicker]: !isFullScreen && isColorPicking})}
                    onDoubleClick={onDoubleClick}
                >
                    <Box
                        className={classNames(
                            styles.stage,
                            {[styles.fullScreen]: isFullScreen},
                            {[styles.stageOverlayContent]: isFullScreen},
                            {[styles.scratch2]: layoutStyle === 'scratch2' && !isFullScreen}
                        )}
                        style={{
                            height: stageDimensions.height,
                            width: stageDimensions.width
                        }}
                    >
                        <DOMElementRenderer
                            domElement={canvas}
                            style={{
                                height: stageDimensions.height,
                                width: stageDimensions.width
                            }}
                            {...boxProps}
                        />
                        <Box className={styles.monitorWrapper}>
                            <MonitorList
                                draggable={useEditorDragStyle}
                                stageSize={stageDimensions}
                            />
                        </Box>
                        <Box className={styles.frameWrapper}>
                            <TargetHighlight
                                className={styles.frame}
                                stageHeight={stageDimensions.height}
                                stageWidth={stageDimensions.width}
                            />
                        </Box>
                        {isColorPicking && colorInfo ? (
                            <Loupe colorInfo={colorInfo} />
                        ) : null}
                    </Box>

                    {/* `stageOverlays` is for items that should *not* have their overflow contained within the stage */}
                    <Box
                        className={classNames(
                            styles.stageOverlays,
                            {[styles.fullScreen]: isFullScreen}
                        )}
                    >
                        <div
                            className={styles.stageBottomWrapper}
                            style={{
                                width: stageDimensions.width,
                                left: '50%',
                                marginLeft: stageDimensions.width * -0.5,
                                height: stageDimensions.height
                            }}
                        >
                            {micIndicator ? (
                                <MicIndicator
                                    className={styles.micIndicator}
                                    stageSize={stageDimensions}
                                />
                            ) : null}
                            {question === null ? null : (
                                <div
                                    className={styles.questionWrapper}
                                    style={{width: stageDimensions.width}}
                                >
                                    <Question
                                        question={question}
                                        onQuestionAnswered={onQuestionAnswered}
                                    />
                                </div>
                            )}
                        </div>
                        <canvas
                            className={styles.draggingSprite}
                            height={0}
                            ref={dragRef}
                            width={0}
                        />
                    </Box>
                    {isStarted ? null : (
                        <GreenFlagOverlay
                            className={styles.greenFlagOverlay}
                            wrapperClass={styles.greenFlagOverlayWrapper}
                        />
                    )}
                </Box>
                {isColorPicking ? (
                    <Box
                        className={styles.colorPickerBackground}
                        onClick={onDeactivateColorPicker}
                    />
                ) : null}
            </>
        );
    }
};
StageComponent.propTypes = {
    canvas: PropTypes.instanceOf(Element).isRequired,
    colorInfo: Loupe.propTypes.colorInfo,
    dragRef: PropTypes.func,
    isColorPicking: PropTypes.bool,
    isFullScreen: PropTypes.bool.isRequired,
    isStarted: PropTypes.bool,
    micIndicator: PropTypes.bool,
    onDeactivateColorPicker: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onQuestionAnswered: PropTypes.func,
    question: PropTypes.string,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    stageWidth: PropTypes.number.isRequired,
    stageHeight: PropTypes.number.isRequired,
    useEditorDragStyle: PropTypes.bool
};
StageComponent.defaultProps = {
    dragRef: () => {}
};
const mapStateToProps = state => ({
    stageHeight: state.scratchGui.customStageSize.height,
    stageWidth: state.scratchGui.customStageSize.width,
    // Do not use editor drag style in fullscreen or player mode.
    useEditorDragStyle: !(state.scratchGui.mode.isFullScreen || state.scratchGui.mode.isPlayerOnly)
});
export default connect(
    mapStateToProps
)(StageComponent);
