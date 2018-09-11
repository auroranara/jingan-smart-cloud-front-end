import React from 'react';
import { Row, Col, Select } from 'antd';

import styles from './EffluentMonitor.less';
import ExSection from './ExSection';
import WasteWaterWave from './components/WasteWaterWave/index';

import timeIcon from './timeIcon.png';

export default function EffluentMonitor() {
  const Option = Select.Option;

  const cards = (
    <Row gutter={24} style={{ margin: 0, height: '100%' }}>
      <Col style={{ height: '100%' }} span={8}>
        <WasteWaterWave height={110} percent={34} title="COD" num="12" unit="mg/L" />
      </Col>
      <Col style={{ height: '100%' }} span={8}>
        <WasteWaterWave
          height={110}
          percent={34}
          title="氨氧"
          num="0.007"
          unit="mg/L"
          color="rgb(232, 103, 103)"
        />
      </Col>
      <Col style={{ height: '100%' }} span={8}>
        <WasteWaterWave height={110} percent={34} title="总磷" num="0.006" unit="mg/L" />
      </Col>
    </Row>
  );

  const twoCards = (
    <Row gutter={24} style={{ margin: 0, height: '100%' }}>
      <Col style={{ height: '100%' }} span={8}>
        <WasteWaterWave height={110} percent={34} title="PH" num="8.81" unit="" />
      </Col>
      <Col style={{ height: '100%' }} span={8}>
        <WasteWaterWave height={110} percent={34} title="瞬时流量" num="12" unit="m³/h" />
      </Col>
      <Col style={{ height: '100%' }} span={8}>
        <WasteWaterWave height={110} percent={34} title="累计流量" num="350" unit="m³/h" />
      </Col>
    </Row>
  );

  // const noCards = <div className={styles.noCards} />;

  return (
    <ExSection title="废水监测">
      <section className={styles.container}>
        <span className={styles.selectIcon}>
          <Select defaultValue="厂区：一车间" style={{ width: 140 }}>
            <Option value="one">厂区：一车间</Option>
            <Option value="two">厂区：二车间</Option>
            <Option value="three">厂区：三车间</Option>
          </Select>
        </span>
        <Row span={24} style={{ height: '12%' }}>
          <Col span={24} style={{ height: '100%' }}>
            <div className={styles.timeSection}>
              <span className={styles.timeIcon} style={{ backgroundImage: `url(${timeIcon})` }} />
              <span className={styles.day}>2018-08-17</span>
              <span className={styles.min}>15:30</span>
            </div>
          </Col>
        </Row>
        <div className={styles.oneCards}>{cards}</div>
        <div className={styles.twoCards}>{twoCards}</div>
      </section>
    </ExSection>
  );
}
