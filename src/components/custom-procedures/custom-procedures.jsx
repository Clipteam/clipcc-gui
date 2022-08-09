import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.jsx';
import Box from '../box/box.jsx';
import Checkbox from '../checkbox/checkbox.jsx';
import {defineMessages, injectIntl, FormattedMessage} from 'react-intl';

import booleanInputIcon from './icon--boolean-input.svg';
import textInputIcon from './icon--text-input.svg';
import labelIcon from './icon--label.svg';

import styles from './custom-procedures.css';

const messages = defineMessages({
    myblockModalTitle: {
        defaultMessage: 'Define a Function',
        description: 'Title for the modal where you create a custom block.',
        id: 'gui.customProcedures.myblockModalTitle'
    }
});

const CustomProcedures = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={props.intl.formatMessage(messages.myblockModalTitle)}
        onRequestClose={props.onCancel}
    >
        <Box
            className={styles.workspace}
            componentRef={props.componentRef}
        />
        <Box className={styles.body}>
            <div className={styles.options}>
                <div className={styles.insertOptions}>
                    <div
                        className={styles.optionCard}
                        role="button"
                        tabIndex="0"
                        onClick={props.onAddTextNumber}
                    >
                        <img
                            className={styles.optionIcon}
                            src={textInputIcon}
                        />
                        <div className={styles.optionTitle}>
                            <FormattedMessage
                                defaultMessage="Add a number or text input"
                                description="Label for button to add a number/text input"
                                id="gui.customProcedures.addInputNumberOrText"
                            />
                        </div>
                    </div>
                    <div
                        className={styles.optionCard}
                        role="button"
                        tabIndex="0"
                        onClick={props.onAddColor}
                    >
                        <img
                            className={styles.optionIcon}
                            src={textInputIcon}
                        />
                        <div className={styles.optionTitle}>
                            <FormattedMessage
                                defaultMessage="Add a color input"
                                description="Label for button to add a color input"
                                id="gui.customProcedures.addInputColor"
                            />
                        </div>
                    </div>
                    <div
                        className={styles.optionCard}
                        role="button"
                        tabIndex="0"
                        onClick={props.onAddBoolean}
                    >
                        <img
                            className={styles.optionIcon}
                            src={booleanInputIcon}
                        />
                        <div className={styles.optionTitle}>
                            <FormattedMessage
                                defaultMessage="Add a boolean input"
                                description="Label for button to add a boolean input"
                                id="gui.customProcedures.addInputBoolean"
                            />
                        </div>
                    </div>
                    <div
                        className={styles.optionCard}
                        role="button"
                        tabIndex="0"
                        onClick={props.onAddLabel}
                    >
                        <img
                            className={styles.optionIcon}
                            src={labelIcon}
                        />
                        <div className={styles.optionTitle}>
                            <FormattedMessage
                                defaultMessage="Add a label"
                                description="Label for button to add a label"
                                id="gui.customProcedures.addLabel"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.functionOptions}>
                    <Checkbox
                        checked={props.warp}
                        onChange={props.onToggleWarp}
                    >
                        <FormattedMessage
                            defaultMessage="Run without screen refresh"
                            description="Label for checkbox to run without screen refresh"
                            id="gui.customProcedures.runWithoutScreenRefresh"
                        />
                    </Checkbox>
                    <Checkbox
                        checked={props.global}
                        onChange={props.onToggleGlobal}
                    >
                        <FormattedMessage
                            defaultMessage="Global function"
                            description="Label for checkbox to define a global procedure"
                            id="gui.customProcedures.globalFunction"
                        />
                    </Checkbox>
                    <Checkbox
                        checked={props.return}
                        onChange={props.onToggleReturn}
                        disabled={!props.isCreate}
                    >
                        <FormattedMessage
                            defaultMessage="Custom reporter"
                            description="Label for checkbox to define a procedure with return value"
                            id="gui.customProcedures.customReporter"
                        />
                    </Checkbox>
                </div>
            </div>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.cancelButton}
                    onClick={props.onCancel}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Label for button to cancel custom procedure edits"
                        id="gui.customProcedures.cancel"
                    />
                </button>
                <button
                    className={styles.okButton}
                    onClick={props.onOk}
                >
                    <FormattedMessage
                        defaultMessage="OK"
                        description="Label for button to save new custom procedure"
                        id="gui.customProcedures.ok"
                    />
                </button>
            </Box>
        </Box>
    </Modal>
);

CustomProcedures.propTypes = {
    componentRef: PropTypes.func.isRequired,
    isCreate: PropTypes.bool.isRequired,
    onAddBoolean: PropTypes.func.isRequired,
    onAddLabel: PropTypes.func.isRequired,
    onAddTextNumber: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onToggleWarp: PropTypes.func.isRequired,
    onToggleGlobal: PropTypes.func.isRequired,
    onToggleReturn: PropTypes.func.isRequired,
    warp: PropTypes.bool.isRequired,
    global: PropTypes.bool.isRequired,
    return: PropTypes.bool.isRequired
};

export default injectIntl(CustomProcedures);
