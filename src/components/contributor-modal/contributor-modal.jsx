import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Modal from '../../containers/modal.jsx';
import styles from './contributor-modal.css';
import {contributorList} from './contributor-list.js';

const messages = defineMessages({
    contributorModalTitle: {
        defaultMessage: 'Contributor list',
        description: 'Title for contributor list modal',
        id: 'gui.aboutModal.contributorModalTitle'
    }
});

const ContributorModal = ({
    intl,
    onRequestClose
}) => (
    <Modal
        className={styles.modalContent}
        contentLabel={intl.formatMessage(messages.contributorModalTitle)}
        onRequestClose={onRequestClose}
        id="aboutModal"
    >
        <Box className={styles.body}>
            <p>
                <strong>{contributorList}</strong>
            </p>
        </Box>
    </Modal>
);

ContributorModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

export default injectIntl(ContributorModal);
