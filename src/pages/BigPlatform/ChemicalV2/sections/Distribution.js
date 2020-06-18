import React, { PureComponent } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';

import styles from './Distribution.less';

const rect = <span className={styles.rect} />;

function RectTotal(props) {
  const { label, num, ...restProps } = props;
  return (
    <div className={styles.rectOuter}>
      <div className={styles.rectContainer} {...restProps}>
        <span>{label}:</span>
        <span>
          <span className={styles.num}>{num}</span>
          人
        </span>
      </div>
    </div>
  );
}

export default class Distribution extends PureComponent {
  render() {
    const { visible, data, handleIconClick, handleProductionOpen } = this.props;
    const list = Object.entries(data);
    const total = list.reduce((accum, curr) => accum + curr[1], 0);

    return (
      <div className={styles.container}>
        <div className={styles.inner} style={{ display: visible ? 'block' : 'none' }}>
          {/* <div className={styles.upper}>
            <div className={styles.title}>
              {rect}
              区域分布
            </div>
          </div> */}
          <div className={styles.lower}>
            <div className={styles.title}>
              {rect}
              生产区域人员统计
              <span className={styles.total}>({total})</span>
            </div>
            <div className={styles.rects}>
              {list.map(([label, num], i) => <RectTotal key={i} label={label} num={num} onClick={e => handleProductionOpen(label, null)} />)}
            </div>
          </div>
        </div>
        <LegacyIcon
          className={styles.icon}
          style={visible ? { right: -41 } : { left: 1 }}
          type={`double-${visible ? 'left' : 'right'}`}
          onClick={handleIconClick}
        />
      </div>
    );
  }
}
