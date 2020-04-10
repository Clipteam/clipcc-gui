import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';

import Form from '../forms/form.jsx';
import InputBox from '../forms/input-box.jsx';
import Button from '../forms/button.jsx';
import Spinner from '../spinner/spinner.jsx';
import FlexRow from '../flex-row/flex-row.jsx';

import styles from './login.css';

class Login extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleSubmit'
        ]);
        this.state = {
            waiting: false
        };
    }
    handleSubmit (formData) {
        this.setState({waiting: true});
        this.props.onLogin(formData, () => {
            this.setState({waiting: false});
        });
    }
    render () {
        let error;
        if (this.props.error) {
            error = <div className="error">{this.props.error}</div>;
        }
        return (
            <div className={styles.login}>
                <Form onSubmit={this.handleSubmit}>
                    <label
                        htmlFor="username"
                        key="usernameLabel"
                    >
                        <FormattedMessage id="general.username" />
                    </label>
                    <InputBox
                        className={styles.loginInputBox}
                        required
                        key="usernameInput"
                        maxLength="30"
                        name="username"
                        type="text"
                    />
                    <label
                        htmlFor="password"
                        key="passwordLabel"
                    >
                        <FormattedMessage id="general.password" />
                    </label>
                    <InputBox
                        className={styles.loginInputBox}
                        required
                        key="passwordInput"
                        name="password"
                        type="password"
                    />
                    <FlexRow className={styles.loginSubmitRow}>
                        {this.state.waiting ? [
                            <Button
                                className={classNames(styles.loginSubmitButton, styles.white)}
                                disabled="disabled"
                                key="submitButton"
                                type="submit"
                            >
                                <Spinner
                                    className={styles.loginPpinner}
                                    color="blue"
                                />
                            </Button>
                        ] : [
                            <Button
                                className={classNames(styles.loginSubmitButton, styles.white)}
                                key="submitButton"
                                type="submit"
                            >
                                <FormattedMessage id="general.signIn" />
                            </Button>
                        ]}
                        <a
                            href="/accounts/password_reset/"
                            key="passwordRestLink"
                        >
                            <FormattedMessage id="login.needHelp" />
                        </a>
                    </FlexRow>
                    {error}
                </Form>
            </div>
        );
    }
}

Login.propTypes = {
    error: PropTypes.string,
    onLogin: PropTypes.func
};

export default Login;
