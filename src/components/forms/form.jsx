import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

class Form extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChange'
        ]);
        this.state = {
            allValues: {}
        };
    }
    handleChange (currentValues, isChanged) {
        this.setState({allValues: omit(currentValues, 'all')});
        this.props.onChange(currentValues, isChanged);
    }
    render () {
        return (
            <form
                className={classNames('form', this.props.classNname)}
                ref={form => {
                    this.formsy = form;
                }}
                onChange={this.handleChange}
                {...this.props}
            >
                {React.Children.map(this.props.children, child => {
                    if (!child) return null;
                    if (child.props.name === 'all') {
                        return React.cloneElement(child, {value: this.state.allValues});
                    }
                    return child;
                })}
            </form>
        );
    }
}

Form.propTypes = {
    children: PropTypes.node,
    classNname: PropTypes.string,
    onChange: PropTypes.func
};

Form.defaultProps = {
    noValidate: true,
    onChange: function () {}
};

export default Form;
