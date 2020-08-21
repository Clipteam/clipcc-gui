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
        if (status) this.props.onEnableExtension(extensionId);
        else this.props.onDisableExtension(extensionId);
    }
    handleClose () {
        this.props.onRequestClose();
    }
    handleTagClick (tag) {
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: '',
                selectedTag: tag.toLowerCase()
            });
        }
        // TODO
    }
    handleMouseLeave (id) {
        if (this.props.onItemMouseLeave) {
            this.props.onItemMouseLeave(this.getFilteredData()[id]);
            this.setState({
                playingItem: null
            });
        }
    }
    handlePlayingEnd () {
        if (this.state.playingItem !== null) {
            this.setState({
                playingItem: null
            });
        }
    }
    handleFilterChange (event) {
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: event.target.value,
                selectedTag: ALL_TAG.tag
            });
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
                    className={classNames({
                        [styles.extensionContainer]: true,
                        [styles.loading]: !this.state.loaded
                    })}
                >
                    {this.state.loaded ? (
                        <table
                            className={styles.extensionTable}
                            ref={this.setFilteredDataRef}
                        >
                            <thead>
                                <th>Name</th>
                                <th>Description</th>
                                <th>ID</th>
                                <th>Requirement</th>
                                <th>Enable</th>
                            </thead>
                            <tbody>
                                {Object.values(this.props.data).map(dataItem => (
                                    <ExtensionItemComponent
                                        bluetoothRequired={dataItem.bluetoothRequired}
                                        insetIconURL={dataItem.insetIconURL}
                                        collaborator={dataItem.collaborator}
                                        description={dataItem.description}
                                        /* disabled={dataItem.disabled}*/
                                        extensionId={dataItem.extensionId}
                                        requirement={dataItem.requirement}
                                        /* featured={dataItem.featured}*/
                                        /* hidden={dataItem.hidden}*/
                                        /* iconMd5={dataItem.md5}*/
                                        /* iconRawURL={dataItem.rawURL}*/
                                        /* icons={dataItem.json && dataItem.json.costumes}*/
                                        internetConnectionRequired={dataItem.internetConnectionRequired}
                                        /* isPlaying={this.state.playingItem === index}*/
                                        key={typeof dataItem.name === 'string' ? dataItem.name : dataItem.rawURL}
                                        name={dataItem.name}
                                        /* showPlayButton={this.props.showPlayButton}*/
                                        /* onMouseEnter={this.handleMouseEnter}*/
                                        /* onMouseLeave={this.handleMouseLeave}*/
                                        enabled={dataItem.enabled}
                                        onChange={this.handleChange}
                                    />
                                ))}
                            </tbody>
                        </table>) : (<Spinner
                            large
                            level="primary"
                        />)}
                                    
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
