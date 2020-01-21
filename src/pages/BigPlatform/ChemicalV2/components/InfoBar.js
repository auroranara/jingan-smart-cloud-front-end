import React from 'react';
import moment from 'moment';

import styles from './InfoBar.less';

const NO_DATA = '暂无数据';
const STATUS = {
  0: '正常',
  1: '预警',
  2: '告警',
};

const STATUS_COLOR = {
  0: '#03D666',
  1: '#EA2E2E',
  2: '#EA2E2E',
};

export default function StatusBar(props) {
  const {
    data: { paramDesc, paramUnit, realValue, status, dataUpdateTime, fixType },
    ...restProps
  } = props;

  return (
    <div className={styles.container} {...restProps}>
      <p className={styles.status}>
        <span>
          <span className={styles.name}>
            {paramDesc}
            {+fixType !== 5 && `(${paramUnit})：`}
          </span>
          {realValue || realValue === 0 ? realValue : NO_DATA}
        </span>
        <span>
          状态：
          <span style={{ color: STATUS_COLOR[status] }}>{STATUS[status]}</span>
        </span>
      </p>
      <p className={styles.time}>
        更新时间：
        {dataUpdateTime ? moment(dataUpdateTime).format('YYYY-MM-DD HH:mm:ss') : NO_DATA}
      </p>
    </div>
  );
}
