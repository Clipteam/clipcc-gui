/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
import React from 'react';
import LazyBlocks from './lazy-blocks';
import Loader from '../components/loader/loader.jsx';
export default function LazyBlocksHOC (WrappedComponent) {
    class LazyLoadBlocks extends React.Component {
        constructor (props) {
            super(props);
            this.state = {isLoaded: false};
        }
        componentDidMount () {
            if (!this.state.isLoaded) {
                LazyBlocks.get().then(() => {
                    this.setState({isLoaded: true});
                })
                    .catch(e => {
                        console.error(e);
                    });
            }
        }
        render () {
            return (
                <>
                    {this.state.isLoaded ? <WrappedComponent {...this.props} /> : <Loader messageId="gui.loader.blocks" />}
                </>
            );
        }
    }
    return LazyLoadBlocks;
    // 鬼知道为什么函数类型的组件不能用useState，我换个类组件吧
    /*
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (!loaded) {
            LazyBlocks.get().then(() => {
                setLoaded(true);
            })
                .catch(e => {
                    console.error(e);
                });
        }
    });
    return (
        <>
            {loaded ? <WrappedComponent /> : <div>Loading...</div>}
        </>
    );
    */
}
