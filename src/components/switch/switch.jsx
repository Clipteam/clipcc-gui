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
                    this.state.value ? styles.true : styles.false
                )}
                onClick={this.handleClick}
            >
                <div
                    className={classNames(
                        styles.slider,
                        this.state.value ? styles.true : styles.false
                    )}
                />
            </div>
        );
    }
}

Switch.propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

Switch.defaultProps = {
    value: false
};

export default Switch;
