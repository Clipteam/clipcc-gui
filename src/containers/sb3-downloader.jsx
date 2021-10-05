import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState} from '../reducers/project-title';
import downloadBlob from '../lib/download-blob';
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
            'downloadSb3Project'
        ]);
    }
    downloadCc3Project () {
        this.props.saveProjectCc3().then(content => {
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }
            downloadBlob(this.props.projectFilename, content);
        });
    }
    downloadSb3Project () {
        this.props.saveProjectSb3().then(content => {
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }
            downloadBlob(this.props.projectFilename, content);
        });
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
            }
        );
    }
}

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    // cc: download .cc3 file
    return `${filenameTitle.substring(0, 100)}.cc3`;
};

SB3Downloader.propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    onSaveFinished: PropTypes.func,
    projectFilename: PropTypes.string,
    saveProjectCc3: PropTypes.func,
    saveProjectSb3: PropTypes.func
};
SB3Downloader.defaultProps = {
    className: ''
};

const mapStateToProps = state => ({
    saveProjectCc3: state.scratchGui.vm.saveProjectCc3.bind(state.scratchGui.vm),
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(SB3Downloader);
