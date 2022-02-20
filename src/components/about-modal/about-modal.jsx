/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
import Modal from '../../containers/modal.jsx';
import styles from './about-modal.css';
import logo from './clipcc3_logo.svg';
import telegram from './telegram.svg';
import qq from './qq.svg';
import discord from './discord.svg';

import {appVersion, appVersionFull, compileTime, isProd} from '../../lib/app-info';

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
    compileTime: {
        defaultMessage: 'Compile Time',
        description: 'Label for compile time',
        id: 'gui.aboutModal.compileTime'
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
                <span>{isProd ? appVersion : appVersionFull}</span>
            </p>
            {!isProd ? (
                <p>
                    <strong><FormattedMessage {...messages.compileTime} /></strong>
                    {': '}
                    <span>{compileTime}</span>
                </p>
            ) : null}
            <p>
                <strong><FormattedMessage {...messages.license} /></strong>
                {': '}
                <FormattedMessage {...messages.licenseContent} />
            </p>
            <div className={styles.contact}>
                <img
                    draggable={false}
                    width="100 px"
                    onClick={() => {
                        window.open('https://t.me/ClipCChat', '_blank');
                    }}
                    src={telegram}
                />
                <img
                    draggable={false}
                    width="100 px"
                    onClick={() => {
                        window.open('https://jq.qq.com/?_wv=1027&k=924RaGLu', '_blank');
                    }}
                    src={qq}
                />
                <img
                    draggable={false}
                    width="100 px"
                    onClick={() => {
                        window.open('https://discord.gg/uuyHNBH', '_blank');
                    }}
                    src={discord}
                />
            </div>
        </Box>
    </Modal>
);

AboutModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

export default injectIntl(AboutModal);
