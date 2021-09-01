import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'clipcc-vm';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape, FormattedMessage } from 'react-intl';
import ClipCCExtension, { error } from 'clipcc-extension';

import extensionLibraryContent from '../lib/libraries/extensions/index.jsx';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';
import MessageBoxModal from '../components/message-box-modal/message-box-modal.jsx';

import uploadImageURL from '../lib/libraries/extensions/upload/upload.png';

import {
    initExtension,
    enableExtension,
    disableExtension
} from '../reducers/extension';
import {
    addLocales
} from '../reducers/locales';

import { loadExtensionFromFile } from '../lib/extension-manager.js';

global.ClipCCExtension = ClipCCExtension;

const messages = defineMessages({
    extensionTitle: {
        defaultMessage: 'Choose an Extension',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.chooseAnExtension'
    },
    extensionManagement: {
        defaultMessage: 'Extension Management',
        description: 'Heading for the extension library',
        id: 'gui.extensionLibrary.extensionManagement'
    },
    extensionUrl: {
        defaultMessage: 'Enter the URL of the extension',
        description: 'Prompt for unoffical extension url',
        id: 'gui.extensionLibrary.extensionUrl'
    },
    confirmTitle: {
        defaultMessage: 'Confirm to Add Extensions',
        description: 'Heading for the confirm modal',
        id: 'gui.extensionLibrary.confirmTitle'
    },
    confirmContent1: {
        defaultMessage: 'The following extensions will be added:',
        description: 'Content for the confirm modal',
        id: 'gui.extensionLibrary.confirmContent1'
    },
    confirmContent2: {
        defaultMessage: 'The following dependencies will be added:',
        description: 'Content for the confirm modal',
        id: 'gui.extensionLibrary.confirmContent2'
    },
    confirmContent3: {
        defaultMessage: 'The following extensions will be removed:',
        description: 'Content for the confirm modal',
        id: 'gui.extensionLibrary.confirmContent3'
    },
    confirmContent4: {
        defaultMessage: 'The following dependencies will be removed:',
        description: 'Content for the confirm modal',
        id: 'gui.extensionLibrary.confirmContent4'
    },
    errorUnavaliable: {
        defaultMessage: 'The following extensions are not found:',
        description: 'Content for the error modal',
        id: 'gui.extensionLibrary.errorUnavaliable'
    },
    errorCircular: {
        defaultMessage: 'Circular requirements.',
        description: 'Content for the error modal',
        id: 'gui.extensionLibrary.errorCircular'
    },
    requireStack: {
        defaultMessage: 'Require stack:',
        description: 'Label for require stack',
        id: 'gui.extensionLibrary.requireStack'
    }
});

class ExtensionLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'componentDidMount',
            'handleRequestClose',
            'handleUploadExtension',
            'handleItemChange',
            'handleMsgboxConfirm',
            'handleMsgboxCancel',
            'handleMsgboxGiveup'
        ]);
        this.willLoad = [];
        this.willUnload = [];
        this.willLoadDependency = [];
        this.willUnloadDependency = [];
        this.loadOrder = [];
        this.unloadOrder = [];
        this.showModal = 0;
        this.error = 0;
    }
    componentDidMount () {
        this.willLoad = [];
        this.willUnload = [];
        this.showModal = 0;
        this.error = 0;
    }
    handleRequestClose () {
        try {
            this.loadOrder = ClipCCExtension.extensionManager.getExtensionLoadOrder(this.willLoad);;
            this.unloadOrder = ClipCCExtension.extensionManager.getExtensionUnloadOrder(this.willUnload);
            this.willLoadDependency = this.loadOrder.filter(v => !this.willLoad.includes(v.id)).map(v => v.id);
            this.willUnloadDependency = this.unloadOrder.filter(v => !this.willUnload.includes(v));
            if (this.loadOrder.length || this.unloadOrder.length) {
                this.showModal = 1;
                this.forceUpdate();
            }
            else {
                this.props.onRequestClose();
            }
        }
        catch (err) {
            if (err.code === undefined) {
                throw err;
            }
            switch (err.code) {
            case error.ERROR_UNAVAILABLE_EXTENSION:
            case error.ERROR_CIRCULAR_REQUIREMENT: {
                console.error('error', err);
                this.error = err;
                this.showModal = 2;
                this.forceUpdate();
                break;
            }
            default: {
                throw err;
            }
            }
        }
    }
    handleItemChange (item, status) {
        const extension = item.extensionId;
        if (status) { // load
            const index = this.willUnload.indexOf(extension);
            if (index !== -1) {
                this.willUnload.splice(index, 1);
            }
            else {
                this.willLoad.push(extension);
            }
        }
        else { // unload
            const index = this.willLoad.indexOf(extension);
            if (index !== -1) {
                this.willLoad.splice(index, 1);
            }
            else {
                this.willUnload.push(extension);
            }
        }
    }
    handleUploadExtension () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.js,.ccx,.scx');
        input.setAttribute('multiple', true);
        input.onchange = event => {
            const files = event.target.files;
            for (const file of files) {
                const fileName = file.name;
                const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1);
                
                const url = URL.createObjectURL(file);
                const reader = new FileReader();
                reader.readAsArrayBuffer(file, 'utf8');
                reader.onload = async () => {
                    this.props.loadExtensionFromFile(reader.result, fileExt);
                };
            }
        };
        input.click();
    }
    handleMsgboxConfirm () {
        ClipCCExtension.extensionManager.loadExtensionsWithMode(this.loadOrder, extension => this.props.vm.extensionManager.loadExtensionURL(extension));
        for (const extension of this.loadOrder) {
            this.props.setExtensionEnable(extension.id);
        }
        ClipCCExtension.extensionManager.unloadExtensions(this.unloadOrder);
        for (const extension of this.unloadOrder) {
            this.props.setExtensionDisable(extension);
        }
        this.props.onRequestClose();
    }
    handleMsgboxCancel () {
        this.showModal = 0;
        this.forceUpdate();
    }
    handleMsgboxGiveup () {
        this.props.onRequestClose();
    }
    render () {
        const extensionLibraryThumbnailData = Object.values(this.props.extension).map(extension => ({
            ...extension,
            rawURL: extension.iconURL || extensionIcon,
            featured: true,
            switchable: true,
            name: (<FormattedMessage id={extension.name}/>),
            description: (<FormattedMessage id={extension.description}/>)
        }));
        return (
            <>
                <LibraryComponent
                    data={extensionLibraryThumbnailData}
                    id="extensionLibrary"
                    title={this.props.intl.formatMessage(messages.extensionManagement)}
                    visible={this.props.visible}
                    closeAfterSelect={false}
                    onItemSwitchChange={this.handleItemChange}
                    onRequestClose={this.handleRequestClose}
                    upload={true}
                    onUpload={this.handleUploadExtension}
                />
                {this.showModal === 1 ? (
                    <MessageBoxModal
                        intl={this.props.intl}
                        title={this.props.intl.formatMessage(messages.confirmTitle)}
                        mode="confirm_cancel_giveup"
                        onConfirm={this.handleMsgboxConfirm}
                        onGiveup={this.handleMsgboxGiveup}
                        onCancel={this.handleMsgboxCancel}
                    >
                        {this.willLoad.length ? (<>
                            <p style={{margin: 0}}>
                                {this.props.intl.formatMessage(messages.confirmContent1)}
                            </p>
                            <p style={{margin: 0, paddingLeft: '2em'}}>
                                {this.willLoad.join(' ')}
                            </p>
                        </>) : null}
                        {this.willLoadDependency.length ? (<>
                            <p style={{margin: 0}}>
                                {this.props.intl.formatMessage(messages.confirmContent2)}
                            </p>
                            <p style={{margin: 0, paddingLeft: '2em'}}>
                                {this.willLoadDependency.join(' ')}
                            </p>
                        </>) : null}
                        {this.willUnload.length ? (<>
                            <p style={{margin: 0}}>
                                {this.props.intl.formatMessage(messages.confirmContent3)}
                            </p>
                            <p style={{margin: 0, paddingLeft: '2em'}}>
                                {this.willUnload.join(' ')}
                            </p>
                        </>) : null}
                        {this.willUnloadDependency.length ? (<>
                            <p style={{margin: 0}}>
                                {this.props.intl.formatMessage(messages.confirmContent4)}
                            </p>
                            <p style={{margin: 0, paddingLeft: '2em'}}>
                                {this.willUnloadDependency.join(' ')}
                            </p>
                        </>) : null}
                    </MessageBoxModal>
                ) : null}
                {this.showModal === 2 ? (
                    <MessageBoxModal
                        intl={this.props.intl}
                        title={this.props.intl.formatMessage(messages.confirmTitle)}
                        mode="cancel_giveup"
                        onGiveup={this.handleMsgboxGiveup}
                        onCancel={this.handleMsgboxCancel}
                    >
                        {this.error.code === error.ERROR_UNAVAILABLE_EXTENSION ? (
                            <>
                                <p style={{margin: 0}}>
                                    {this.props.intl.formatMessage(messages.errorUnavaliable)}
                                </p>
                                {this.error.extension.map(v => (
                                    <p style={{margin: 0, paddingLeft: '2em'}}>
                                        {`${v.id}: ${v.version}`}
                                    </p>
                                ))}
                                <p style={{margin: 0}}>
                                    {this.props.intl.formatMessage(messages.requireStack)}
                                </p>
                                {this.error.requireStack.map(v => (
                                    <p style={{margin: 0, paddingLeft: '2em'}}>
                                        {`${v.id}: ${v.version}`}
                                    </p>
                                ))}
                            </>
                        ) : null}
                        {this.error.code === error.ERROR_CIRCULAR_REQUIREMENT ? (
                            <>
                                <p style={{margin: 0}}>
                                    {this.props.intl.formatMessage(messages.errorCircular)}
                                </p>
                                <p style={{margin: 0}}>
                                    {this.props.intl.formatMessage(messages.requireStack)}
                                </p>
                                {this.error.requireStack.map(v => (
                                    <p style={{margin: 0, paddingLeft: '2em'}}>
                                        {`${v.id}: ${v.version}`}
                                    </p>
                                ))}
                            </>
                        ) : null}
                    </MessageBoxModal>
                ) : null}
            </>
        );
    }
}

ExtensionLibrary.propTypes = {
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
    intl: intlShape.isRequired,
    onCategorySelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    visible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired // eslint-disable-line react/no-unused-prop-types
};

const mapStateToProps = state => ({
    extension: state.scratchGui.extension.extension
});

const mapDispatchToProps = dispatch => ({
    initExtension: data => dispatch(initExtension(data)),
    setExtensionEnable: id => dispatch(enableExtension(id)),
    setExtensionDisable: id => dispatch(disableExtension(id)),
    addLocales: msgs => dispatch(addLocales(msgs)),
    loadExtensionFromFile: (file, type) => loadExtensionFromFile(dispatch, file, type)
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ExtensionLibrary));
