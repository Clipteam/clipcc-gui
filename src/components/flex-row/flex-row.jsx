import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import style from './flex-row.css';

const FlexRow = props => (
    <props.as className={classNames('flex-row', props.className)}>
        {props.children}
    </props.as>
);

FlexRow.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

FlexRow.defaultProps = {
    as: 'div'
};

export default FlexRow;

