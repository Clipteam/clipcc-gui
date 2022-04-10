/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
import React from 'react';
import PropTypes from 'prop-types';
import VM from 'clipcc-vm';
import log from './log';
import GUI from '../containers/gui.jsx';
import LazyBlocks from './lazy-blocks';
import BlocksLoader from '../components/loader/blocks-loader.jsx';

export default function LazyBlocksHOC (WrappedComponent) {
    class LazyLoadBlocks extends React.Component {
        constructor (props) {
            super(props);
            this.state = {
                isLoaded: LazyBlocks.loaded()
            };
        }
        componentDidMount () {
            if (!this.state.isLoaded) {
                LazyBlocks.load(this.props.vm, block => {
                    this.props.onLoad(block);
                }).then(() => {
                    this.setState({isLoaded: true});
                })
                    .catch(e => {
                        log.error(e);
                    });
            }
        }
        render () {
            const {
                vm
            } = this.props;
            return (
                <>
                    {this.state.isLoaded ? <WrappedComponent
                        {...this.props}
                        vm={vm}
                    /> : <BlocksLoader />}
                </>
            );
        }
    }

    LazyLoadBlocks.propTypes = {
        onLoad: PropTypes.func,
        vm: PropTypes.instanceOf(VM).isRequired
    };

    return LazyLoadBlocks;

}
