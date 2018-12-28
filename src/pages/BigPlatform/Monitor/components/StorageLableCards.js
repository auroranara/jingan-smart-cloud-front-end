import React from 'react';
import line from '../imgs/line.png';
// import { Col, Row } from 'antd';
import styles from './StorageLableCards.less';

export default function StorageCards(props) {
  const { num, title, dataList } = props;

  const normalColor = '#00a8ff';
  const lossColor = '#c6c181';
  const fireColor = '#e46867';

  const getStatus = status => {
    switch (status) {
      case '0':
        return normalColor;
      case '-1':
        return lossColor;
      case '1':
        return lossColor;
      case '2':
        return fireColor;
      default:
        return;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.dot} />
        <span className={styles.topTitle}>
          储罐ID：
          {title}
        </span>
        <span className={styles.topNum}>
          位号：
          {num}
        </span>
      </div>

      <div className={styles.bottom}>
        <div
          className={styles.liquid}
          style={{
            backgroundImage: `url(${line})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1% 100%',
          }}
        >
          <p className={styles.liquidCount} style={{ color: `${getStatus(dataList[0].status)}` }}>
            {dataList[0].value || '---'}
          </p>
          <p className={styles.liquidTitle}>
            液位(mm)
            {dataList[0].limitValue ? (
              <span>
                ({dataList[0].condition === '1' ? '>' : '<'}
                {dataList[0].limitValue})
              </span>
            ) : (
              ''
            )}
          </p>
        </div>

        <div
          className={styles.pressure}
          style={{
            backgroundImage: `url(${line})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1% 100%',
          }}
        >
          <p className={styles.pressureCount} style={{ color: `${getStatus(dataList[1].status)}` }}>
            {dataList[1].value || '---'}
          </p>
          <p className={styles.pressureTitle}>
            压力(Pa)
            {dataList[1].limitValue ? (
              <span>
                ({dataList[1].condition === '1' ? '>' : '<'}
                {dataList[1].limitValue})
              </span>
            ) : (
              ''
            )}
          </p>
        </div>

        <div className={styles.temp}>
          <p className={styles.tempCount} style={{ color: `${getStatus(dataList[2].status)}` }}>
            {dataList[2].value || '---'}
          </p>
          <p className={styles.tempTitle}>
            温度(℃)
            {dataList[2].limitValue ? (
              <span>
                ({dataList[2].condition === '1' ? '>' : '<'}
                {dataList[2].limitValue})
              </span>
            ) : (
              ''
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
