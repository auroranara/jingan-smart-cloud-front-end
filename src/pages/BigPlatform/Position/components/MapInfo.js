import React from 'react';
import { Icon } from 'antd';

import styles from './MapInfo.less';
import { getAlarmDesc } from '../utils';

export default function MapInfo(props) {
  const { alarms, handleShowAlarmHandle, handleShowAlarmDrawer } = props;
  const length = alarms.length;
  const [sos, low] = alarms.reduce((counts, current) => {
    const { sos, lowPower } = current;
    return [counts[0] + (sos ? 1 : 0), counts[1] + (lowPower ? 1 : 0)]
  }, [0, 0]);

  const latest = alarms[alarms.length - 1];

  return (
    <div className={styles.container}>
      <div>
        全厂：
        <span className={styles.total}>108人</span>
        报警：
        <span className={length ? styles.alarmRed : styles.alarm}>{length}处</span>
        SOS求救：
        <span className={sos ? styles.sosRed : styles.sos}>{sos}起</span>
        低电量：
        <span className={low ? styles.lowPower : null}>{low}</span>
      </div>
      {latest && (
        <div
          className={styles.first}
          onClick={e => handleShowAlarmHandle(latest.id)}
        >
          {getAlarmDesc(latest).join(' ')}，请及时支援！
        </div>
      )}
      {latest && <span className={styles.more} onClick={handleShowAlarmDrawer}>更多<Icon type="double-right" /></span>}
    </div>
  )
}
