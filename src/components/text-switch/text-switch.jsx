import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './text-switch.css';

const TextSwitch = props => (
    <div className={classNames(styles.textSwitch)}>
        {props.items.map(item => (
            <span
                key={item.id}
                className={classNames(
                    styles.item,
                    styles.switch,
                    props.value === item.id ? styles.active : null
                )}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => props.onChange(item.id)}
            >
                {item.text}
            </span>
        ))}
    </div>
);

TextSwitch.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        text: PropTypes.string
    })).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired
};

export default TextSwitch;
