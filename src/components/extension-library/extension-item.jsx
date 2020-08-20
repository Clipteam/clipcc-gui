import {FormattedMessage} from 'react-intl';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Switch from '../settings-modal/switch.jsx';

import styles from './extension-item.css';

import bluetoothIconURL from '../library-item/bluetooth.svg';
import internetConnectionIconURL from '../library-item/internet-connection.svg';

class ExtensionItemComponent extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChange'
        ]);
    }
    handleChange (status) {
        this.props.onChange(this.props.extensionId, status);
    }
    render () {
        return (
            <Box
                className={classNames(styles.extensionItem)}
            >
                <span className={styles.extensionItemIndex}>{this.props.index}</span>
                <FormattedMessage id={this.props.name} />
                <FormattedMessage id={this.props.description} />
                <span>{this.props.extensionId}</span>
                <div className={styles.extensionItemRequirement}>
                    {this.props.requirement && this.props.requirement.includes('bluetooth') ? (
                        <img src={bluetoothIconURL} />
                    ) : null}
                    {this.props.requirement && this.props.requirement.includes('internet') ? (
                        <img src={internetConnectionIconURL} />
                    ) : null}
                </div>
                <div className={styles.extensionItemEnable}>
                    <Switch
                        onChanged={this.handleChange}
                        default={this.props.enabled}
                    />
                </div>
            </Box>
        );
    }
}

ExtensionItemComponent.propTypes = {
    requirement: PropTypes.array,
    collaborator: PropTypes.string,
    description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    disabled: PropTypes.bool,
    enabled: PropTypes.bool,
    extensionId: PropTypes.string,
    featured: PropTypes.bool,
    hidden: PropTypes.bool,
    iconURL: PropTypes.string,
    index: PropTypes.number,
    insetIconURL: PropTypes.string,
    isPlaying: PropTypes.bool,
    name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    onBlur: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    showPlayButton: PropTypes.bool
};

ExtensionItemComponent.defaultProps = {
    disabled: false,
    showPlayButton: false
};

ExtensionItemComponent.defaultProps = {
    disabled: false,
    showPlayButton: false
};

export default ExtensionItemComponent;
