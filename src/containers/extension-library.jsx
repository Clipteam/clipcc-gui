/* eslint-disable no-alert */
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'clipcc-vm';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, FormattedMessage} from 'react-intl';
import ClipCCExtension, {error} from 'clipcc-extension';
import log from '../lib/log';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';
import MessageBoxModal from '../components/message-box-modal/message-box-modal.jsx';

import {
    initExtension,
    enableExtension,
    disableExtension
} from '../reducers/extension';
import {
    addLocales
} from '../reducers/locales';

import {loadExtensionFromFile} from '../lib/extension-manager.js';
import {isScratchDesktop} from '../lib/isScratchDesktop';

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
    },
    unsupportChannel: {
        defaultMessage: 'BroadcastChannel is not supported, So yo cannot use extension store anyway.',
        description: 'Label for broadcast channel not supported',
        id: 'gui.extensionLibrary.unsupportChannel'
    }
});

class ExtensionLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'componentDidMount',
            'handleRequestClose',
            'handleUploadExtension',
            'handleClickExtensionStore',
            'handleItemChange',
            'handleExtensionMessage',
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
        this.extensionChannel = global.BroadcastChannel ? new BroadcastChannel('extension') : null;
    }
    componentDidMount () {
        this.willLoad = [];
        this.willUnload = [];
        this.showModal = 0;
        this.error = 0;
        if (this.extensionChannel) this.extensionChannel.addEventListener('message', this.handleExtensionMessage);
    }
    componentWillUnmount () {
        if (this.extensionChannel) this.extensionChannel.removeEventListener('message', this.handleExtensionMessage);
    }
    handleRequestClose () {
        try {
            this.loadOrder = ClipCCExtension.extensionManager.getExtensionLoadOrder(this.willLoad);
            this.unloadOrder = ClipCCExtension.extensionManager.getExtensionUnloadOrder(this.willUnload);
            this.willLoadDependency = this.loadOrder.filter(v => !this.willLoad.includes(v.id)).map(v => v.id);
            this.willUnloadDependency = this.unloadOrder.filter(v => !this.willUnload.includes(v));
            if (this.loadOrder.length || this.unloadOrder.length) {
                this.showModal = 1;
                this.forceUpdate();
            } else {
                this.props.onRequestClose();
            }
        } catch (err) {
            if (!err.code) {
                throw err;
            }
            switch (err.code) {
            case error.ERROR_UNAVAILABLE_EXTENSION:
            case error.ERROR_CIRCULAR_REQUIREMENT: {
                log.error('error', err);
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
        /* eslint-disable no-negated-condition */
        if (status) { // load
            const index = this.willUnload.indexOf(extension);
            if (index !== -1) {
                this.willUnload.splice(index, 1);
            } else {
                this.willLoad.push(extension);
            }
        } else { // unload
            const index = this.willLoad.indexOf(extension);
            if (index !== -1) {
                this.willLoad.splice(index, 1);
            } else {
                this.willUnload.push(extension);
            }
        }
        /* eslint-enable no-negated-condition */
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
                reader.onload = () => {
                    this.props.loadExtensionFromFile(reader.result, fileExt);
                };
            }
        };
        input.click();
    }
    handleExtensionMessage (event) {
        if (event.data.action === 'add'){
            fetch(event.data.download)
                .then(async response => {
                    await this.props.loadExtensionFromFile(response.arrayBuffer(), 'ccx');
                    this.extensionChannel.postMessage({
                        action: 'addSuccess',
                        extensionId: event.data.extension
                    });
                })
                .catch(err => {
                    this.extensionChannel.postMessage({
                        action: 'addFail',
                        extensionId: event.data.extension,
                        error: err
                    });
                });
        }
        
        // 更新逻辑待完善，暂时与 add 保持一致
        if (event.data.action === 'upd'){
            fetch(event.data.download)
                .then(async response => {
                    await this.props.loadExtensionFromFile(response.arrayBuffer(), 'ccx');
                    this.extensionChannel.postMessage({
                        action: 'addSuccess',
                        extensionId: event.data.extension
                    });
                })
                .catch(err => {
                    this.extensionChannel.postMessage({
                        action: 'addFail',
                        extensionId: event.data.extension,
                        error: err
                    });
                });
        }

        if (event.data.action === 'get') {
            const extensionList = [];
            for (const ext in this.props.extension) {
                const { version = '1.0.0' } = this.props.extension[ext];
                extensionList.push(`${ext}@${version}`);
            };
            log.info(extensionList);
            this.extensionChannel.postMessage({
                action: 'tell',
                data: extensionList
            });
        }
    }
    handleClickExtensionStore () {
        /*
        if (isScratchDesktop()) {
            return window.ClipCC.ipc.send('open-extension-store');
        }
        */
        if (!this.extensionChannel) {
            alert(this.props.intl.formatMessage(messages.unsupportChannel));
            return;
        }
        window.open(`/extension`, 'extension',
            `width=800,
            height=510
            resizable=yes,
            scrollbars=yes,
            status=yes`);
    }
    handleMsgboxConfirm () {
        ClipCCExtension.extensionManager.loadExtensionsWithMode(
            this.loadOrder,
            extension => this.props.vm.extensionManager.loadExtensionURL(extension)
        );
        for (const extension of this.loadOrder) {
            this.props.setExtensionEnable(extension.id);
        }
        ClipCCExtension.extensionManager.unloadExtensions(
            this.unloadOrder,
            extension => this.props.vm.extensionManager.unloadExtensionURL(extension)
        );
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
        const extensionLibraryThumbnailData = Object.values(this.props.extension)
            .map(extension => ({
                ...extension,
                rawURL: extension.iconURL || extensionIcon,
                featured: true,
                switchable: true,
                name: this.props.intl.formatMessage({id: extension.name}),
                description: this.props.intl.formatMessage({id: extension.description})
            }))
            .sort((a, b) => {
                if (a.enabled === b.enabled) {
                    if (a.name === b.name) return 0;
                    return a.name < b.name ? -1 : 1;
                }
                return a.enabled ? -1 : 1;
            });
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
                    upload
                    extensionStore
                    onUpload={this.handleUploadExtension}
                    onClickExtensionStore={this.handleClickExtensionStore}
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
                            {this.willLoad.map(v => (
                                <p
                                    style={{margin: 0, paddingLeft: '2em'}}
                                    key={v}
                                >
                                    {`${v}`}
                                </p>
                            ))}
                        </>) : null}
                        {this.willLoadDependency.length ? (<>
                            <p style={{margin: 0}}>
                                {this.props.intl.formatMessage(messages.confirmContent2)}
                            </p>
                            {this.willLoadDependency.map(v => (
                                <p
                                    style={{margin: 0, paddingLeft: '2em'}}
                                    key={v}
                                >
                                    {`${v}`}
                                </p>
                            ))}
                        </>) : null}
                        {this.willUnload.length ? (<>
                            <p style={{margin: 0}}>
                                {this.props.intl.formatMessage(messages.confirmContent3)}
                            </p>
                            {this.willUnload.map(v => (
                                <p
                                    style={{margin: 0, paddingLeft: '2em'}}
                                    key={v}
                                >
                                    {`${v}`}
                                </p>
                            ))}
                        </>) : null}
                        {this.willUnloadDependency.length ? (<>
                            <p style={{margin: 0}}>
                                {this.props.intl.formatMessage(messages.confirmContent4)}
                            </p>
                            {this.willUnloadDependency.map(v => (
                                <p
                                    style={{margin: 0, paddingLeft: '2em'}}
                                    key={v}
                                >
                                    {`${v}`}
                                </p>
                            ))}
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
                                    <p
                                        style={{margin: 0, paddingLeft: '2em'}}
                                        key={v.id}
                                    >
                                        {`${v.id}: ${v.version}`}
                                    </p>
                                ))}
                                <p style={{margin: 0}}>
                                    {this.props.intl.formatMessage(messages.requireStack)}
                                </p>
                                {this.error.requireStack.map(v => (
                                    <p
                                        style={{margin: 0, paddingLeft: '2em'}}
                                        key={v.id}
                                    >
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
                                    <p
                                        style={{margin: 0, paddingLeft: '2em'}}
                                        key={v.id}
                                    >
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
    loadExtensionFromFile: PropTypes.func.isRequired,
    setExtensionEnable: PropTypes.func.isRequired,
    setExtensionDisable: PropTypes.func.isRequired,
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
