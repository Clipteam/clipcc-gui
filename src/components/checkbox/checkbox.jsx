import PropTypes from 'prop-types';
import React from 'react';

import styles from './checkbox.css';

const CheckboxComponent = ({
    disabled,
    checked,
    onChange,
    children,
    ...props
}) => {
    return (
        <label
            className={styles.label}
            {...props}
        >
            <input
                className={styles.checkbox}
                type={'checkbox'}
                checked={checked}
                disabled={disabled}
                onChange={onChange}
            />
            {children}
        </label>
    );
};

CheckboxComponent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

export default CheckboxComponent;
