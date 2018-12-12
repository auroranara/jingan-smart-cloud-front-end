import React from 'react';
import { Row, Col } from 'antd';

import OvCard from './OvCard';
import styles from './OvFireCards.less';
import fireIcon from '../img/ovFire.png';

export default function OvFireCards(props) {
  const { today=0, thisWeek=0, thisMonth=0, isUnit, handleDrawerVisibleChange, ...restProps } = props;

  return (
    <div className={styles.fire} {...restProps}>
      <Row gutter={20} style={{ margin: 0, height: '100%' }}>
        <Col style={{ height: '100%'}} span={6}>
          <div className={styles.container}>
            {/* <span className={styles.icon} /> */}
            <span className={styles.icon} style={{ backgroundImage: `url(${fireIcon})` }} />
            <p className={styles.title}>火警数量</p>
          </div>
        </Col>
        <Col style={{ height: '100%'}} span={6}>
          <OvCard
            title="今日"
            num={today}
            onClick={e => handleDrawerVisibleChange && handleDrawerVisibleChange('alarm', { isUnit, alarmDrawerLeftType: 0, alarmDrawerRightType: 0 })}
          />
        </Col>
        <Col style={{ height: '100%' }} span={6}>
          <OvCard
            title="本周"
            num={thisWeek}
            onClick={e => handleDrawerVisibleChange && handleDrawerVisibleChange('alarm', { isUnit, alarmDrawerLeftType: 1, alarmDrawerRightType: 1 })}
          />
        </Col>
        <Col style={{ height: '100%' }} span={6}>
          <OvCard
            title="本月"
            num={thisMonth}
            onClick={e => handleDrawerVisibleChange && handleDrawerVisibleChange('alarm', { isUnit, alarmDrawerLeftType: 2, alarmDrawerRightType: 2 })}
          />
        </Col>
      </Row>
    </div>
  );
}
