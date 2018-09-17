import React, { PureComponent } from 'react';
import { Row, Col, Select } from 'antd';
import moment from 'moment';

import styles from './ExhaustMonitor.less';
import ExhaustCards from '../components/ExhaustCards';
import ExSection from './ExSection';

import timeIcon from '../imgs/timeIcon.png';
import waterBg from '../imgs/waterBg.png';

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

  render() {
    const list = [];

    return (
      <ExSection title="废气监测">
        {list && list.length ? (
          <section className={styles.container}>
            <span className={styles.selectIcon}>
              <Select defaultValue="厂区：一车间" dropdownClassName={styles.selectDropDown}>
                <Option value="one">厂区：一车间</Option>
              </Select>
            </span>
            <Row span={24} style={{ height: '12%' }}>
              <Col span={24} style={{ height: '100%' }}>
                <div className={styles.timeSection}>
                  <span
                    className={styles.timeIcon}
                    style={{ backgroundImage: `url(${timeIcon})` }}
                  />
                  <span className={styles.day}>{this.state.day}</span>
                  <span className={styles.min}>{this.state.time}</span>
                </div>
              </Col>
            </Row>
            {list.map(i => (
              <div key={i} className={styles.oneCards}>
                <Row gutter={14} style={{ margin: 0, height: '100%' }}>
                  {[0, 1, 2, 3].map(() => {
                    return (
                      <Col style={{ height: '100%' }} span={6}>
                        <ExhaustCards num="8.91" unit="%" title="氧浓度" />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ))}
          </section>
        ) : (
          <div
            className={styles.noCards}
            style={{
              background: `url(${waterBg})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: '40% 55%',
            }}
          />
        )}
      </ExSection>
    );
  }
}
