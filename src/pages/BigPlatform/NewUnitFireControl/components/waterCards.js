import React from 'react';
import { Row, Col } from 'antd';

import styles from './waterCards.less';
import waterNormal from '../imgs/pond-abnormal.png';
import waterError from '../imgs/pond-normal.png';

export default function waterCards(props) {
  const { name, status, value, unit, range, onClick } = props;
  return (
    <Col span={24} className={styles.container} onClick={onClick}>
      {status === 0 && <div className={styles.status}>异常</div>}
      <img src={status === 0 ? waterError : waterNormal} alt="pond" />
      <div className={styles.itemContainer}>
        <div className={styles.name}>{name}</div>
        <Row>
          <Col span={12}>
            当前水位：
            <span style={{ color: status === 0 ? '#f83329' : '#fff' }}>
              {value}
              {unit}
            </span>
          </Col>
          <Col span={12}>
            参考范围：
            {`${range[0]}~${range[1]}${unit}`}
          </Col>
        </Row>
      </div>
    </Col>
  );
}
