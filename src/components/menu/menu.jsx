import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {getSetting} from '../../reducers/settings';


import styles from './menu.css';

const Menu = ({
    className = '',
    darkMode,
    children,
    componentRef,
    place = 'right'
}) => (
    <ul
        className={classNames(
            styles.menu,
            className,
            {
                [styles.left]: place === 'left',
                [styles.right]: place === 'right',
                [styles.darkMenu]: darkMode === 'dark'
            }
        )}
        ref={componentRef}
    >
        {children}
    </ul>
);

Menu.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    componentRef: PropTypes.func,
    darkMode: PropTypes.string,
    place: PropTypes.oneOf(['left', 'right'])
};


const MenuItem = ({
    children,
    className,
    onClick
}) => (
    <li
        className={classNames(
            styles.menuItem,
            styles.hoverable,
            className
        )}
        onClick={onClick}
    >
        {children}
    </li>
);

MenuItem.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: PropTypes.func
};


const addDividerClassToFirstChild = (child, id) => (
    child && React.cloneElement(child, {
        className: classNames(
            child.className,
            {[styles.menuSection]: id === 0}
        ),
        key: id
    })
);

const MenuSection = ({children}) => (
    <React.Fragment>{
        React.Children.map(children, addDividerClassToFirstChild)
    }</React.Fragment>
);

MenuSection.propTypes = {
    children: PropTypes.node
};

const mapStateToProps = state => ({
    darkMode: getSetting(state, 'darkMode')
});

const MenuComponent = connect(
    mapStateToProps
)(Menu);

export {
    MenuComponent as default,
    MenuItem,
    MenuSection
};
