import React from 'react';
import moment from 'moment';

import styles from './InfoBar.less';

const STATUS = {
  0: '正常',
  1: '预警',
  2: '告警',
};

const STATUS_COLOR = {
  0: '#03D666',
  1: '#EA2E2E',
  2: '#EA2E2E',
}

export default function StatusBar(props) {
  const { data: { name, unit, value, status, time }, ...restProps } = props;

  return (
    <div className={styles.container} {...restProps}>
      <p className={styles.status}>
        <span>
          <span className={styles.name}>{name}({unit})：</span>
          {value}
        </span>
        <span>
          状态：
          <span style={{ color: STATUS_COLOR[status] }}>
            {STATUS[status]}
          </span>
        </span>
      </p>
      <p className={styles.time}>更新时间：{moment(time).format('YYYY-MM-DD HH:mm:ss')}</p>
    </div>
  );
}
