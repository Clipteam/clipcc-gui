import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';
import VM from 'clipcc-vm';
import bindAll from 'lodash.bindall';
import {injectIntl, intlShape} from 'react-intl';

import SettingsComponent from '../components/settings-modal/settings-modal.jsx';

class Settings extends React.Component {
	constructor (props) {
        super(props);
        bindAll(this, [
            'setFramerate',
            'setCompression'
        ]);
    }
    
	setFramerate (framerate) {
		this.props.vm.runtime.setFramerate(framerate);
		console.log(this.props.vm.runtime); //DEBUG
	}
	
	setCompression (level) {
		//todo
	}
	
    render () {
        return (
            <SettingsComponent
                {...this.props}
                setFramerate={this.setFramerate}
                setCompression={this.setCompression}
            >
                {this.props.children}
            </SettingsComponent>
        );
    }
}

Settings.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    children: PropTypes.node
};

const mapStateToProps = state => {
    return {
        vm: state.scratchGui.vm
    };
};

const SettingHandler = injectIntl(connect(
    mapStateToProps
)(Settings));


export default SettingHandler;
