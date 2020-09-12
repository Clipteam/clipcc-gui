import vm from 'vm';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import extension from 'clipcc-extension';

import Modal from '../../containers/modal.jsx';
import Spinner from '../spinner/spinner.jsx';
import ExtensionItemComponent from './extension-item.jsx';

import {
    initExtension,
    enableExtension,
    disableExtension
} from '../../reducers/extension';

import {extensionAPI} from '../../lib/extension-manager';

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
            'handleChange',
            'handleUploadExtension'
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
            if (this.props.extension[extensionId].extensionAPI) {
                if (this.props.extension[extensionId].instance) {
                    console.log(this.props.extension[extensionId].instance);
                    this.props.extension[extensionId].instance.init();
                    return;
                }
                console.log(extensionAPI);
                const instance = new extension.SampleExtension(extensionAPI);
                instance.init();
            }
            this.props.setExtensionEnable(extensionId);
            this.props.onEnableExtension(extensionId);
        } else {
            this.props.setExtensionDisable(extensionId);
            this.props.onDisableExtension(extensionId);
        }
    }
    handleUploadExtension () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.js,.ccx');
        input.onchange = event => {
            const files = event.target.files;
            for (const file of files) {
                const fileName = file.name;
                const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1);
                let extensionInfo = {};
                switch (fileExt) {
                case 'ccx': {
                    console.log('Unsupported ccx');
                    break;
                }
                case 'js': {
                    const url = URL.createObjectURL(file);
                    const reader = new FileReader();
                    reader.readAsText(file, 'utf8');
                    reader.onload = () => {
                        const Extension = vm.runInThisContext(reader.result);
                        const instance = new Extension();
                        const info = instance.getInfo();
                        const apiInstance = new extension.CompatibleExtension(instance, extensionAPI);
                        extensionInfo = {
                            extensionId: info.id,
                            iconURL: info.blockIconURL,
                            insetIconURL: info.blockIconURL,
                            author: 'External Extension',
                            name: info.name,
                            description: 'External Extension',
                            requirement: [],
                            instance: apiInstance,
                            extensionAPI: true
                        };
                        this.props.initExtension(extensionInfo);
                    };
                    break;
                }
                default: {
                    console.error('Unkown extension type');
                }
                }
            }
        };
        input.click();
    }
    handleClose () {
        this.props.onRequestClose();
    }
    render () {
        /* eslint-disable react/jsx-no-literals */
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
                    <p onClick={this.handleUploadExtension}>Upload Extension</p>
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
                                {Object.values(this.props.extension).map(dataItem => (
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
                        </table>
                    ) : (
                        <Spinner
                            large
                            level="primary"
                        />
                    )}
                </div>
            </Modal>
        );
        /* eslint-enable react/jsx-no-literals */
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
    initExtension: PropTypes.func,
    title: PropTypes.string.isRequired
};

ExtensionLibraryComponent.defaultProps = {
    filterable: true
};

const mapStateToProps = state => ({
    extension: state.scratchGui.extension.extension
});

const mapDispatchToProps = dispatch => ({
    initExtension: data => dispatch(initExtension(data)),
    setExtensionEnable: id => dispatch(enableExtension(id)),
    setExtensionDisable: id => dispatch(disableExtension(id))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ExtensionLibraryComponent));
