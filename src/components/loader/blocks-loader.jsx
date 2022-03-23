/* eslint-disable require-jsdoc */
import React from 'react';
import classNames from 'classnames';
import styles from './loader.css';

import topBlock from './top-block.svg';
import middleBlock from './middle-block.svg';
import bottomBlock from './bottom-block.svg';

export default function BlocksLoaderComponent () {
    return (
        <div
            className={classNames(styles.background, styles.blocksLoader)}
        >
            <div className={styles.container}>
                <div className={styles.blockAnimation}>
                    <img
                        className={styles.topBlock}
                        src={topBlock}
                    />
                    <img
                        className={styles.middleBlock}
                        src={middleBlock}
                    />
                    <img
                        className={styles.bottomBlock}
                        src={bottomBlock}
                    />
                </div>
            </div>
        </div>
    );
}
