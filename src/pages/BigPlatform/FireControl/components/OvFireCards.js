import React from 'react';
import { Row, Col } from 'antd';

import OvCard from './OvCard';
import styles from './OvFireCards.less';
import fireIcon from '../img/ovFire.png';

export default function OvFireCards(props) {
  const { todayCount, thisWeekCount, thisMonthCount, style={} } = props;

  return (
    <div className={styles.fire} style={style}>
      <Row gutter={20} style={{ margin: 0, height: '100%' }}>
        <Col style={{ height: '100%'}} span={6}>
          <div className={styles.container}>
            {/* <span className={styles.icon} /> */}
            <span className={styles.icon} style={{ backgroundImage: `url(${fireIcon})` }} />
            <p className={styles.title}>火警数量</p>
          </div>
        </Col>
        <Col style={{ height: '100%'}} span={6}><OvCard title="今日" num={todayCount} /></Col>
        <Col style={{ height: '100%' }} span={6}><OvCard title="本周" num={thisWeekCount} /></Col>
        <Col style={{ height: '100%' }} span={6}><OvCard title="本月" num={thisMonthCount} /></Col>
      </Row>
    </div>
  );
}
