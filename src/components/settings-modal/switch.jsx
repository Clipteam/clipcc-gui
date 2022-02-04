import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './switch.css';
import classNames from 'classnames';

class Switch extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick'
        ]);
        this.state = {checked: props.default};
    }
    handleClick () {
        this.setState((state, props) => {
            props.onChange(!state.checked);
            return {
                checked: !state.checked
            };
        });
    }
    render () {
        return (<div
            className={classNames(
                styles.switch,
                this.state.checked ? styles.true : styles.false
            )}
            onClick={this.handleClick}
        >
            <div
                className={classNames(
                    styles.slider,
                    this.state.checked ? styles.true : styles.false
                )}
            />
        </div>);
    }
}

Switch.propTypes = {
    default: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

Switch.defaultProps = {
    default: false,
    onChange: (/* state */) => {}
};

export default Switch;
