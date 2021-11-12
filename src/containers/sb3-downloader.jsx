import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState} from '../reducers/project-title';
import downloadBlob from '../lib/download-blob';
import {notScratchDesktop} from '../lib/isScratchDesktop';
import log from '../lib/log';
import {showAlertWithTimeout} from '../reducers/alerts';
import {setFileSystemHandle} from '../reducers/project-state';
/**
 * Project saver component passes a downloadProject function to its child.
 * It expects this child to be a function with the signature
 *     function (downloadProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <SB3Downloader>{(downloadProject, props) => (
 *     <MyCoolComponent
 *         onClick={downloadProject}
 *         {...props}
 *     />
 * )}</SB3Downloader>
 */
class SB3Downloader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'downloadProject',
            'saveToLastFile'
        ]);
    }
    async downloadProject () {
        const content = await this.props.saveProjectSb3();
        if (this.props.onSaveFinished) {
            this.props.onSaveFinished();
        }
        if (window.showSaveFilePicker && notScratchDesktop()) {
            await this.saveFilePicker(this.props.projectFilename, content);
        } else {
            downloadBlob(this.props.projectFilename, content);
        }
    }
    async saveToLastFile () {
        const handle = this.props.fileHandle;
        if (handle === null) return;
        const writable = await handle.createWritable();
        this.props.onShowSavingAlert();
        const content = await this.props.saveProjectSb3();
        await writable.write(content);
        await writable.close();
        this.props.onShowSaveSuccessAlert();
    }
    async saveFilePicker (fileName, content) {
        try {
            const fileHandle = await window.showSaveFilePicker(
                {
                    types: [
                        {
                            description: 'Scratch 3 File',
                            accept: {'application/x.scratch.sb3': ['.sb3']}
                        }
                    ],
                    suggestedName: fileName,
                    excludeAcceptAllOption: true
                });
            this.props.onShowSavingAlert();
            const writable = await fileHandle.createWritable();
            await writable.write(content);
            this.props.onSetFileSystemHandle(fileHandle);
            await writable.close();
            this.props.onShowSaveSuccessAlert();
        } catch (err) {
            log.error(err);
            if (err.name === 'SecurityError') {
                downloadBlob(fileName, content);
            }
        }
    }
    render () {
        const {
            children
        } = this.props;
        return children(
            this.props.className,
            this.downloadProject,
            this.saveToLastFile
        );
    }
}

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.sb3`;
};

SB3Downloader.propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    fileHandle: PropTypes.func,
    onSaveFinished: PropTypes.func,
    onSetFileSystemHandle: PropTypes.func,
    onShowSavingAlert: PropTypes.func,
    onShowSaveSuccessAlert: PropTypes.func,
    projectFilename: PropTypes.string,
    saveProjectSb3: PropTypes.func
};
SB3Downloader.defaultProps = {
    className: ''
};

const mapStateToProps = state => ({
    fileHandle: state.scratchGui.projectState.fileHandle,
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});

const mapDispatchToProps = dispatch => ({
    onSetFileSystemHandle: fileHandle => dispatch(setFileSystemHandle(fileHandle)),
    onShowSaveSuccessAlert: () => showAlertWithTimeout(dispatch, 'saveSuccess'),
    onShowSavingAlert: () => showAlertWithTimeout(dispatch, 'saving')
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SB3Downloader);
