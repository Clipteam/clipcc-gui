import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Login from './login.jsx';

class ConnectedLogin extends React.Component {
    constructor (props) {
        super(props);
    }
    render () {
        return (
            <Login
                error={this.props.error}
                key="login-dropdown-presentation"
                onLogin={this.props.onLogin}
            />
        );
    }
}

ConnectedLogin.propTypes = {
    error: PropTypes.string,
    onLogin: PropTypes.func
};

const mapStateToProps = state => ({
    error: state.navigation && state.navigation.loginError
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedLogin);
