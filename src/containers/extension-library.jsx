import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'clipcc-vm';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape, FormattedMessage} from 'react-intl';
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
            'handleItemSelect',
            'handleUploadExtension',
            'handleItemChange'
        ]);
    }
    handleItemSelect (item) {
        if ('upload' in item) {
            this.handleUploadExtension();
        }
        /* else {
            const id = item.extensionId;
            let url = item.extensionURL ? item.extensionURL : id;
            if (!item.disabled && !id) {
                // eslint-disable-next-line no-alert
                url = prompt(this.props.intl.formatMessage(messages.extensionUrl));
            }
            if (id && !item.disabled) {
                if (this.props.vm.extensionManager.isExtensionLoaded(url)) {
                    this.props.onCategorySelected(id);
                } else {
                    this.props.vm.extensionManager.loadExtensionURL(url).then(() => {
                        this.props.onCategorySelected(id);
                    });
                }
            }
        }*/
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
                let extensionInfo = {};
                switch (fileExt) {
                case 'ccx': {
                    console.log('Experimental CCX file support.');
                    const url = URL.createObjectURL(file);
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file, 'utf8');
                    reader.onload = async () => {
                        const zipData = await JSZip.loadAsync(reader.result);
                        let info = {};
                        let instance = null;

                        // Load info
                        if ('info.json' in zipData.files) {
                            const content = await zipData.files['info.json'].async('text');
                            info = JSON.parse(content);
                            console.log(info);
                            console.log(zipData);
                            if (info.icon) {
                                info.icon = URL.createObjectURL(new Blob(
                                    [await zipData.files[info.icon].async('arraybuffer')],
                                    {type: mime.lookup(info.icon)}
                                ));
                            }
                            if (info.inset_icon) {
                                info.inset_icon = URL.createObjectURL(new Blob(
                                    [await zipData.files[info.inset_icon].async('blob')],
                                    {type: mime.lookup(info.inset_icon)}
                                ));
                            }
                        } else {
                            console.error('Cannot find \'info.json\' in ' + fileName);
                        }

                        // Load extension class
                        if ('main.js' in zipData.files) {
                            const script = new vm.Script(await zipData.files['main.js'].async('text'));
                            const Extension = script.runInThisContext();
                            instance = new Extension();
                        } else {
                            console.error('Cannot find \'main.js\' in ' + fileName);
                        }

                        // Load locale
                        const locale = {};
                        for (const fileName in zipData.files) {
                            const result = fileName.match(/(?<=locales[\\/])[0-9A-Za-z_\-]*(?=.json)/);
                            if (result) {
                                console.log(result[0]);
                                locale[result[0]] = JSON.parse(await zipData.files[fileName].async('text'));
                            }
                        }
                        this.props.addLocales(locale);

                        extensionInfo = {
                            extensionId: info.id,
                            name: info.id + '.name',
                            description: info.id + '.description',
                            iconURL: info.icon,
                            insetIconURL: info.inset_icon,
                            author: info.author,
                            requirement: info.requirement,
                            instance: instance,
                            extensionAPI: true
                        };
                        this.props.initExtension(extensionInfo);
                    };
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
                        const apiInstance = new ClipCCExtension.CompatibleExtension(instance);
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
                case 'scx': {
                    const url = URL.createObjectURL(file);
                    this.props.vm.extensionManager.loadExtensionURL(url);
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
    render () {
        const extensionLibraryThumbnailData = Object.values(this.props.extension).map(extension => ({
            ...extension,
            rawURL: extension.iconURL || extensionIcon,
            featured: true,
            switchable: true,
            name: (
                <FormattedMessage
                    id={extension.name}
                />
            ),
            description: (
                <FormattedMessage
                    id={extension.description}
                />
            )
        }));
        extensionLibraryThumbnailData.push({
            name: (
                <FormattedMessage
                    defaultMessage="Upload from file"
                    id="gui.extension.upload"
                />
            ),
            description: (
                <FormattedMessage
                    defaultMessage="Upload your own extension from disk."
                    id="gui.extension.upload.description"
                />
            ),
            rawURL: uploadImageURL,
            extensionId: 'upload',
            upload: true,
            featured: true,
            switchable: false
        });
        return (
            <LibraryComponent
                data={extensionLibraryThumbnailData}
                filterable={false}
                id="extensionLibrary"
                title={this.props.intl.formatMessage(messages.extensionManagement)}
                visible={this.props.visible}
                closeAfterSelect={false}
                onItemSelected={this.handleItemSelect}
                onItemSwitchChange={this.handleItemChange}
                onRequestClose={this.props.onRequestClose}
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
    addLocales: msgs => dispatch(addLocales(msgs))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ExtensionLibrary));
