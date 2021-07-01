import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'clipcc-vm';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape, FormattedMessage } from 'react-intl';
import JSZip from 'jszip';
import mime from 'mime-types';
import vm from 'vm';
import ClipCCExtension from 'clipcc-extension';

import extensionLibraryContent from '../lib/libraries/extensions/index.jsx';

import LibraryComponent from '../components/library/library.jsx';
import extensionIcon from '../components/action-menu/icon--sprite.svg';

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
    }
});

class ExtensionLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleUploadExtension',
            'handleItemChange'
        ]);
    }
    handleItemChange (item, status) {
        const extensionId = item.extensionId;
        if (status) {
            if (this.props.extension[extensionId].extensionAPI) {
                if (this.props.extension[extensionId].instance.init) {
                    this.props.extension[extensionId].instance.init();
                }
            }
            else {
                if (!this.props.vm.extensionManager.isExtensionLoaded(extensionId)) {
                    this.props.vm.extensionManager.loadExtensionURL(extensionId);
                }
            }
            this.props.setExtensionEnable(extensionId);
            this.props.vm.registerExtension(extensionId);
        } else {
            if (this.props.extension[extensionId].extensionAPI) {
                if (this.props.extension[extensionId].instance.uninit) {
                    this.props.extension[extensionId].instance.uninit();
                }
            }
            else {
            }
            this.props.setExtensionDisable(extensionId);
            this.props.vm.unregisterExtension(extensionId);
        }
    }
    handleUploadExtension () {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.js,.ccx,.scx');
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
            <LibraryComponent
                data={extensionLibraryThumbnailData}
                id="extensionLibrary"
                title={this.props.intl.formatMessage(messages.extensionManagement)}
                visible={this.props.visible}
                closeAfterSelect={false}
                onItemSwitchChange={this.handleItemChange}
                onRequestClose={this.props.onRequestClose}
                upload={true}
                onUpload={this.handleUploadExtension}
            />
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
