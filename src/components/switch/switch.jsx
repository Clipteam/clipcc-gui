import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';

import styles from './switch.css';

class Switch extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleKeyDown'
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
        this.setState({value: !this.state.value});
    }

    handleKeyDown (event) {
        if (event.key === 'Enter') {
            this.props.onChange(!this.state.value);
            this.setState({value: !this.state.value});
            event.stopPropagation();
        }
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
                onKeyDown={this.handleKeyDown}
            >
                <div
                    className={classNames(
                        styles.slider,
                        this.state.value ? styles.true : styles.false,
                        this.props.disabled ? styles.disabled : null
                    )}
                />
                <input
                    className={styles.dummyInput}
                    inputMode="none"
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
