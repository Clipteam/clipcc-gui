import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl} from 'react-intl';
import Modal from '../../containers/modal.jsx';
import styles from './contributor-modal.css';
import {contributorList} from './contributor-list.js';

const messages = defineMessages({
    contributorModalTitle: {
        defaultMessage: 'Contributor list',
        description: 'Title for contributor list modal',
        id: 'gui.contributorModal.contributorModalTitle'
    },
    majorDeveloper: {
        defaultMessage: 'Lead developer',
        description: 'label of lead developer',
        id: 'gui.contributorModal.majordeveloper'
    },
    developer: {
        defaultMessage: 'Developer',
        description: 'label of developer',
        id: 'gui.contributorModal.developer'
    },
    designer: {
        defaultMessage: 'Designer',
        description: 'label of designer',
        id: 'gui.contributorModal.designer'
    },
    investor: {
        defaultMessage: 'Investor',
        description: 'label of investor',
        id: 'gui.contributorModal.investor'
    },
    translator: {
        defaultMessage: 'Translator',
        description: 'label of translator',
        id: 'gui.contributorModal.translator'
    },
    advocates: {
        defaultMessage: 'Advocates',
        description: 'label of advocates',
        id: 'gui.contributorModal.advocates'
    },
    donor: {
        defaultMessage: 'Donor',
        description: 'label of donor',
        id: 'gui.contributorModal.donor'
    },
    andyou: {
        defaultMessage: 'And you.',
        description: 'label of and you',
        id: 'gui.contributorModal.andyou'
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
        id="contributorModal"
    >
        <Box className={styles.body}>
            <div className={styles.scrollable}>
                <strong>{intl.formatMessage(messages.majorDeveloper)}</strong>
                <p>{contributorList.sinangentoo}</p>
                <p>{contributorList.alexcui}</p>
                <p>{contributorList.frank782}</p>
                <p>{contributorList.hydrostic}</p>
                <strong>{intl.formatMessage(messages.developer)}</strong>
                <p>{contributorList.stevexmh}</p>
                <p>{contributorList.jasonxu}</p>
                <p>{contributorList.solstice23}</p>
                <p>{contributorList.e4361}</p>
                <p>{contributorList.waterblock79}</p>
                <p>{contributorList.sparrowhe}</p>
                <strong>{intl.formatMessage(messages.designer)}</strong>
                <p>{contributorList.zerlight}</p>
                <p>{contributorList.soilzhu}</p>
                <strong>{intl.formatMessage(messages.advocates)}</strong>
                <p>{contributorList.someoneyoung}</p>
                <p>{contributorList.yuan3old}</p>
                <p>{contributorList.jasonjia}</p>
                <p>{contributorList.cyarice}</p>
                <p>{contributorList.xiaoji4093}</p>
                <strong>{intl.formatMessage(messages.investor)}</strong>
                <p>{contributorList.bleshi}</p>
                <p>{contributorList.xiaoji4093}</p>
                <strong>{intl.formatMessage(messages.translator)}</strong>
                <p>{contributorList.soilzhu}</p>
                <p>{contributorList.lmlanmei}</p>
                <strong>{intl.formatMessage(messages.donor)}</strong>
                <p>{contributorList.cyarice}</p>
                <p>{contributorList.lyricepic}</p>
                <p>{contributorList.unknown}</p>
                <p>{contributorList.mbzzw}</p>
                <p>{contributorList.afadian}</p>
                <strong>{intl.formatMessage(messages.andyou)}</strong>
            </div>
        </Box>
    </Modal>
);

ContributorModal.propTypes = {
    onRequestClose: PropTypes.func.isRequired
};

export default injectIntl(ContributorModal);
