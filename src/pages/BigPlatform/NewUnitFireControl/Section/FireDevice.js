import React, { PureComponent } from 'react';
import { Radio, Row, Col } from 'antd';

import WaterCards from '../components/WaterCards';
import ChartGauge from '../components/ChartGauge';
import Section from '../Section';
import styles from './FireDevice.less';
import waterBg from '../imgs/waterBg.png';

const waterSys = {
  '101': {
    name: '消火栓系统',
    code: 'hydrant',
  },
  '102': {
    name: '自动喷淋系统',
    code: 'pistol',
  },
  '103': {
    name: '水池/水箱',
    code: 'pond',
  },
};

export default class FireDevice extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '101',
    };
  }

  // 切换状态
  handelRadioChange = item => {
    const { fetchWaterSystem } = this.props;
    const {
      target: { value },
    } = item;
    this.setState({ type: value });
    fetchWaterSystem(value);
  };

  renderNoCards = () => {
    return (
      <div
        className={styles.noCards}
        style={{
          background: `url(${waterBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'auto 80%',
        }}
      />
    );
  };

  renderHydrant = () => {
    const { waterList } = this.props;
    if (!waterList.filter(item => item.deviceDataList.length).length) {
      return this.renderNoCards();
    }

    return waterList.map(item => {
      const { deviceDataList } = item;
      if (!deviceDataList.length) return null;
      const { deviceId, deviceName } = item;
      const [
        {
          value,
          status,
          unit,
          deviceParamsInfo: { minValue, maxValue, normalUpper, normalLower },
        },
      ] = deviceDataList;

      return (
        <Col span={12} className={styles.gaugeCol} key={deviceId}>
          <ChartGauge
            showName
            showValue
            radius="70%"
            isLost={+status < 0}
            status={+status}
            name={deviceName}
            value={value || 0}
            range={[minValue || 0, maxValue || (value ? 2 * value : 5)]}
            normalRange={[normalLower, normalUpper]}
            unit={unit}
          />
        </Col>
      );
    });
  };

  renderPond = () => {
    const { waterList } = this.props;
    if (!waterList.filter(item => item.deviceDataList.length).length) {
      return this.renderNoCards();
    }
    return waterList.map(item => {
      const { deviceDataList } = item;
      if (!deviceDataList.length) return null;
      const { deviceId, deviceName } = item;
      const [
        {
          value,
          status,
          unit,
          deviceParamsInfo: { normalUpper, normalLower },
        },
      ] = deviceDataList;

      return (
        <WaterCards
          key={deviceId}
          name={deviceName}
          value={value}
          status={status}
          unit={unit}
          range={[normalLower, normalUpper]}
        />
      );
    });
  };

  render() {
    const { onClick, waterList, waterAlarm } = this.props;
    const { type } = this.state;

    const deviceList = waterList.filter(item => item.deviceDataList.length);

    return (
      <Section title="水系统">
        <div className={styles.container}>
          <div className={styles.tabsWrapper}>
            <Radio.Group value={type} buttonStyle="solid" onChange={this.handelRadioChange}>
              {['101', '102', '103'].map((val, index) => {
                // const isAlarm =
                //   Array.isArray(waterList) &&
                //   !!waterList.filter(item => {
                //     const { deviceDataList } = item;
                //     if (!deviceDataList.length) return false;
                //     const [{ status }] = deviceDataList;
                //     if (+status === 0) return false;
                //     else return true;
                //   }).length;
                return (
                  <Radio.Button
                    value={val}
                    className={waterAlarm[index] ? styles.tabAlarm : undefined}
                  >
                    {waterSys[val].name}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </div>
          <Row
            className={styles.itemsWrapper}
            onClick={() => {
              if (type === '101' && deviceList.length > 0) onClick(0, type);
              if (type === '102' && deviceList.length > 0) onClick(1, type);
              if (type === '103' && deviceList.length > 0) onClick(2, type);
            }}
          >
            {type === '101' && this.renderHydrant()}
            {type === '102' && this.renderHydrant()}
            {type === '103' && this.renderPond()}
          </Row>
        </div>
      </Section>
    );
  }
}
