import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import DOMElementRenderer from '../../containers/dom-element-renderer.jsx';
import Loupe from '../loupe/loupe.jsx';
import MonitorList from '../../containers/monitor-list.jsx';
import TargetHighlight from '../../containers/target-highlight.jsx';
import GreenFlagOverlay from '../../containers/green-flag-overlay.jsx';
import Question from '../../containers/question.jsx';
import SBFileUploader from '../../containers/sb-file-uploader.jsx';
import MicIndicator from '../mic-indicator/mic-indicator.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants.js';
import {getStageDimensions} from '../../lib/screen-utils.js';
import styles from './stage.css';
import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';

class StageComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this,
            'handleDragEnter',
            'handleDragOver',
            'handleDragLeave',
            'handleDrop'
        );
        this.state = {
            dragingFile: false
        };
        this.handleSetUploaderRef = el => {
            this.uploaderRef = el;
        };
        this.uploaderRef = null;
    }
    componentWillMount () {
        const canvas = this.props.canvas;
        canvas.addEventListener('dragenter', this.handleDragEnter);
        canvas.addEventListener('dragover', this.handleDragOver);
        canvas.addEventListener('dragleave', this.handleDragLeave);
        canvas.addEventListener('drop', this.handleDrop);
    }
    componentWillUnmount () {
        const canvas = this.props.canvas;
        canvas.removeEventListener('dragenter', this.handleDragEnter);
        canvas.removeEventListener('dragover', this.handleDragOver);
        canvas.removeEventListener('dragleave', this.handleDragLeave);
        canvas.removeEventListener('drop', this.handleDrop);
    }
    handleDragEnter (e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            dragingFile: true
        });
    }
    handleDragOver (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    handleDragLeave (e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            dragingFile: false
        });
    }
    handleDrop (e) {
        e.preventDefault();
        e.stopPropagation();
        const thisFileInput = e.dataTransfer;
        this.uploaderRef.handleChange({
            target: {
                files: thisFileInput.files
            }
        });
        this.setState({
            dragingFile: false
        });
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

        const stageDimensions = getStageDimensions(stageSize, isFullScreen);
        return (
            <div>
                <Box
                    className={classNames({
                        [styles.stageWrapper]: !isFullScreen,
                        [styles.stageWrapperOverlay]: isFullScreen,
                        [styles.withColorPicker]: !isFullScreen && isColorPicking
                    })}
                    style={{
                        minHeight: stageDimensions.height,
                        minWidth: stageDimensions.width
                    }}
                    onDoubleClick={onDoubleClick}
                >
                    <Box
                        className={classNames(
                            styles.stage,
                            {[styles.stageOverlayContent]: isFullScreen},
                            {[styles.scratch2]: layoutStyle === 'scratch2' && !isFullScreen}
                        )}
                        style={{
                            height: stageDimensions.height,
                            width: stageDimensions.width
                        }}
                    >
                        <SBFileUploader
                            canSave={this.props.canSave}
                            userOwnsProject={this.props.userOwnsProject}
                            onRef={this.handleSetUploaderRef}
                        >{() => null}</SBFileUploader>
                        <div
                            className={classNames({
                                [styles.dragLayout]: !isFullScreen,
                                [styles.dragingFile]: this.state.dragingFile
                            })}
                            style={{
                                minHeight: stageDimensions.height + 1,
                                minWidth: stageDimensions.width + 1
                            }}
                        />
                        <DOMElementRenderer
                            domElement={canvas}
                            style={{
                                height: stageDimensions.height,
                                width: stageDimensions.width
                            }}
                            {...boxProps}
                        />
                    </Box>
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
                    {isStarted ? null : (
                        <GreenFlagOverlay
                            className={styles.greenFlagOverlay}
                            wrapperClass={styles.greenFlagOverlayWrapper}
                        />
                    )}
                    {isColorPicking && colorInfo ? (
                        <Box className={styles.colorPickerWrapper}>
                            <Loupe colorInfo={colorInfo} />
                        </Box>
                    ) : null}
                    <div
                        className={styles.stageBottomWrapper}
                        style={{
                            width: stageDimensions.width,
                            height: stageDimensions.height,
                            left: '50%',
                            marginLeft: stageDimensions.width * -0.5
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
                {isColorPicking ? (
                    <Box
                        className={styles.colorPickerBackground}
                        onClick={onDeactivateColorPicker}
                    />
                ) : null}
            </div>
        );
    }
}
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
    canSave: PropTypes.bool,
    userOwnsProject: PropTypes.bool,
    onQuestionAnswered: PropTypes.func,
    question: PropTypes.string,
    layoutStyle: PropTypes.string,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    useEditorDragStyle: PropTypes.bool,
    dragingFile: PropTypes.bool
};
StageComponent.defaultProps = {
    dragRef: () => {},
    layoutStyle: 'scratch3',
    dragingFile: false
};

const mapStateToProps = (state, ownProps) => {
    const user = state.session && state.session.session && state.session.session.user;
    return {
        userOwnsProject: ownProps.authorUsername && user &&
            (ownProps.authorUsername === user.username)
    };
};

export default connect(
    mapStateToProps
)(StageComponent);
