import gui from '../containers/gui.jsx'

class ExtensionAPI {
    constructor (gui) {
        this.gui = gui;
    }
    
    isDesktop () {
        return this.gui.props.isScratchDesktop;
    }
    
    isEditorLoading () {
        return this.gui.props.isLoading;
    }
}

export {ExtensionAPI};