import React, { PureComponent } from 'react';
import { Row, Col, Radio } from 'antd';
import Section from '../components/Section/Section.js';
import ChartGauge from '../components/ChartGauge';
import styles from './WaterMonitor.less';
import pondAbnormal from '../images/pond-abnormal.png';
import pondNormal from '../images/pond-normal.png';

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
export default class FireHostMonitoring extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '101',
    };
  }

  handelChange = item => {
    const { fetchCompanyDevicesByType } = this.props;
    const {
      target: { value },
    } = item;
    fetchCompanyDevicesByType(value);
    this.setState({ type: value });
  };

  renderTabs = () => {
    const { type } = this.state;
    return (
      <div className={styles.tabsWrapper}>
        <Radio.Group value={type} buttonStyle="solid" onChange={this.handelChange}>
          <Radio.Button value="101">消火栓系统</Radio.Button>
          <Radio.Button value="102">自动喷淋系统</Radio.Button>
          <Radio.Button value="103">水池/水箱</Radio.Button>
        </Radio.Group>
      </div>
    );
  };

  renderHydrant = () => {
    const {
      data: { '101': list = [] },
    } = this.props;
    if (!list.length) {
      return (
        <div
          style={{
            width: '100%',
            height: '135px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#4f678d',
          }}
        >
          暂无相关监测数据
        </div>
      );
    }
    return list.map(item => {
      const { deviceDataList } = item;
      if (!deviceDataList.length) return null;
      const { deviceId, deviceName } = item;
      const [
        {
          value,
          status,
          deviceParamsInfo: { minValue, maxValue, normalUpper, normalLower },
        },
      ] = deviceDataList;
      return (
        <Col span={12} key={deviceId}>
          <ChartGauge
            showName
            showValue
            isLost={+status < 0}
            name={deviceName}
            value={value || 0}
            range={[minValue || 0, maxValue || value || 5]}
            normalRange={[normalLower, normalUpper]}
          />
        </Col>
      );
    });
  };

  renderPistol = () => {
    const {
      data: { '102': list = [] },
    } = this.props;
    if (!list.length) {
      return (
        <div
          style={{
            width: '100%',
            height: '135px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#4f678d',
          }}
        >
          暂无相关监测数据
        </div>
      );
    }
    return list.map(item => {
      const { deviceDataList } = item;
      if (!deviceDataList.length) return null;
      const { deviceId, deviceName } = item;
      const [
        {
          value,
          status,
          deviceParamsInfo: { minValue, maxValue, normalUpper, normalLower },
        },
      ] = deviceDataList;
      return (
        <Col span={12} key={deviceId}>
          <ChartGauge
            showName
            showValue
            isLost={+status < 0}
            name={deviceName}
            value={value || 0}
            range={[minValue || 0, maxValue || (value ? 2 * value : 5)]}
            normalRange={[normalLower, normalUpper]}
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
    const { handleDrawerVisibleChange, loading, fetchCompanyDevicesByType } = this.props;
    const { type } = this.state;
    return (
      <Section
        title="水系统监测"
        scrollProps={{ className: styles.waterScroll, autoHide: true }}
        // spinProps={{ loading }}
      >
        <div className={styles.WaterMonitor}>
          {this.renderTabs()}
          <Row
            className={styles.itemsWrapper}
            onClick={() => {
              handleDrawerVisibleChange(waterSys[type].code);
            }}
          >
            {type === '101' && this.renderHydrant()}
            {type === '102' && this.renderPistol()}
            {type === '103' && this.renderPond()}
          </Row>
        </div>
      </Section>
    );
  }
}
