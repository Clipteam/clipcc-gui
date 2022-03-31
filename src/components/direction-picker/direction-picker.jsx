import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Popover from 'react-popover';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

import Label from '../forms/label.jsx';
import Input from '../forms/input.jsx';
import BufferedInputHOC from '../forms/buffered-input-hoc.jsx';
import Dial from './dial.jsx';

import styles from './direction-picker.css';

import allAroundIcon from './icon--all-around.svg';
import leftRightIcon from './icon--left-right.svg';
import dontRotateIcon from './icon--dont-rotate.svg';

const BufferedInput = BufferedInputHOC(Input);

const directionLabel = (
    <FormattedMessage
        defaultMessage="Direction"
        description="Sprite info direction label"
        id="gui.SpriteInfo.direction"
    />
);

const RotationStyles = {
    ALL_AROUND: 'all around',
    LEFT_RIGHT: 'left-right',
    DONT_ROTATE: "don't rotate"
};

const messages = defineMessages({
    allAround: {
        id: 'gui.directionPicker.rotationStyles.allAround',
        description: 'Button to change to the all around rotation style',
        defaultMessage: 'All Around'
    },
    leftRight: {
        id: 'gui.directionPicker.rotationStyles.leftRight',
        description: 'Button to change to the left-right rotation style',
        defaultMessage: 'Left/Right'
    },
    dontRotate: {
        id: 'gui.directionPicker.rotationStyles.dontRotate',
        description: 'Button to change to the dont rotate rotation style',
        defaultMessage: 'Do not rotate'
    }
});

const DirectionPicker = props => (
    <Label
        secondary
        above={props.labelAbove}
        text={directionLabel}
    >
        <Popover
            className={styles.popover}
            body={
                <div>
                    <Dial
                        direction={props.direction}
                        onChange={props.onChangeDirection}
                    />
                    <div className={styles.buttonRow}>
                        <button
                            className={classNames(styles.iconButton, {
                                [styles.active]: props.rotationStyle === RotationStyles.ALL_AROUND
                            })}
                            title={props.intl.formatMessage(messages.allAround)}
                            onClick={props.onClickAllAround}
                        >
                            <img
                                draggable={false}
                                src={allAroundIcon}
                            />
                        </button>
                        <button
                            className={classNames(styles.iconButton, {
                                [styles.active]: props.rotationStyle === RotationStyles.LEFT_RIGHT
                            })}
                            title={props.intl.formatMessage(messages.leftRight)}
                            onClick={props.onClickLeftRight}
                        >
                            <img
                                draggable={false}
                                src={leftRightIcon}
                            />
                        </button>
                        <button
                            className={classNames(styles.iconButton, {
                                [styles.active]: props.rotationStyle === RotationStyles.DONT_ROTATE
                            })}
                            title={props.intl.formatMessage(messages.dontRotate)}
                            onClick={props.onClickDontRotate}
                        >
                            <img
                                draggable={false}
                                src={dontRotateIcon}
                            />
                        </button>
                    </div>
                </div>
            }
            isOpen={props.popoverOpen}
            preferPlace="above"
            onOuterAction={props.onClosePopover}
        >
            <BufferedInput
                small
                disabled={props.disabled}
                label={directionLabel}
                tabIndex="0"
                type="text"
                value={props.disabled ? '' : props.direction}
                onFocus={props.onOpenPopover}
                onSubmit={props.onChangeDirection}
            />
        </Popover>
    </Label>

);

DirectionPicker.propTypes = {
    direction: PropTypes.number,
    disabled: PropTypes.bool.isRequired,
    labelAbove: PropTypes.bool,
    onChangeDirection: PropTypes.func.isRequired,
    onClickAllAround: PropTypes.func.isRequired,
    onClickDontRotate: PropTypes.func.isRequired,
    onClickLeftRight: PropTypes.func.isRequired,
    onClosePopover: PropTypes.func.isRequired,
    onOpenPopover: PropTypes.func.isRequired,
    popoverOpen: PropTypes.bool.isRequired,
    rotationStyle: PropTypes.string
};

DirectionPicker.defaultProps = {
    labelAbove: false
};

const WrappedDirectionPicker = injectIntl(DirectionPicker);

export {
    WrappedDirectionPicker as default,
    RotationStyles
};
