import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './text-switch.css';

const TextSwitch = props => (
    <div className={classNames(styles.textSwitch)}>
        {props.options.map(option => (
            <span
                key={option.id}
                className={classNames(
                    styles.option,
                    styles.switch,
                    props.value === option.id ? styles.active : null
                )}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => props.onChange(option.id)}
            >
                {option.text}
            </span>
        ))}
    </div>
);

TextSwitch.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        text: PropTypes.string
    })).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired
};

export default TextSwitch;
