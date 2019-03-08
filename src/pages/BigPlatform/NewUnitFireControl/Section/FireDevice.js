import React, { PureComponent } from 'react';
import { Radio, Row, Col } from 'antd';

import WaterCards from '../components/WaterCards';
import ChartGauge from '../components/ChartGauge';
import Section from '../Section';
import styles from './FireDevice.less';

export default class FireDevice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '0',
    };
  }

  // 切换状态
  handelRadioChange = item => {
    const {
      target: { value },
    } = item;
    this.setState({ type: value });
  };

  renderHydrant = () => {
    const { onClick } = this.props;
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
        <Col span={12} className={styles.gaugeCol} onClick={() => onClick(0)}>
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

  rendeAuto = () => {
    const { onClick } = this.props;
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
        <Col span={12} className={styles.gaugeCol} onClick={() => onClick(1)}>
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
    const { onClick } = this.props;
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
        <WaterCards
          name={name}
          value={value}
          status={status}
          unit={unit}
          range={range}
          onClick={() => onClick(2)}
        />
      );
    });
  };

  render() {
    const {} = this.props;
    const { type } = this.state;
    return (
      <Section title="水系统">
        <div className={styles.container}>
          <div className={styles.tabsWrapper}>
            <Radio.Group value={type} buttonStyle="solid" onChange={this.handelRadioChange}>
              <Radio.Button value="0">消火栓系统</Radio.Button>
              <Radio.Button value="1">自动喷淋系统</Radio.Button>
              <Radio.Button value="2">水池/水箱</Radio.Button>
            </Radio.Group>
          </div>
          <Row className={styles.itemsWrapper}>
            {type === '0' && this.renderHydrant()}
            {type === '1' && this.rendeAuto()}
            {type === '2' && this.renderPond()}
          </Row>
        </div>
      </Section>
    );
  }
}
