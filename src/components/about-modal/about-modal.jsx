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
import {isScratchDesktop} from '../../lib/isScratchDesktop';

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
    desktopComponentVersion: {
        defaultMessage: '{component} Version',
        description: 'Label for showing version',
        id: 'gui.aboutModal.desktopComponentVersion'
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
            {isProd ? null : (
                <p>
                    <strong><FormattedMessage {...messages.compileTime} /></strong>
                    {': '}
                    <span>{compileTime}</span>
                </p>

            )}
            {isScratchDesktop() ? (
                ['Electron', 'Chrome', 'Node'].map(component => (
                    <p key={component}>
                        <strong><FormattedMessage
                            values={{component}}
                            {...messages.desktopComponentVersion}
                        /></strong>
                        {': '}
                        <span>{global.ClipCC.versions[component.toLowerCase()]}</span>
                    </p>
                ))
            ) : null}
            <p>
                <strong><FormattedMessage {...messages.license} /></strong>
                {': '}
                <FormattedMessage {...messages.licenseContent} />
            </p>
            <div className={styles.contact}>
                <a
                    href="https://t.me/ClipCChat"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        draggable={false}
                        width="100 px"
                        alt="Telegram"
                        title="Telegram"
                        src={telegram}
                    />
                </a>
                <a
                    href="https://jq.qq.com/?_wv=1027&k=924RaGLu"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        draggable={false}
                        width="100 px"
                        alt="QQ"
                        title="QQ"
                        src={qq}
                    />
                </a>
                <a
                    href="https://discord.gg/uuyHNBH"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        draggable={false}
                        alt="Discord"
                        title="Discord"
                        width="100 px"
                        src={discord}
                    />
                </a>
            </div>
        </Box>
    </Modal>
);

AboutModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

export default injectIntl(AboutModal);
