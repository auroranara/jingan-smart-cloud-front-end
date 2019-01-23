import React, { Fragment } from 'react';
import moment from 'moment';

import styles from './MonitorCard.less';

const CLASSNAMES = ['white', 'red', 'red', 'yellow'];

export default function MonitorCard(props) {
  // 0 消防主机故障 1 消防主机火警 2 其他监测设备报警 2 失联
  const { data: { type, number, location, params, time, status } } = props;

  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <p>
          <span className={styles.item}>监测模块</span>
          {type}
        </p>
        <p>
          <span className={styles.item1}>设备号</span>
          {number}
        </p>
        <p>
          <span className={styles.item}>设备状态</span>
          {status === 2
          ? <Fragment><span className={styles.red}>报警</span>（{params}）</Fragment>
          : <span className={styles[CLASSNAMES[status]]}>{params}</span>
          }
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
