import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import Modal from '../../containers/modal.jsx';
import Filter from '../filter/filter.jsx';
import Spinner from '../spinner/spinner.jsx';
import TagButton from '../../containers/tag-button.jsx';
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
    }
});

const ALL_TAG = {tag: 'all', intlLabel: messages.allTag};

class ExtensionLibraryComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClose',
            'handleFilterChange',
            'handleFilterClear',
            //'handleMouseEnter',
            'handleMouseLeave',
            'handlePlayingEnd',
            'handleChange',
            'handleTagClick',
            'setFilteredDataRef'
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
        if (this.props.setStopHandler) {
            this.props.setStopHandler(this.handlePlayingEnd);
        }
    }
    componentDidUpdate (prevProps, prevState) {
        if (prevState.filterQuery !== this.state.filterQuery ||
            prevState.selectedTag !== this.state.selectedTag
        ) {
            this.scrollToTop();
        }
    }
    handleSelect (id) {
        // this.handleClose();
        //this.props.onItemSelected(this.getFilteredData()[id]);
    }
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
        //TODO
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
            this.props.onItemMouseLeave(this.getFilteredData()[[this.state.playingItem]]);
            this.setState({
                filterQuery: event.target.value,
                playingItem: null,
                selectedTag: ALL_TAG.tag
            });
        }
    }
    handleFilterClear () {
        this.setState({filterQuery: ''});
    }
    getFilteredData () {
        if (this.state.selectedTag === 'all') {
            if (!this.state.filterQuery) return this.props.data;
            return this.props.data.filter(dataItem => (
                (dataItem.tags || [])
                    // Second argument to map sets `this`
                    .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase)
                    .concat(dataItem.name ?
                        (typeof dataItem.name === 'string' ?
                        // Use the name if it is a string, else use formatMessage to get the translated name
                            dataItem.name : this.props.intl.formatMessage(dataItem.name.props)
                        ).toLowerCase() :
                        null)
                    .join('\n') // unlikely to partially match newlines
                    .indexOf(this.state.filterQuery.toLowerCase()) !== -1
            ));
        }
        return this.props.data.filter(dataItem => (
            dataItem.tags &&
            dataItem.tags
                .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase)
                .indexOf(this.state.selectedTag) !== -1
        ));
    }
    scrollToTop () {
        this.filteredDataRef.scrollTop = 0;
    }
    setFilteredDataRef (ref) {
        this.filteredDataRef = ref;
    }
    render () {
        return (
            <Modal
                fullScreen
                contentLabel={this.props.title}
                id={this.props.id}
                onRequestClose={this.handleClose}
            >
                {(this.props.filterable /*|| this.props.tags*/) && (
                    <div/* className={styles.filterBar}*/>
                        {this.props.filterable && (
                            <Filter
                                filterQuery={this.state.filterQuery}
                                placeholderText={this.props.intl.formatMessage(messages.filterPlaceholder)}
                                onChange={this.handleFilterChange}
                                onClear={this.handleFilterClear}
                            />
                        )}
                    </div>
                )}
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
                            /*bluetoothRequired={dataItem.bluetoothRequired}*/
                            collaborator={dataItem.collaborator}
                            description={dataItem.description}
                            /*disabled={dataItem.disabled}*/
                            extensionId={dataItem.extensionId}
                            requirement={dataItem.requirement}
                            /*featured={dataItem.featured}*/
                            /*hidden={dataItem.hidden}*/
                            /*iconMd5={dataItem.md5}*/
                            /*iconRawURL={dataItem.rawURL}*/
                            /*icons={dataItem.json && dataItem.json.costumes}*/
                            index={index}
                            insetIconURL={dataItem.insetIconURL}
                            /*internetConnectionRequired={dataItem.internetConnectionRequired}*/
                            /*isPlaying={this.state.playingItem === index}*/
                            /*key={typeof dataItem.name === 'string' ? dataItem.name : dataItem.rawURL}*/
                            name={dataItem.name}
                            /*showPlayButton={this.props.showPlayButton}*/
                            /*onMouseEnter={this.handleMouseEnter}*/
                            /*onMouseLeave={this.handleMouseLeave}*/
                            enabled={dataItem.enabled}
                            onChange={this.handleChange}
                        />
                    ))) : (
                        <div>
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
    data: PropTypes.arrayOf(
        PropTypes.shape({
            md5: PropTypes.string,
            name: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.node
            ]),
            rawURL: PropTypes.string
        })
    ),
    filterable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    extension: PropTypes.object,
    onItemMouseEnter: PropTypes.func,
    onItemMouseLeave: PropTypes.func,
    onItemSelected : PropTypes.func,
    onRequestClose: PropTypes.func,
    onDisableExtension: PropTypes.func,
    onEnableExtension: PropTypes.func,
    setStopHandler: PropTypes.func,
    showPlayButton: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.shape(TagButton.propTypes)),
    title: PropTypes.string.isRequired
};

ExtensionLibraryComponent.defaultProps = {
    filterable: true
};

const mapStateToProps = state => ({
    extension: state.scratchGui.extension.extension
});

const mapDispatchToProps = dispatch => ({
    onEnableExtension: id => dispatch(enableExtension(id)),
    onDisableExtension: id => dispatch(disableExtension(id))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ExtensionLibraryComponent));
