import React from 'react';
import { Row, Col, Select } from 'antd';

import styles from './ExhaustMonitor.less';
import ExhaustCards from '../components/ExhaustCards';
import ExSection from './ExSection';

import timeIcon from '../imgs/timeIcon.png';

export default function ExhaustMonitor() {
  const Option = Select.Option;

  const cards = (
    <Row gutter={16} style={{ margin: 0, height: '100%' }}>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="mg/m³" title="SO₂" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="mg/m³" title="NOX" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="mg/m³" title="颗粒物" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="m/s" title="流速" />
      </Col>
    </Row>
  );
  const twoCards = (
    <Row gutter={16} style={{ margin: 0, height: '100%' }}>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="mg/m³" title="SO₂折算" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="mg/m³" title="NOX折算" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="mg/m³" title="颗粒物折算" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="℃" title="温度" />
      </Col>
    </Row>
  );
  const threeCards = (
    <Row gutter={16} style={{ margin: 0, height: '100%' }}>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="MPa" title="压力" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="%" title="氧浓度" color="rgb(232, 103, 103)" />
      </Col>
    </Row>
  );

  return (
    <ExSection title="废气监测">
      <section className={styles.container}>
        <span className={styles.selectIcon}>
          <Select defaultValue="厂区：一车间" dropdownClassName={styles.selectDropDown}>
            <Option value="one">厂区：一车间</Option>
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
        <div className={styles.threeCards}>{threeCards}</div>
      </section>
    </ExSection>
  );
}