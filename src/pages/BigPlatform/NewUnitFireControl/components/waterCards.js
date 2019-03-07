import React from 'react';

import styles from './waterCards.less';
import waterNormal from '../imgs/waterNormal.png';
import waterError from '../imgs/waterError.png';
// import waterUnnormal from '../imgs/waterUnnormal.png';

export default function waterCards(props) {
  // const { status = 1, num = 0, selected = false, ...restProps } = props;
  return (
    <div className={styles.container}>
      <div className={styles.img}>
        <img src={`${waterNormal}`} width="65%" height="55%" alt="" />
      </div>
      <div className={styles.titleArea}>
        <div className={styles.title}>2号楼水箱</div>
        <div className={styles.detail}>
          <span>当前水位：4.5m</span>
          <span style={{ paddingLeft: 10 }}>参考范围：2~4m</span>
        </div>
      </div>
      <div className={styles.statusPic}>
        {/* <img src={`${waterError}`} width="80%" height="80%" alt="" /> */}
      </div>
    </div>
  );
}
