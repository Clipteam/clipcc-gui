import PropTypes from 'prop-types';
import React from 'react';
import styles from './switch.css';
import classNames from 'classnames';

class Switch extends React.Component {
    constructor (props) {
        super(props);
        this.state = {checked: props.default};
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick () {
        this.setState((state, props) => {
            props.onChanged(!state.checked);
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
    onChanged: PropTypes.func.isRequired
};

Switch.defaultProps = {
    default: false,
    onChanged: () => {}
};

export default Switch;
