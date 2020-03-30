import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';

import styles from './MapInfo.less';
import { getAlarmDesc } from '../utils';

export default function MapInfo(props) {
  const { alarms, areaInfo, sectionTree, positionList, showPersonInfoOrAlarmMsg, handleShowAlarmDrawer, handleShowLowPowerDrawer } = props;
  const length = alarms.length;
  const sos = alarms.reduce((count, current) => count + (+current.type === 1), 0);
  const low = positionList.reduce((count, current) => +current.lowPower + count, 0);

  const latest = alarms[0];
  const total = sectionTree.reduce((prev, next) => prev + next.count, 0);

  return (
    <div className={styles.container}>
      <div>
        全厂：
        <span className={styles.total}>{total}人</span>
        报警：
        <span className={length ? styles.alarmRed : styles.alarm} onClick={length ? e => handleShowAlarmDrawer() : null}>{length}起</span>
        SOS求救：
        <span className={sos ? styles.sosRed : styles.sos} onClick={sos ? e => handleShowAlarmDrawer(true) : null}>{sos}起</span>
        低电量：
        <span className={low ? styles.lowPower : null} onClick={low ? handleShowLowPowerDrawer : null}>{low}</span>
      </div>
      {latest && (
        <div
          className={styles.first}
          onClick={e => showPersonInfoOrAlarmMsg(latest.type, latest.id, latest.cardId)}
        >
          {getAlarmDesc(latest, areaInfo).join(' ')}{+latest.type === 1 ? '，请及时处理' : ''}！
        </div>
      )}
      {latest && <span className={styles.more} onClick={e => handleShowAlarmDrawer()}>更多<LegacyIcon type="double-right" /></span>}
    </div>
  );
}
