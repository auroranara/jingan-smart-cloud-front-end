import React from 'react';
import moment from 'moment';

import styles from './MonitorCard.less';

const CLASSNAMES = ['red', 'white', 'yellow'];

export default function MonitorCard(props) {
  // status 0 火警 1 故障 2 失联
  const { data: { type, number, location, params, time, status } } = props;

  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <p>
          <span className={styles.item}>监测模块</span>
          {type}
        </p>
        <p>
          <span className={styles.item}>设备号</span>
          {number}
        </p>
        <p>
          <span className={styles.item}>设备状态</span>
          <span className={styles[CLASSNAMES[status]]}>{params}</span>
        </p>
        <p>
          <span className={styles.item}>区域位置</span>
          {location}
        </p>
        {time && (
          <p>
            <span className={styles.item}>发生时间</span>
            {moment(time).format('YYYY-MM-DD HH:mm')}
          </p>
        )}
      </div>
    </div>
  );
}
