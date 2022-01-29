/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import styles from './message-box-modal.css';

const messages = defineMessages({
    confirm: {
        id: 'gui.messageBoxModal.confirm',
        defaultMessage: 'Confirm',
        description: 'Button confirm'
    },
    cancel: {
        id: 'gui.messageBoxModal.cancel',
        defaultMessage: 'Cancel',
        description: 'Button cancel',
    },
    giveup: {
        id: 'gui.messageBoxModal.giveup',
        defaultMessage: 'Give Up',
        description: 'Button give up'
    }
});

class MessageBoxModal extends React.PureComponent {
    render () {
        return (
            <ReactModal
                isOpen
                contentLabel={this.props.title}
                overlayClassName={styles.modalOverlay}
                onRequestClose={this.props.onRequestClose}
                className={styles.modalContent}
                id="messageBoxModal"
            >
                <Box
                    className={styles.box}
                    dir={this.props.isRtl ? 'rtl' : 'ltr'}
                    direction="column"
                    grow={1}
                >
                    <div className={styles.header}>
                        <div className={classNames(styles.headerItem, styles.headerItemTitle)}>
                            {this.props.headerImage ? (
                                <img
                                    className={styles.headerImage}
                                    src={this.props.headerImage}
                                />
                            ) : null}
                            {this.props.title}
                        </div>
                    </div>
                    <div className={styles.body}>
                        {this.props.children}
                        <div className={styles.buttonRow}>
                            {this.props.mode.includes('confirm') ? (
                                <input
                                    type="button"
                                    value={this.props.intl.formatMessage(messages.confirm)}
                                    className={styles.okButton}
                                    onClick={this.props.onConfirm}
                                />
                            ) : null}
                            {this.props.mode.includes('cancel') ? (
                                <input
                                    type="button"
                                    value={this.props.intl.formatMessage(messages.giveup)}
                                    className={styles.button}
                                    onClick={this.props.onGiveup}
                                />
                            ) : null}
                            {this.props.mode.includes('cancel') ? (
                                <input
                                    type="button"
                                    value={this.props.intl.formatMessage(messages.cancel)}
                                    className={styles.button}
                                    onClick={this.props.onCancel}
                                />
                            ) : null}
                        </div>
                    </div>
                </Box>
            </ReactModal>
        );
    }
}

MessageBoxModal.propTypes = {
    children: PropTypes.node,
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    title: PropTypes.string,
    mode: PropTypes.string,
    headerImage: PropTypes.string,
    onRequestClose: PropTypes.func,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    onGiveup: PropTypes.func
};

export default injectIntl(MessageBoxModal);
