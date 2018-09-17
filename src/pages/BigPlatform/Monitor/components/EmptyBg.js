import React from 'react';

import styles from './EmptyBg.less';
// import emptyIcon from '../imgs/gasEmpty.png';

const emptyIcon = 'http://data.jingan-china.cn/v2/big-platform/monitor/com/gasEmpty.png';

// 尺寸为原来1/3
export default function EmptyBg(props) {
  const { title='暂无信息' } = props;

  return (
    <div className={styles.container}>
      <img src={emptyIcon} alt="空图标" width="119" height="103" />
      <p className={styles.title}>{title}</p>
    </div>
  )
}
