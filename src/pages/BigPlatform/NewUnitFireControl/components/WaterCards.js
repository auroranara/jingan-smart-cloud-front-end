import React from 'react';
import { Row, Col } from 'antd';

import styles from './WaterCards.less';
import waterNormal from '../imgs/pond-normal.png';
import waterError from '../imgs/pond-abnormal.png';
import waterLoss from '../imgs/pond-loss.png';
import Ellipsis from '@/components/Ellipsis';

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
  const { name, status, value, unit, range, onClick, isMending, isNotIn } = props;
  const isGray = isMending || isNotIn || (!isMending && +status < 0);
  return (
    <Col span={24} className={styles.container} onClick={onClick}>
      {isMending && <div className={styles.status}>检修</div>}
      {isNotIn && <div className={styles.status}>未接入</div>}
      {!isMending && !isNotIn && +status > 0 && <div className={styles.status}>异常</div>}
      {!isMending &&
        !isNotIn &&
        +status === -1 && (
          <div className={styles.status} style={{ backgroundColor: '#9f9f9f' }}>
            失联
          </div>
        )}
      <img
        src={isGray ? waterLoss : !isMending && +status === 0 ? waterNormal : waterError}
        alt="pond"
      />
      {isGray && (
        <div className={styles.itemContainer}>
          <div style={{ color: '#838383' }}>{name}</div>
          <Row style={{ color: '#838383' }}>
            <Col span={12}>
              <Ellipsis lines={1} tooltip>
                当前水位：
                <span>---</span>
              </Ellipsis>
            </Col>
            <Col span={12}>
              <Ellipsis lines={1} tooltip>
                参考范围：
                {isNotIn || (!range[0] && range[0] !== 0) || (!range[1] && range[1] !== 0) ? (
                  '---'
                ) : (
                  <span>
                    {range[0]}~{range[1]}
                    {unit}
                  </span>
                )}
              </Ellipsis>
            </Col>
          </Row>
        </div>
      )}
      {!isGray && (
        <div className={styles.itemContainer}>
          <div>{name}</div>
          <Row>
            <Col span={12}>
              <Ellipsis lines={1} tooltip>
                当前水位：
                <span style={{ color: +status !== 0 ? '#f84c48' : '' }}>
                  {parseDataNum(value)}
                  {parseDataNum(value) === '---' ? '' : unit}
                </span>
              </Ellipsis>
            </Col>
            <Col span={12}>
              <Ellipsis lines={1} tooltip>
                参考范围：
                {(!range[0] && range[0] !== 0) || (!range[1] && range[1] !== 0) ? (
                  '---'
                ) : (
                  <span>
                    {range[0]}~{range[1]}
                    {unit}
                  </span>
                )}
              </Ellipsis>
            </Col>
          </Row>
        </div>
      )}
    </Col>
  );
}
