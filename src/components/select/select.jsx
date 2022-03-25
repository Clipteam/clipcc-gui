import React, {createRef} from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';

import styles from './select.css';
import indicatorIcon from './chevron-down.svg';
import { FormattedDisplayName } from 'react-intl';

class Select extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleMouseDown',
            'handleInputBlur',
            'handleInputFocus',
            'handleClickOption',
            'renderMenu'
        ]);
        this.state = {
            showMenu: false,
            focus: false
        };
        this.inputRef = createRef();
        this.menuRef = createRef();
    }

    handleMouseDown (event) {
        if (this.props.disabled) {
            return;
        }
        if (!this.state.showMenu) {
            this.inputRef.current.focus();
        }
        this.setState({showMenu: !this.state.showMenu});
        event.preventDefault();
    }

    handleInputFocus() {
        this.setState({focus: true});
    }

    handleInputBlur () {
        this.setState({
            showMenu: false,
            focus: false
        });
    }

    handleClickOption (id) {
        return event => {
            this.props.onChange(id);
            this.setState({showMenu: false});
            event.stopPropagation();
            event.preventDefault();
        };
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
                {this.props.options.map(option => (
                    <div
                        key={option.id}
                        className={styles.option}
                        onMouseDown={this.handleClickOption(option.id)}
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
            value, options, disabled, onChange,
            ...componentProps
        } = this.props;
        console.log(this.state);
        return (
            <div className={styles.container}>
                <div
                    className={classNames(
                        styles.select,
                        this.state.focus ? styles.selectFocus : null
                    )}
                    onMouseDown={this.handleMouseDown}
                    {...componentProps}
                >
                    <div className={styles.value}>
                        <span>
                            {this.props.options.find(v => v.id === this.props.value).text}
                        </span>
                    </div>
                    <input
                        className={styles.dummyInput}
                        ref={this.inputRef}
                        onBlur={this.handleInputBlur}
                        onFocus={this.handleInputFocus}
                    />
                    <div className={styles.indicator}>
                        <img src={indicatorIcon} />
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
    onChange: PropTypes.func.isRequired
};

Select.defaultProps = {
    disabled: false
};

export default Select;
