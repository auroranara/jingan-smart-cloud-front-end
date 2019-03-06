import React, { PureComponent } from 'react';
import { Row, Col, Radio, Spin } from 'antd';
import Section from '../components/Section/Section.js';
import ChartGauge from '../components/ChartGauge';
import styles from './WaterMonitor.less';
import pondAbnormal from '../images/pond-abnormal.png';
import pondNormal from '../images/pond-normal.png';

export default class FireHostMonitoring extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '0',
    };
  }

  handelChange = item => {
    const {
      target: { value },
    } = item;
    this.setState({ type: value });
  };

  renderTabs = () => {
    const { type } = this.state;
    return (
      <div className={styles.tabsWrapper}>
        <Radio.Group value={type} buttonStyle="solid" onChange={this.handelChange}>
          <Radio.Button value="0">消火栓系统</Radio.Button>
          <Radio.Button value="1">自动喷淋系统</Radio.Button>
          <Radio.Button value="2">水池/水箱</Radio.Button>
        </Radio.Group>
      </div>
    );
  };

  renderHydrant = () => {
    const list = Array(7)
      .fill(true)
      .map((item, index) => {
        return {
          name: `点位名称${index + 1}`,
          id: Math.floor(Math.random() * 666666666).toString(),
          location: '1号楼',
          value: 2 * Math.random().toFixed(2),
          unit: 'MPa',
          range: '0.02~0.09',
        };
      });
    return list.map(item => {
      const { name, value } = item;
      return (
        <Col span={12}>
          <ChartGauge
            showName
            showValue
            name={name}
            value={value}
            range={[0, 2]}
            normalRange={[0.4, 1.2]}
          />
        </Col>
      );
    });
  };

  renderPond = () => {
    const list = Array(7)
      .fill(true)
      .map((item, index) => {
        return {
          name: `水箱${index + 1}`,
          id: Math.floor(Math.random() * 666666666).toString(),
          location: `${index + 1}号楼`,
          value: 2 * Math.random().toFixed(2),
          unit: 'm',
          range: [2, 4],
          status: Math.floor(2 * Math.random()),
        };
      });
    return list.map(item => {
      const { name, value, status, unit, range } = item;
      return (
        <Col span={24} className={styles.pondWrapper}>
          {status === 0 && <div className={styles.pondStatus}>异常</div>}
          <img src={status === 0 ? pondAbnormal : pondNormal} alt="pond" />
          <div className={styles.infoWrapper}>
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
    });
  };

  render() {
    const {} = this.props;
    const { type } = this.state;
    return (
      <Section title="水系统监测">
        <div className={styles.WaterMonitor}>
          {this.renderTabs()}
          <Row className={styles.itemsWrapper}>
            {type !== '2' && this.renderHydrant()}
            {type === '2' && this.renderPond()}
          </Row>
        </div>
      </Section>
    );
  }
}
