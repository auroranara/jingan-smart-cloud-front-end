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
    const { visible, handleIconClick, handleProductionOpen } = this.props;
    const list = [{ label: '管理人员', num: 2 }, { label: '安全巡查人员', num: 2 }, { label: '管理人员', num: 2 },{ label: '管理人员', num: 2 }, { label: '安全巡查人员', num: 2 }, { label: '管理人员', num: 2 },{ label: '管理人员', num: 2 }, { label: '安全巡查人员', num: 2 }, { label: '管理人员', num: 2 }];

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
              <span className={styles.total}>(21)</span>
            </div>
            <div className={styles.rects}>
              {list.map(({ label, num }, i) => <RectTotal key={i} label={label} num={num} onClick={e => handleProductionOpen()} />)}
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
