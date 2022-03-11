import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {defineMessages, injectIntl, FormattedMessage} from 'react-intl';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import styles from './load-error-modal.css';

const messages = defineMessages({
    confirm: {
        id: 'gui.loadErrorModal.confirm',
        defaultMessage: 'Confirm',
        description: 'Button confirm'
    },
    title: {
        id: 'gui..loadErrorModal.title',
        defaultMessage: 'Load Error',
        description: 'Title of LoadErrorModal'
    },
    unavailableExtension: {
        id: 'gui.loadError.unavailableExtension',
        defaultMessage: 'Unavailable Extension',
        description: 'Load Error: Unavailable Extension'
    }
});

/* eslint-disable react/prefer-stateless-function */
class LoadErrorModal extends React.PureComponent {
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
                            {this.props.intl.formatMessage(messages.title)}
                        </div>
                    </div>
                    <div className={styles.body}>
                        <p>{this.props.intl.formatMessage(messages[this.props.data.errorId])}</p>
                        {this.props.data.missingExtensions.length > 0 ?
                            this.props.data.missingExtensions.map(v => <p>
                                {`${v.id}@${v.version}`}
                            </p>)
                        : null}
                        <div className={styles.buttonRow}>
                            <input
                                type="button"
                                value={this.props.intl.formatMessage(messages.confirm)}
                                className={styles.okButton}
                                onClick={this.props.onRequestClose}
                            />
                        </div>
                    </div>
                </Box>
            </ReactModal>
        );
    }
}
/* eslint-enable react/prefer-stateless-function */

LoadErrorModal.propTypes = {
    isRtl: PropTypes.bool,
    data: PropTypes.shape({
        errorId: PropTypes.string,
        detail: PropTypes.string,
        missingExtensions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            version: PropTypes.string
        }))
    }),
    headerImage: PropTypes.string,
    onRequestClose: PropTypes.func
};

export default injectIntl(LoadErrorModal);
