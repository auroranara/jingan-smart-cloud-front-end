import React, { PureComponent } from 'react';

import styles from './TypeCard.less';

export default class TypeCardHead extends PureComponent {
  render() {
    const { labelList, alarming } = this.props;

    return (
      <div className={styles.head}>
        {labelList.map(([name, value], i) => (
          <p className={styles.p}>
            <span className={styles.label}>{name}：</span>{value}
            {!i && alarming && <span className={styles.alarm} />}
          </p>
        ))}
        <div className={styles.icons}>
          <span className={styles.sheet} onClick={this.handleWorkOrderIconClick} />
          <span className={styles.trend} onClick={this.handleMonitorTrendIconClick} />
        </div>
        <span className={styles.detail}>详情信息></span>
      </div>
    );
  }
}
