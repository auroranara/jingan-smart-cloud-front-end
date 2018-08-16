import React from 'react';
import { Row, Col } from 'antd';

import OvCard from './OvCard';
import styles from './OvFireCards.less';
import fireIcon from './ovFire.png';

export default function OvFireCards(props) {
  return (
    <div className={styles.fire}>
      <Row gutter={20} style={{ margin: 0, height: '100%' }}>
        <Col style={{ height: '100%'}} span={6}>
          <div className={styles.container}>
            <span className={styles.icon} style={{ background: `url(${fireIcon})`, backgroundSize: 'cover' }} />
            <p className={styles.title}>火警数量</p>
          </div>
        </Col>
        <Col style={{ height: '100%'}} span={6}><OvCard title="今日" num={0} /></Col>
        <Col style={{ height: '100%' }} span={6}><OvCard title="本周" num={0} /></Col>
        <Col style={{ height: '100%' }} span={6}><OvCard title="本月" num={0} /></Col>
      </Row>
    </div>
  );
}
