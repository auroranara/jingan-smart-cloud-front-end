import React, { PureComponent } from 'react';
import { Row, Col, Select } from 'antd';
import moment from 'moment';

import styles from './ExhaustMonitor.less';
import ExhaustCards from '../components/ExhaustCards';
import ExSection from './ExSection';

import timeIcon from '../imgs/timeIcon.png';

const Option = Select.Option;

export default class ExhaustMonitor extends PureComponent {
  state = {
    day: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  };

  componentDidMount() {
    setInterval(() => {
      this.setState({
        day: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm:ss'),
      });
    }, 5 * 60 * 1000);
  }

  cards = (
    <Row gutter={12} style={{ margin: 0, height: '100%' }}>
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
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="MPa" title="压力" />
      </Col>
      <Col style={{ height: '100%' }} span={6}>
        <ExhaustCards num="8.91" unit="%" title="氧浓度" />
      </Col>
    </Row>
  );

  render() {
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
                <span className={styles.day}>{this.state.day}</span>
                <span className={styles.min}>{this.state.time}</span>
              </div>
            </Col>
          </Row>
          <div className={styles.oneCards}>{this.cards}</div>
        </section>
      </ExSection>
    );
  }
}
