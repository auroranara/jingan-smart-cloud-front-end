import React, { PureComponent } from 'react';

import styles from 'Distribution.less';

const rect = <span className={styles.rect} />;

function RectTotal(props) {
  const { label, num, ...restProps } = props;
  return (
    <div className={styles.rectContainer} {...restProps}>
      <span>{label}:</span>
      <span>
        <span className={styles.num}>{num}</span>
        人
      </span>
    </div>
  );
}

export default class Distribution extends PureComponent {
  render() {
    const list = [{ label: '管理人员', num: 2 }, { label: '安全巡查人员', num: 2 }];

    return (
      <div className={styles.container}>
        <div className={styles.upper}>
          <div className={styles.title}>
            {rect}
            区域分布
          </div>
        </div>
        <div className={styles.lower}>
          <div className={styles.title}>
            {rect}
            生产区域人员统计
            <span className={styles.total}>(21)</span>
          </div>
          <div className={styles.rects}>
            div
          </div>
        </div>
      </div>
    );
  }
}
