import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl} from 'react-intl';

import InlineMessages from '../../containers/inline-messages.jsx';

import {
    manualUpdateProject
} from '../../reducers/project-state';

import {
    filterInlineAlerts
} from '../../reducers/alerts';

import styles from './save-status.css';


const messages = defineMessages({
    saveNow: {
        // defaultMessage: 'Auto Save',
        defaultMessage: 'Save Now',
        description: 'Title bar link for saving now',
        id: 'gui.menuBar.saveNowLink'
    },
    saveOriginalFile: {
        // defaultMessage: 'Save Computer',
        defaultMessage: 'Save to original file',
        description: 'Title bar link for saving original file',
        id: 'gui.menuBar.saveToOriginalFile'
    }
});


// Wrapper for inline messages in the nav bar, which are all related to saving.
// Show any inline messages if present, else show the "Save Now" button if the
// project has changed.
// We decided to not use an inline message for "Save Now" because it is a reflection
// of the project state, rather than an event.
const SaveStatus = ({
    alertsList,
    intl,
    isStandalone,
    canSave,
    fileHandle,
    projectChanged,
    onClickSave
}) => (
    filterInlineAlerts(alertsList).length > 0 ? (
        <InlineMessages />
    ) : projectChanged && (canSave || (!!window.showSaveFilePicker && !!isStandalone && fileHandle !== null)) && (
        <div
            className={styles.saveNow}
            onClick={onClickSave}
        >
            {intl.formatMessage(canSave ? messages.saveNow : messages.saveOriginalFile)}
        </div>
    ));

SaveStatus.propTypes = {
    alertsList: PropTypes.arrayOf(PropTypes.object),
    isStandalone: PropTypes.bool,
    canSave: PropTypes.bool,
    fileHandle: PropTypes.func,
    onClickSave: PropTypes.func,
    projectChanged: PropTypes.bool
};

const mapStateToProps = state => ({
    alertsList: state.scratchGui.alerts.alertsList,
    projectChanged: state.scratchGui.projectChanged
});

const mapDispatchToProps = dispatch => ({
    onClickSave: () => dispatch(manualUpdateProject())
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(SaveStatus));
