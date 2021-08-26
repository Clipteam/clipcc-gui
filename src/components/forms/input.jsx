import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import styles from './input.css';

import { getSetting } from '../../reducers/settings';

const ReactInput = props => {
    const {small, ...componentProps} = props;
    return (
        <input
            {...componentProps}
            className={classNames(
                styles.inputForm,
                props.className,
                {
                    [styles.inputSmall]: small,
                    [styles.darkInputForm]: props.darkMode === 'dark'
                }
            )}
        />
    );
};

ReactInput.propTypes = {
    className: PropTypes.string,
    small: PropTypes.bool,
    darkMode: PropTypes.string
};

ReactInput.defaultProps = {
    small: false,
    darkMode: 'light'
};

const mapStateToProps = state => ({
    darkMode: getSetting(state, 'darkMode')
});

const Input = connect(
    mapStateToProps
)(ReactInput);

export default Input;
