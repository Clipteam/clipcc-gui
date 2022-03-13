import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';

import styles from './switch.css';

class Switch extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick'
        ]);
        this.state = {
            value: props.value
        };
    }

    handleClick () {
        if (this.props.disabled) {
            return;
        }
        this.props.onChange(!this.state.value);
        this.setState(state => ({
            value: !state.value
        }));
    }

    render () {
        return (
            <div
                className={classNames(
                    styles.switch,
                    this.state.value ? styles.true : styles.false,
                    this.props.disabled ? styles.disabled : null
                )}
                onClick={this.handleClick}
            >
                <div
                    className={classNames(
                        styles.slider,
                        this.state.value ? styles.true : styles.false,
                        this.props.disabled ? styles.disabled : null
                    )}
                />
            </div>
        );
    }
}

Switch.propTypes = {
    value: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

Switch.defaultProps = {
    value: false,
    disabled: false
};

export default Switch;
