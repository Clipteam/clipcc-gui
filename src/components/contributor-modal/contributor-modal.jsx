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
            <div className={styles.scrollable}>
                <strong>{contributorList.tips}</strong>
                <p>{contributorList.sinangentoo}<br /></p>
                <p>{contributorList.alexcui}<br /></p>
                <p>{contributorList.solstice23}<br /></p>
                <p>{contributorList.bleshi}<br /></p>
                <p>{contributorList.e4361}<br /></p>
                <p>{contributorList.sparrowhe}<br /></p>
                <p>{contributorList.jasonjia}<br /></p>
                <p>{contributorList.xiaoji4093}<br /></p>
                <p>{contributorList.hydrostic}<br /></p>
                <p>{contributorList.zerlight}<br /></p>
                <p>{contributorList.frank782}<br /></p>
                <p>{contributorList.stevexmh}<br /></p>
                <p>{contributorList.jasonxu}<br /></p>
                <p>{contributorList.lmlanmei}<br /></p>
                <p>{contributorList.waterblock79}<br /></p>
                <p>{contributorList.someoneyoung}<br /></p>
                <p>{contributorList.yuan3old}<br /></p>
                <p>{contributorList.soilzhu}<br /></p>
                <p>{contributorList.cyarice}<br /></p>
                <p>{contributorList.lyricepic}<br /></p>
                <p>{contributorList.unknown}<br /></p>
                <p>{contributorList.mbzzw}<br /></p>
                <p>{contributorList.afadian}<br /></p>
                <p>{contributorList.august}<br /></p>
                <p>{contributorList.you}<br /></p>
            </div>
        </Box>
    </Modal>
);

ContributorModal.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func.isRequired
};

export default injectIntl(ContributorModal);
