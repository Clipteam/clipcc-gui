import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Modal from '../../containers/modal.jsx';
import styles from './about-modal.css';
import logo from './clipcc3_logo.svg';

import {appVersionFull} from '../../lib/app-info';

const messages = defineMessages({
    aboutModalTitle: {
        defaultMessage: 'About',
        description: 'Title for about',
        id: 'gui.aboutModal.aboutModalTitle'
    },
    appVersion: {
        defaultMessage: 'ClipCC Version',
        description: 'Label for showing version',
        id: 'gui.aboutModal.appVersion'
    },
    license: {
        defaultMessage: 'License',
        description: 'Label for showing license',
        id: 'gui.aboutModal.license'
    },
    licenseContent: {
        defaultMessage: 'GNU Affero General Public License v3',
        description: 'Content for showing license',
        id: 'gui.aboutModal.licenseContent'
    }
});

const AboutModal = ({
    intl,
    onRequestClose
}) => (
    <Modal
        className={styles.modalContent}
        contentLabel={intl.formatMessage(messages.aboutModalTitle)}
        onRequestClose={onRequestClose}
        id="aboutModal"
    >
        <Box className={styles.body}>
            <img
                src={logo}
                className={styles.logo}
            />
            <p>
                <strong><FormattedMessage {...messages.appVersion} /></strong>
                {': '}
                <span>{appVersionFull}</span>
            </p>
            <p>
                <strong><FormattedMessage {...messages.license} /></strong>
                {': '}
                <FormattedMessage {...messages.licenseContent} />
            </p>
        </Box>
    </Modal>
);

AboutModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

export default injectIntl(AboutModal);
