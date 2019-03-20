import React from 'react';
import { Row, Col } from 'antd';

import styles from './WaterCards.less';
import waterNormal from '../imgs/pond-normal.png';
import waterError from '../imgs/pond-abnormal.png';
import waterLoss from '../imgs/pond-loss.png';

const DEFAULT = '---';

function parseDataNum(n) {
  const t = typeof n;
  if (t === 'number') return n;
  if (t === 'string') {
    const parsed = Number.parseFloat(n);
    return Object.is(parsed, NaN) ? DEFAULT : 0;
  }

  return DEFAULT;
}

export default function WaterCards(props) {
  const { name, status, value, unit, range, onClick } = props;
  return (
    <Col span={24} className={styles.container} onClick={onClick}>
      {+status !== 0 && +status !== -1 && <div className={styles.status}>异常</div>}
      <img src={+status === -1 ? waterLoss : +status === 0 ? waterNormal : waterError} alt="pond" />
      {+status === -1 && (
        <div className={styles.itemContainer}>
          <div style={{ color: '#838383' }}>{name}</div>
          <Row style={{ color: '#838383' }}>
            <Col span={12}>
              当前水位：
              <span>
                {parseDataNum(value)}
                {parseDataNum(value) === '---' ? '' : unit}
              </span>
            </Col>
            <Col span={12}>
              参考范围：
              {(!range[0] && range[0] !== 0) || (!range[1] && range[1] !== 0) ? (
                '---'
              ) : (
                <span>
                  {range[0]}
                  ~$
                  {range[1]}${unit}
                </span>
              )}
            </Col>
          </Row>
        </div>
      )}
      {+status !== -1 && (
        <div className={styles.itemContainer}>
          <div>{name}</div>
          <Row>
            <Col span={12}>
              当前水位：
              <span style={{ color: +status !== 0 ? '#f84c48' : '' }}>
                {parseDataNum(value)}
                {parseDataNum(value) === '---' ? '' : unit}
              </span>
            </Col>
            <Col span={12}>
              参考范围：
              {(!range[0] && range[0] !== 0) || (!range[1] && range[1] !== 0) ? (
                '---'
              ) : (
                <span>
                  {range[0]}
                  ~$
                  {range[1]}${unit}
                </span>
              )}
            </Col>
          </Row>
        </div>
      )}
    </Col>
  );
}
