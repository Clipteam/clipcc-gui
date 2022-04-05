import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';
import Switch from '../settings-modal/switch.jsx';
import styles from './extension-modal.css';

const messages = defineMessages({
    extensionModalTitle: {
        defaultMessage: 'Extension Settings',
        description: 'Title for extension modal',
        id: 'gui.extensionModal.extensionModalTitle'
    },
    extensionId: {
        defaultMessage: 'Extension ID',
        description: 'Label for extension ID',
        id: 'gui.extensionModal.extensionId'
    },
    required: {
        defaultMessage: 'Required',
        description: 'Label for required',
        id: 'gui.extensionModal.required'
    },
    upload: {
        defaultMessage: 'Upload',
        description: 'Label for upload',
        id: 'gui.extensionModal.upload'
    }
});

class ExtensionModal extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSwitchChange'
        ]);
    }
    handleSwitchChange (item, status) {
        const extensionId = item.extensionId;
    }
    render () {
        return (
            <Modal
                //fullScreen
                className={styles.modalContent}
                contentLabel={this.props.intl.formatMessage(messages.extensionModalTitle)}
                onRequestClose={this.props.onRequestClose}
                id="extensionModal"
            >
                <Box className={styles.body}>
                    <table>
                        <thead>
                            <tr>
                                <th><FormattedMessage {...messages.extensionId} /></th>
                                <th><FormattedMessage {...messages.required} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(this.props.extension).map(ext => (
                                <tr key={ext.extensionId}>
                                    <td>
                                        <img
                                            src={ext.insetIconURL}
                                            className={styles.icon}
                                        />
                                        <span className={styles.extensionId}>{ext.extensionId}</span>
                                    </td>
                                    <td>
                                        <Switch
                                            onChange={this.handleSwitchChange}
                                            default={ext.enabled}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            className={styles.uploadButton}
                                        >
                                            <FormattedMessage {...messages.upload} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>
            </Modal>
        );
    }
};

ExtensionModal.propTypes = {
    onRequestClose: PropTypes.func.isRequired,
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
    })
};

const mapStateToProps = state => ({
    extension: state.scratchGui.extension.extension
})

export default injectIntl(connect(
    mapStateToProps
)(ExtensionModal));
