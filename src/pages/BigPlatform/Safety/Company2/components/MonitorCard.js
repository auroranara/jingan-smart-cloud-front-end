import React from 'react';
import moment from 'moment';

import styles from './MonitorCard.less';

export default function MonitorCard(props) {
  const { data: { label, install_address, component_no, save_time, statusLabel } } = props;

  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <p>
          <span className={styles.item}>监测模块</span>
          {label}
        </p>
        <p>
          <span className={styles.item}>设备号</span>
          {component_no}
        </p>
        <p>
          <span className={styles.item}>设备状态</span>
          <span className={styles.red}>{statusLabel}</span>
        </p>
        <p>
          <span className={styles.item}>区域位置</span>
          {install_address}
        </p>
        <p>
          <span className={styles.item}>发生时间</span>
          {moment(save_time).format('YYYY-MM-DD HH:mm')}
        </p>
      </div>
    </div>
  );
}
