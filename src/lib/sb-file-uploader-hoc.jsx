import bindAll from 'lodash.bindall';
import React from 'react';
import PropTypes from 'prop-types';
import {defineMessages, injectIntl} from 'react-intl';
import {connect} from 'react-redux';
import JSZip from 'jszip';
import log from '../lib/log';
import sharedMessages from './shared-messages';
import {loadExtensionFromFile} from '../lib/extension-manager.js';

import {
    LoadingStates,
    getIsLoadingUpload,
    getIsShowingWithoutId,
    onLoadedProject,
    requestProjectUpload,
    setFileSystemHandle
} from '../reducers/project-state';
import {setProjectTitle} from '../reducers/project-title';
import {
    openLoadingProject,
    closeLoadingProject,
    openLoadErrorModal
} from '../reducers/modals';
import {
    closeFileMenu
} from '../reducers/menus';
import {
    enableExtension
} from '../reducers/extension';
import {
    setLoadError
} from '../reducers/load-error';
import {getSetting} from '../reducers/settings';

const messages = defineMessages({
    loadError: {
        id: 'gui.projectLoader.loadError',
        defaultMessage: 'The project file that was selected failed to load.',
        description: 'An error that displays when a local project file fails to load.'
    }
});

/**
 * Higher Order Component to provide behavior for loading local project files into editor.
 * @param {React.Component} WrappedComponent the component to add project file loading functionality to
 * @returns {React.Component} WrappedComponent with project file loading functionality added
 *
 * <SBFileUploaderHOC>
 *     <WrappedComponent />
 * </SBFileUploaderHOC>
 */
const SBFileUploaderHOC = function (WrappedComponent) {
    class SBFileUploaderComponent extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'createFileObjects',
                'getProjectTitleFromFilename',
                'handleFinishedLoadingUpload',
                'handleStartSelectingFileUpload',
                'handleChange',
                'onload',
                'removeFileObjects'
            ]);
        }
        componentDidUpdate (prevProps) {
            if (this.props.isLoadingUpload && !prevProps.isLoadingUpload) {
                this.handleFinishedLoadingUpload(); // cue step 5 below
            }
        }
        componentWillUnmount () {
            this.removeFileObjects();
        }
        // step 1: this is where the upload process begins
        handleStartSelectingFileUpload () {
            this.createFileObjects(); // go to step 2
        }
        // step 2: create a FileReader and an <input> element, and issue a
        // pseudo-click to it. That will open the file chooser dialog.
        createFileObjects () {
            // redo step 7, in case it got skipped last time and its objects are
            // still in memory
            this.removeFileObjects();
            // create fileReader
            this.fileReader = new FileReader();
            this.fileReader.onload = this.onload;
            if (window.showOpenFilePicker) {
                (async () => {
                    const [handle] = await window.showOpenFilePicker({
                        types: [
                            {
                                description: 'ClipCC File',
                                accept: {
                                    'application/x.scratch.sb3': ['.sb', '.sb2', '.sb3', '.cc3']
                                }
                            }
                        ],
                        multiple: false
                    });
                    const file = await handle.getFile();
                    this.handleChange({
                        target: {
                            files: [file]
                        }
                    });
                    if (file.name.endsWith('.sb3')) {
                        this.props.onSetFileSystemHandle(handle);
                    }
                    if (this.props.enableAutoSave && await handle.queryPermission({mode: 'readwrite'}) === 'prompt') {
                        await handle.requestPermission({mode: 'readwrite'});
                    }

                })();
            } else {
                // create <input> element and add it to DOM
                this.inputElement = document.createElement('input');
                this.inputElement.accept = '.sb,.sb2,.sb3,.cc3';
                this.inputElement.style = 'display: none;';
                this.inputElement.type = 'file';
                this.inputElement.onchange = this.handleChange; // connects to step 3
                document.body.appendChild(this.inputElement);
                // simulate a click to open file chooser dialog
                this.inputElement.click();
            }
        }
        // step 3: user has picked a file using the file chooser dialog.
        // We don't actually load the file here, we only decide whether to do so.
        handleChange (e) {
            const {
                intl,
                isShowingWithoutId,
                loadingState,
                projectChanged,
                userOwnsProject
            } = this.props;
            const thisFileInput = e.target;
            if (thisFileInput.files) { // Don't attempt to load if no file was selected
                this.fileToUpload = thisFileInput.files[0];

                // If user owns the project, or user has changed the project,
                // we must confirm with the user that they really intend to
                // replace it. (If they don't own the project and haven't
                // changed it, no need to confirm.)
                let uploadAllowed = true;
                if (userOwnsProject || (projectChanged && isShowingWithoutId)) {
                    uploadAllowed = confirm( // eslint-disable-line no-alert
                        intl.formatMessage(sharedMessages.replaceProjectWarning)
                    );
                }
                if (uploadAllowed) {
                    // cues step 4
                    this.props.requestProjectUpload(loadingState);
                } else {
                    // skips ahead to step 7
                    this.removeFileObjects();
                }
                this.props.closeFileMenu();
            }
        }
        // step 4 is below, in mapDispatchToProps

        // step 5: called from componentDidUpdate when project state shows
        // that project data has finished "uploading" into the browser
        handleFinishedLoadingUpload () {
            if (this.fileToUpload && this.fileReader) {
                // begin to read data from the file. When finished,
                // cues step 6 using the reader's onload callback
                this.fileReader.readAsArrayBuffer(this.fileToUpload);
            } else {
                this.props.cancelFileUpload(this.props.loadingState);
                // skip ahead to step 7
                this.removeFileObjects();
            }
        }
        // used in step 6 below
        getProjectTitleFromFilename (fileInputFilename) {
            if (!fileInputFilename) return '';
            // only parse title with valid scratch project extensions
            // (.sb, .sb2, and .sb3/.cc3)
            const matches = fileInputFilename.match(/^(.*)\.(sb|cc)[23]?$/);
            if (!matches) return '';
            return matches[1].substring(0, 100); // truncate project title to max 100 chars
        }
        // step 6: attached as a handler on our FileReader object; called when
        // file upload raw data is available in the reader
        async onload () {
            if (this.fileReader) {
                this.props.onLoadingStarted();
                const filename = this.fileToUpload && this.fileToUpload.name;
                let loadingSuccess = false;
                const fileExt = filename.substring(filename.lastIndexOf('.') + 1);
                // If this is *.cc3 file, check and load its extensions in it.
                if (fileExt === 'cc3') {
                    const zipData = await JSZip.loadAsync(this.fileReader.result);
                    for (const file in zipData.files) {
                        if (/^extensions\/.+\.ccx$/g.test(file)) {
                            const data = await zipData.files[file].async('arraybuffer');
                            await this.props.loadExtensionFromFile(data, 'ccx');
                        }
                    }
                }
                this.props.vm.loadProject(this.fileReader.result)
                    .then(() => {
                        if (filename) {
                            const uploadedProjectTitle = this.getProjectTitleFromFilename(filename);
                            this.props.onSetProjectTitle(uploadedProjectTitle);
                        }
                        loadingSuccess = true;
                    })
                    .catch(error => {
                        let errorDetail;
                        if (error.code === 0x90 /* ERROR_UNAVAILABLE_EXTENSION */) {
                            this.props.showLoadErrorModal({
                                errorId: 'unavailableExtension',
                                missingExtensions: error.extension
                            });
                            errorDetail = `Unavailable extension:\n${error.extension.map(v => `  ${v.id}@${v.version}`).join('\n')}`;
                        }
                        log.error(errorDetail);
                        this.props.onSetFileSystemHandle(null);
                        alert(this.props.intl.formatMessage(messages.loadError)); // eslint-disable-line no-alert
                    })
                    .then(() => {
                        this.props.onLoadingFinished(this.props.loadingState, loadingSuccess);
                        // go back to step 7: whether project loading succeeded
                        // or failed, reset file objects
                        this.removeFileObjects();
                    });
            }
        }
        // step 7: remove the <input> element from the DOM and clear reader and
        // fileToUpload reference, so those objects can be garbage collected
        removeFileObjects () {
            if (this.inputElement) {
                this.inputElement.value = null;
                document.body.removeChild(this.inputElement);
            }
            this.inputElement = null;
            this.fileReader = null;
            this.fileToUpload = null;
        }
        render () {
            const {
                /* eslint-disable no-unused-vars */
                cancelFileUpload,
                closeFileMenu: closeFileMenuProp,
                enableAutoSave,
                isLoadingUpload,
                isShowingWithoutId,
                loadingState,
                onLoadingFinished,
                onLoadingStarted,
                onSetProjectTitle,
                onSetFileSystemHandle,
                projectChanged,
                requestProjectUpload: requestProjectUploadProp,
                setExtensionEnable,
                showLoadErrorModal,
                userOwnsProject,
                /* eslint-enable no-unused-vars */
                ...componentProps
            } = this.props;
            return (
                <React.Fragment>
                    <WrappedComponent
                        onStartSelectingFileUpload={this.handleStartSelectingFileUpload}
                        {...componentProps}
                    />
                </React.Fragment>
            );
        }
    }

    SBFileUploaderComponent.propTypes = {
        canSave: PropTypes.bool,
        cancelFileUpload: PropTypes.func,
        enableAutoSave: PropTypes.bool,
        closeFileMenu: PropTypes.func,
        isLoadingUpload: PropTypes.bool,
        isShowingWithoutId: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        onLoadingFinished: PropTypes.func,
        onLoadingStarted: PropTypes.func,
        onSetFileSystemHandle: PropTypes.func,
        onSetProjectTitle: PropTypes.func,
        projectChanged: PropTypes.bool,
        requestProjectUpload: PropTypes.func,
        showLoadErrorModal: PropTypes.func,
        setExtensionEnable: PropTypes.func,
        userOwnsProject: PropTypes.bool,
        vm: PropTypes.shape({
            loadProject: PropTypes.func
        }),
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
            enabled: PropTypes.bool
        }),
        loadExtensionFromFile: PropTypes.func.isRequired
    };
    const mapStateToProps = (state, ownProps) => {
        const loadingState = state.scratchGui.projectState.loadingState;
        const user = state.session && state.session.session && state.session.session.user;
        return {
            isLoadingUpload: getIsLoadingUpload(loadingState),
            isShowingWithoutId: getIsShowingWithoutId(loadingState),
            loadingState: loadingState,
            projectChanged: state.scratchGui.projectChanged,
            userOwnsProject: ownProps.authorUsername && user &&
                (ownProps.authorUsername === user.username),
            vm: state.scratchGui.vm,
            extension: state.scratchGui.extension.extension,
            enableAutoSave: getSetting(state, 'autosave') === 'on'
        };
    };
    const mapDispatchToProps = (dispatch, ownProps) => ({
        cancelFileUpload: loadingState => dispatch(onLoadedProject(loadingState, false, false)),
        closeFileMenu: () => dispatch(closeFileMenu()),
        // transition project state from loading to regular, and close
        // loading screen and file menu
        onLoadingFinished: (loadingState, success) => {
            dispatch(onLoadedProject(loadingState, ownProps.canSave, success));
            dispatch(closeLoadingProject());
            dispatch(closeFileMenu());
        },
        // show project loading screen
        onLoadingStarted: () => dispatch(openLoadingProject()),
        onSetProjectTitle: title => dispatch(setProjectTitle(title)),
        onSetFileSystemHandle: fileHandle => dispatch(setFileSystemHandle(fileHandle)),
        // step 4: transition the project state so we're ready to handle the new
        // project data. When this is done, the project state transition will be
        // noticed by componentDidUpdate()
        requestProjectUpload: loadingState => dispatch(requestProjectUpload(loadingState)),
        setExtensionEnable: id => dispatch(enableExtension(id)),
        showLoadErrorModal: data => {
            dispatch(setLoadError(data));
            dispatch(openLoadErrorModal());
        },
        loadExtensionFromFile: (file, type) => loadExtensionFromFile(dispatch, file, type)
    });
    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );
    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(SBFileUploaderComponent));
};

export {
    SBFileUploaderHOC as default
};
