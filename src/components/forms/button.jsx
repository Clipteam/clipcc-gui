import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './button.css';

const Button = props => {
    const classes = classNames(styles.button, props.className);

    return (
        <button
            className={classes}
            {...omit(props, ['className', 'children'])}
        >
            {props.children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
};

export default Button;

