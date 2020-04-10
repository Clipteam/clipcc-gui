import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';

import GUI from './gui.jsx';
import ConnectedLogin from '../components/menu-bar/connected-login.jsx'

import navigationActions from '../reducers/navigation';

class GUICommunity extends GUI {
    constructor (props) {
        super(props);
        bindAll(this, [
            'renderLogin'
        ]);
    }
    renderLogin ({onClose}) {
        return (
            <ConnectedLogin
                key="login-dropdown-presentation"
                /* eslint-disable react/jsx-no-bind */
                onLogin={(formData, callback) => {
                    this.props.handleLogin(formData, result => {
                        if (result.success === true) {
                            onClose();
                        }
                        callback(result);
                    });
                }}
                /* eslint-enable react/jsx-no-bind */
            />
        );
    }
    render () {
        if (this.props.isError) {
            throw new Error(
                `Error in Scratch GUI [location=${window.location}]: ${this.props.error}`);
        }
        const {
            /* eslint-disable no-unused-vars */
            assetHost,
            cloudHost,
            error,
            isError,
            isScratchDesktop,
            isShowingProject,
            onProjectLoaded,
            onStorageInit,
            onUpdateProjectId,
            onVmInit,
            projectHost,
            projectId,
            /* eslint-enable no-unused-vars */
            children,
            fetchingProject,
            isLoading,
            loadingStateVisible,
            renderLogin,
            ...componentProps
        } = this.props;
        if(typeof renderLogin === 'undefined') renderLogin = this.renderLogin;
        return (
            <GUIComponent
                loading={fetchingProject || isLoading || loadingStateVisible}
                renderLogin={renderLogin}
                {...componentProps}
            >
                {children}
            </GUIComponent>
        );
    }
}

GUICommunity.propTypes = {
    ...GUI.propTypes,
    handleLogin: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
    handleLogin: (formData, callback) => {
        dispatch(navigationActions.handleLogin(formData, callback));
    }
})

export default injectIntl(GUICommunity);
