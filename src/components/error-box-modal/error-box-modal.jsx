import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import ReactModal from 'react-modal';

import Box from '../box/box.jsx';

import styles from './error-box-modal.css';

const messages = defineMessages({
    confirm: {
        id: 'gui.errorBoxModal.confirm',
        defaultMessage: 'Confirm',
        description: 'Button confirm'
    }
});

class ErrorBoxModal extends React.PureComponent {
    constructor (props) {
        super(props);
    }
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

ErrorBoxModal.propTypes = {
    children: PropTypes.node,
    intl: intlShape.isRequired,
    isRtl: PropTypes.bool,
    title: PropTypes.string,
    mode: PropTypes.string,
    headerImage: PropTypes.string,
    onRequestClose: PropTypes.func
};

export default injectIntl(ErrorBoxModal);
