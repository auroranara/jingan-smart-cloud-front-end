import React from 'react';
import { Icon } from 'antd';

import styles from './MapInfo.less';
import { getAlarmDesc } from '../utils';

export default function MapInfo(props) {
  const { alarms, sectionTree, positionList, showPersonInfoOrAlarmMsg, handleShowAlarmDrawer } = props;
  const length = alarms.length;
  const sos = alarms.reduce((count, current) => count + (+current.type === 1), 0);
  const low = positionList.reduce((count, current) => +current.lowPower + count, 0);

  const latest = alarms[alarms.length - 1];
  const total = sectionTree.reduce((prev, next) => prev + next.count, 0);

  return (
    <div className={styles.container}>
      <div>
        全厂：
        <span className={styles.total}>{total}人</span>
        报警：
        <span className={length ? styles.alarmRed : styles.alarm}>{length}起</span>
        SOS求救：
        <span className={sos ? styles.sosRed : styles.sos}>{sos}起</span>
        低电量：
        <span className={low ? styles.lowPower : null}>{low}</span>
      </div>
      {latest && (
        <div
          className={styles.first}
          onClick={e => showPersonInfoOrAlarmMsg(latest.type, latest.id, latest.cardId)}
        >
          {getAlarmDesc(latest).join(' ')}，请及时支援！
        </div>
      )}
      {latest && <span className={styles.more} onClick={handleShowAlarmDrawer}>更多<Icon type="double-right" /></span>}
    </div>
  )
}
