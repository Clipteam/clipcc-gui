import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './input-box.css';

const InputBox = ({
    className,
    label,
    ...props
}) => (
    <input
        className={classNames(styles.inputBox, className)}
        label={label}
        {...omit(props, ['classname'])}
    />
);

InputBox.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string
};

export default InputBox;

