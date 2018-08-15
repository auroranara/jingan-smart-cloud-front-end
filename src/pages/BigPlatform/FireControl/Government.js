import React, { PureComponent } from 'react';
import { Button, Col, Input, Row } from 'antd';

import styles from './Government.less';
import FcModule from './FcModule';
import FcSection from './FcSection';
import AlarmSection from './AlarmSection';
import bg from './bg.png';

import UnitLookUp from './UnitLookUp';

const HEIGHT_PERCNET = { height: '100%' };

export default class FireControlBigPlatform extends PureComponent {
  render() {
    return (
      <Row
        style={{
          height: '100%',
          marginLeft: 0,
          marginRight: 0,
          background: `url(${bg}) center center`,
        }}
        gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }}
      >
        <Col span={6} style={HEIGHT_PERCNET}>
          <FcModule className={styles.overview}>
            <FcSection title="辖区概况" />
            <FcSection title="辖区概况反面" isBack />
          </FcModule>
          <div className={styles.gutter1} />
          <FcModule className={styles.alarmInfo}>
            <AlarmSection />
            <AlarmSection isBack />
          </FcModule>
        </Col>
        <Col span={12} style={HEIGHT_PERCNET}>
          <FcModule className={styles.map}>
            <FcSection title="Map" />
            <FcSection title="Map Reverse" isBack />
          </FcModule>
          <div className={styles.gutter2} />
          <Row className={styles.center}>
            <Col span={12} className={styles.centerLeft}>
              <FcModule style={{ height: '100%' }}>
                <FcSection title="火警趋势" />
                <FcSection title="火警趋势反面" isBack />
              </FcModule>
            </Col>
            <Col span={12} className={styles.centerRight}>
              <FcModule style={{ height: '100%' }}>
                <FcSection title="网格隐患巡查" />
                <FcSection title="网格隐患巡查反面" isBack />
              </FcModule>
            </Col>
          </Row>
        </Col>
        <Col span={6} style={HEIGHT_PERCNET}>
          <FcModule className={styles.inspect}>
            <UnitLookUp />
            <FcSection title="单位查岗反面" isBack />
          </FcModule>
          <div className={styles.gutter3} />
          <FcModule className={styles.system}>
            <FcSection title="系统接入情况" />
            <FcSection title="系统接入情况反面" isBack />
          </FcModule>
        </Col>
      </Row>
    );
  }
}
