import React from 'react';
import { Icon } from 'antd';

import styles from './CountBoard.less';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

export default function CountBoard(props) {
  const { hideBoard } = props;
  return (
    <div className={styles.container} style={{ width: WIDTH, height: HEIGHT }}>
      <Icon type="shrink" className={styles.shrink} onClick={hideBoard} />
      <div className={styles.inner}>
        <div className={styles.head}>全厂人数: 108人</div>
        <div className={styles.section1}>
          <h3 className={styles.title}>东厂区人数: 0人</h3>
        </div>
        <div className={styles.section2}>
          <h3 className={styles.title}>西厂区人数: 50人</h3>
        </div>
      </div>
    </div>
  )
};
