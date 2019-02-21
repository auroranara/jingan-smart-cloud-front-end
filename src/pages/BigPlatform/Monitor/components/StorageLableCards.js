import React from 'react';
import line from '../imgs/line.png';
import { Col } from 'antd';
import styles from './StorageLableCards.less';
import Ellipsis from 'components/Ellipsis';

const DEFAULT = '---';

function parseDataNum(n) {
  const t = typeof n;
  if (t === 'number')
    return n;
  if (t === 'string') {
    const parsed = Number.parseFloat(n);
    return Object.is(parsed, NaN) ? DEFAULT : 0;
  }

  return DEFAULT;
}

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
        return fireColor;
      case '2':
        return fireColor;
      default:
        return;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <Col span={1}>
          <span className={styles.dot} />
        </Col>
        <Col span={15}>
          <span className={styles.topTitle}>
            储罐ID：
            <Ellipsis tooltip length={10}>
              {title}
            </Ellipsis>
          </span>
        </Col>
        <Col span={7} style={{ textAlign: 'right' }}>
          <span className={styles.topNum}>
            位号：
            <Ellipsis tooltip length={6}>
              {num}
            </Ellipsis>
          </span>
        </Col>
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
            {getStatus(dataList[0].status) ? (
              // dataList[0].value || '---'
              parseDataNum(dataList[0].value)
            ) : (
              <span style={{ color: '#516895' }}>/</span>
            )}
          </p>
          <p className={styles.liquidTitle}>
            液位(
            {dataList[0].unit || 'mm'})
            {dataList[0].status !== '0' && dataList[0].limitValue ? (
              <span>
                ({dataList[0].condition}
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
            {getStatus(dataList[1].status) ? (
              // dataList[1].value || '---'
              parseDataNum(dataList[1].value)
            ) : (
              <span style={{ color: '#516895' }}>/</span>
            )}
          </p>
          <p className={styles.pressureTitle}>
            压力(
            {dataList[1].unit || 'MPa'})
            {dataList[1].status !== '0' && dataList[1].limitValue ? (
              <span>
                ({dataList[1].condition}
                {dataList[1].limitValue})
              </span>
            ) : (
              ''
            )}
          </p>
        </div>

        <div className={styles.temp}>
          <p className={styles.tempCount} style={{ color: `${getStatus(dataList[2].status)}` }}>
            {getStatus(dataList[2].status) ? (
              // dataList[2].value || '---'
              parseDataNum(dataList[2].value)
            ) : (
              <span style={{ color: '#516895' }}>/</span>
            )}
          </p>
          <p className={styles.tempTitle}>
            温度(
            {dataList[2].unit || '℃'} )
            {dataList[2].status !== '0' && dataList[2].limitValue ? (
              <span>
                ({dataList[2].condition}
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
