import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import styles from './switch.css';
const LayoutSetting = props => (
    <div className={styles.switchMain}></div>
);

LayoutSetting.propTypes = {
    intl: intlShape.isRequired
};

export default injectIntl(LayoutSetting);
