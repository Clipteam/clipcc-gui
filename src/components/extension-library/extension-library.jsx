import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import Modal from '../../containers/modal.jsx';
import Spinner from '../spinner/spinner.jsx';
import ExtensionItemComponent from './extension-item.jsx';

import {
    enableExtension,
    disableExtension
} from '../../reducers/extension';

import styles from './extension-library.css';

const messages = defineMessages({
    filterPlaceholder: {
        id: 'gui.extensionlibrary.filterPlaceholder',
        defaultMessage: 'Search',
        description: 'Placeholder text for extension library search field'
    },
    allTag: {
        id: 'gui.extensionlibrary.allTag',
        defaultMessage: 'All',
        description: 'Label for extension library tag to revert to all items after filtering by tag.'
    },

});

const ALL_TAG = {tag: 'all', intlLabel: messages.allTag};

class ExtensionLibraryComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClose',
            'handleChange'
        ]);
        this.state = {
            playingItem: null,
            filterQuery: '',
            selectedTag: ALL_TAG.tag,
            loaded: false
        };
    }
    componentDidMount () {
        setTimeout(() => {
            this.setState({loaded: true});
        });
    }
    /*
    componentDidUpdate (prevProps, prevState) {
    }
    */
    handleChange (extensionId, status) {
        if (status) {
            this.props.setExtensionEnable(extensionId);
            this.props.onEnableExtension(extensionId);
        } else {
            this.props.setExtensionDisable(extensionId);
            this.props.onDisableExtension(extensionId);
        }
    }
    handleClose () {
        this.props.onRequestClose();
    }
    render () {
        return (
            <Modal
                fullScreen
                contentLabel={this.props.title}
                id={this.props.id}
                onRequestClose={this.handleClose}
            >
                <div
                    className={styles.extensionTable}
                    ref={this.setFilteredDataRef}
                >
                    <div className={styles.extensionTitle}>
                        <span className={styles.extensionTitleIndex}>No</span>
                        <span>Name</span>
                        <span>Description</span>
                        <span>ID</span>
                        <span className={styles.extensionTitleRequirement}>Requirement</span>
                        <span className={styles.extensionTitleEnable}>Enable</span>
                    </div>
                    {this.state.loaded ? (Object.values(this.props.extension).map((dataItem, index) => (
                        <ExtensionItemComponent
                            key={index}
                            author={dataItem.author}
                            description={dataItem.description}
                            extensionId={dataItem.extensionId}
                            requirement={dataItem.requirement}
                            index={index}
                            insetIconURL={dataItem.insetIconURL}
                            name={dataItem.name}
                            enabled={dataItem.enabled}
                            onChange={this.handleChange}
                        />
                    ))) : (
                        <div classNname={styles.spinnerWrapper}>
                            <Spinner
                                large
                                level="primary"
                            />
                        </div>
                    )}
                </div>
            </Modal>
        );
    }
}

ExtensionLibraryComponent.propTypes = {
    id: PropTypes.string.isRequired,
    extension: PropTypes.shape({
        extensionId: PropTypes.string,
        iconURL: PropTypes.string,
        insetIconURL: PropTypes.string,
        author: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),
        name: PropTypes.string,
        description: PropTypes.string,
        requirement: PropTypes.arrayOf(PropTypes.string)
    }),
    onRequestClose: PropTypes.func,
    onDisableExtension: PropTypes.func,
    onEnableExtension: PropTypes.func,
    setExtensionEnable: PropTypes.func,
    setExtensionDisable: PropTypes.func,
    title: PropTypes.string.isRequired
};

ExtensionLibraryComponent.defaultProps = {
    filterable: true
};

const mapStateToProps = state => ({
    extension: state.scratchGui.extension.extension
});

const mapDispatchToProps = dispatch => ({
    setExtensionEnable: id => dispatch(enableExtension(id)),
    setExtensionDisable: id => dispatch(disableExtension(id))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ExtensionLibraryComponent));
