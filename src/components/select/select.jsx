import React, {createRef} from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';

import styles from './select.css';
import indicatorIcon from './chevron-down.svg';

class Select extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleMouseDown',
            'handleInputBlur',
            'handleInputFocus',
            'handleClickSelect',
            'handleClickOption',
            'handleHoverOption',
            'handleKeyDown',
            'renderMenu'
        ]);
        const cur = props.options.findIndex(option => option.id === props.value);
        this.state = {
            showMenu: false,
            focus: false,
            select: Math.max(cur, 0),
            value: cur
        };
        this.inputRef = createRef();
        this.menuRef = createRef();
    }

    handleMouseDown (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    handleClickSelect (event) {
        if (this.props.disabled) {
            return;
        }
        if (!this.state.showMenu) {
            this.inputRef.current.focus();
        }
        this.setState({showMenu: !this.state.showMenu});
        event.stopPropagation();
        event.preventDefault();
    }

    handleInputFocus () {
        this.setState({focus: true});
    }

    handleInputBlur () {
        this.setState({
            showMenu: false,
            focus: false
        });
    }

    handleClickOption (index) {
        return event => {
            this.props.onChange(this.props.options[index].id);
            this.setState({showMenu: false, value: index});
            event.stopPropagation();
            event.preventDefault();
        };
    }

    handleHoverOption (index) {
        return () => {
            this.setState({select: index});
        };
    }

    handleKeyDown (event) {
        switch (event.key) {
        case 'Enter':
            if (this.state.showMenu) {
                this.props.onChange(this.props.options[this.state.select].id);
                this.setState({showMenu: false, value: this.state.select});
            } else {
                this.setState({showMenu: true});
            }
            break;
        case 'Escape': {
            if (this.state.showMenu) {
                this.setState({showMenu: false});
            } else {
                return;
            }
            break;
        }
        case 'ArrowUp':
            if (this.state.showMenu) {
                this.setState({
                    select: this.state.select === 0 ? this.props.options.length - 1 : this.state.select - 1
                });
            } else {
                this.setState({showMenu: true});
            }
            break;
        case 'ArrowDown':
            if (this.state.showMenu) {
                this.setState({
                    select: this.state.select === this.props.options.length - 1 ? 0 : this.state.select + 1
                });
            } else {
                this.setState({showMenu: true});
            }
            break;
        default:
            return;
        }
        event.stopPropagation();
    }

    renderMenu () {
        if (!this.state.showMenu) {
            return null;
        }
        return (
            <div
                className={styles.menu}
                ref={this.menuRef}
            >
                {this.props.options.map((option, index) => (
                    <div
                        key={option.id}
                        className={classNames(
                            styles.option,
                            index === this.state.value ? styles.optionSelect : null,
                            index === this.state.select ? styles.optionFocus : null
                        )}
                        onClick={this.handleClickOption(index)}
                        onMouseDown={this.handleMouseDown}
                        onMouseEnter={this.handleHoverOption(index)}
                    >
                        <span>{option.text}</span>
                    </div>
                ))}
            </div>
        );
    }

    render () {
        const {
            // eslint-disable-next-line no-unused-vars
            value, options, disabled, onChange, className,
            ...componentProps
        } = this.props;
        return (
            <div className={styles.container}>
                <div
                    className={classNames(
                        className,
                        styles.select,
                        this.state.focus ? styles.selectFocus : null
                    )}
                    onClick={this.handleClickSelect}
                    onMouseDown={this.handleMouseDown}
                    onKeyDown={this.handleKeyDown}
                    {...componentProps}
                >
                    <div className={styles.value}>
                        <span>
                            {this.state.value === -1 ? '' : this.props.options[this.state.value].text}
                        </span>
                    </div>
                    <input
                        className={styles.dummyInput}
                        ref={this.inputRef}
                        onBlur={this.handleInputBlur}
                        onFocus={this.handleInputFocus}
                        inputMode="none"
                    />
                    <div className={styles.indicator}>
                        <img
                            src={indicatorIcon}
                            className={classNames(
                                styles.image,
                                this.state.showMenu ? styles.imageRotate : null
                            )}
                        />
                    </div>
                </div>
                {this.renderMenu()}
            </div>
        );
    }
}

Select.propTypes = {
    value: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        text: PropTypes.string
    })).isRequired,
    disabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string
};

Select.defaultProps = {
    disabled: false
};

export default Select;
