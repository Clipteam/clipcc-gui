import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState} from '../reducers/project-title';
import downloadBlob from '../lib/download-blob';
import log from '../lib/log';
import {showAlertWithTimeout} from '../reducers/alerts';
import {setFileSystemHandle} from '../reducers/project-state';
import {setProjectUnchanged} from '../reducers/project-changed';
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
            'downloadCc3Project',
            'downloadSb3Project',
            'saveToLastFile',
            'getExtensionData'
        ]);
    }
    getExtensionData (extensions) {
        const result = [];
        for (const id in extensions) {
            if (this.props.extension[id].api > 0) {
                result.push({
                    fileName: `extensions/${id}@${this.props.extension[id].version}.ccx`,
                    fileContent: this.props.extension[id].fileContent
                });
            }
        }
        return result;
    }
    downloadCc3Project () {
        this.props.saveProjectCc3(this.getExtensionData).then(content => {
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }
            downloadBlob(`${this.props.projectFilename}.cc3`, content);
        });
    }
    async downloadSb3Project () {
        const content = await this.props.saveProjectSb3();
        if (this.props.onSaveFinished) {
            this.props.onSaveFinished();
        }
        if (window.showSaveFilePicker) {
            await this.saveFilePicker(`${this.props.projectFilename}.sb3`, content);
        } else {
            downloadBlob(`${this.props.projectFilename}.sb3`, content);
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
        this.props.onSetProjectUnchanged();
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
            this.props.onSetProjectUnchanged();
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
            {
                cc3: this.downloadCc3Project,
                sb3: this.downloadSb3Project
            },
            this.saveToLastFile
        );
    }
}

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}`;
};

SB3Downloader.propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    fileHandle: PropTypes.func,
    onSaveFinished: PropTypes.func,
    onSetFileSystemHandle: PropTypes.func,
    onSetProjectUnchanged: PropTypes.func,
    onShowSavingAlert: PropTypes.func,
    onShowSaveSuccessAlert: PropTypes.func,
    projectFilename: PropTypes.string,
    saveProjectCc3: PropTypes.func,
    saveProjectSb3: PropTypes.func,
    extension: PropTypes.shape({
        extensionId: PropTypes.string,
        iconURL: PropTypes.string,
        insetIconURL: PropTypes.string,
        author: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),
        name: PropTypes.string,
        description: PropTypes.string,
        requirement: PropTypes.arrayOf(PropTypes.string),
        data: PropTypes.instanceOf(ArrayBuffer)
    })
};
SB3Downloader.defaultProps = {
    className: ''
};

const mapStateToProps = state => ({
    saveProjectCc3: state.scratchGui.vm.saveProjectCc3.bind(state.scratchGui.vm),
    fileHandle: state.scratchGui.projectState.fileHandle,
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState),
    extension: state.scratchGui.extension.extension
});

const mapDispatchToProps = dispatch => ({
    onSetProjectUnchanged: () => dispatch(setProjectUnchanged()),
    onSetFileSystemHandle: fileHandle => dispatch(setFileSystemHandle(fileHandle)),
    onShowSaveSuccessAlert: () => showAlertWithTimeout(dispatch, 'saveSuccess'),
    onShowSavingAlert: () => showAlertWithTimeout(dispatch, 'saving')
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SB3Downloader);
