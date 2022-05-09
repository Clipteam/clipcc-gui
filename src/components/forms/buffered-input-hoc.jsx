import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import {round10} from '../../lib/math';

/**
 * Higher Order Component to manage inputs that submit on blur and <enter>
 * @param {React.Component} Input text input that consumes onChange, onBlur, onKeyPress
 * @returns {React.Component} Buffered input that calls onSubmit on blur and <enter>
 */
export default function (Input) {
    class BufferedInput extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'handleChange',
                'handleKeyPress',
                'handleFlush'
            ]);
            this.state = {
                value: null
            };
            this.componentType = props.type === 'number' ? 'text' : props.type;
        }
        handleKeyPress (e) {
            if (e.key === 'Enter') {
                e.target.blur();
            }
        }
        handleFlush () {
            const isNumeric = typeof this.props.value === 'number';
            const validatesNumeric = isNumeric ? !isNaN(this.state.value) : true;
            if (this.state.value !== null && validatesNumeric) {
                let value = this.state.value;
                if (isNumeric) {
                    value = Number(value);
                    if (typeof this.props.max !== 'undefined') value = Math.min(value, this.props.max);
                    if (typeof this.props.min !== 'undefined') value = Math.max(value, this.props.min);
                    if (typeof this.props.precision !== 'undefined') value = round10(value, this.props.precision);
                    // console.log('before submit 0', value);
                }
                // console.log('before submit', value);
                this.props.onSubmit(value);
            }
            this.setState({value: null});
        }
        handleChange (e) {
            this.setState({value: e.target.value});
        }
        render () {
            const {
                // eslint-disable-next-line no-unused-vars
                type, value, max, min, precision, onSubmit,
                ...componentProps
            } = this.props;
            const bufferedValue = this.state.value === null ? value : this.state.value;
            return (
                <Input
                    {...componentProps}
                    type={this.componentType}
                    value={bufferedValue}
                    onBlur={this.handleFlush}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                />
            );
        }
    }

    BufferedInput.propTypes = {
        onSubmit: PropTypes.func.isRequired,
        type: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        max: PropTypes.number,
        min: PropTypes.number,
        precision: PropTypes.number
    };

    return BufferedInput;
}
