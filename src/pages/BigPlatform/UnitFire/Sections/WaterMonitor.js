import React, { PureComponent } from 'react';
import { Row, Col, Radio } from 'antd';
import Section from '../components/Section/Section.js';
import ChartGauge from '../components/ChartGauge';
import styles from './WaterMonitor.less';
import pondAbnormal from '../images/pond-abnormal.png';
import pondNormal from '../images/pond-normal.png';
import pondLost from '../images/pond-lost.png';
import waterBg from '../images/waterBg.png';
import Ellipsis from '@/components/Ellipsis';

const waterSys = {
  '101': {
    name: '消火栓系统',
    code: 'hydrant',
  },
  '102': {
    name: '喷淋系统',
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
    const { data } = this.props;
    return (
      <div className={styles.tabsWrapper}>
        <Radio.Group value={type} buttonStyle="solid" onChange={this.handelChange}>
          {['101', '102', '103'].map(val => {
            const isAlarm =
              Array.isArray(data[val]) &&
              !!data[val].filter(item => {
                const { deviceDataList } = item;
                if (!deviceDataList.length) return false;
                const [{ status }] = deviceDataList;
                if (+status === 0) return false;
                else return true;
              }).length;
            return (
              <Radio.Button value={val} className={isAlarm ? styles.tabAlarm : undefined}>
                {waterSys[val].name}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      </div>
    );
  };

  renderNoCards = () => {
    return (
      <div
        className={styles.noCards}
        style={{
          background: `url(${waterBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'auto 50%',
        }}
      />
    );
  };

  renderHydrant = () => {
    const {
      data: { '101': list = [] },
    } = this.props;
    if (!list.filter(item => item.deviceDataList.length).length) {
      return this.renderNoCards();
    }
    return list.map(item => {
      const { deviceDataList, status: devStatus } = item;
      // if (!deviceDataList.length) return null;
      const isMending = +devStatus === -1;
      const isNotIn = !deviceDataList.length;
      const { deviceId, deviceName } = item;
      const [
        {
          value,
          status,
          unit,
          deviceParamsInfo: { minValue, maxValue, normalUpper, normalLower },
        } = { deviceParamsInfo: {} },
      ] = deviceDataList;
      return (
        <Col span={12} key={deviceId}>
          <ChartGauge
            showName={false}
            showValue
            isLost={+status < 0}
            status={+status}
            isNotIn={isNotIn}
            isMending={isMending}
            name={deviceName}
            value={value || 0}
            range={isMending ? [0, 2] : [minValue || 0, maxValue || (value ? 2 * value : 5)]}
            normalRange={[normalLower, normalUpper]}
            unit={unit}
          />
          <div
            style={{
              padding: '0 8px',
              textAlign: 'center',
              lineHeight: '20px',
              marginTop: '-20px',
            }}
          >
            <Ellipsis lines={1} tooltip>
              {deviceName}
            </Ellipsis>
          </div>
        </Col>
      );
    });
  };

  renderPistol = () => {
    const {
      data: { '102': list = [] },
    } = this.props;
    if (!list.filter(item => item.deviceDataList.length).length) {
      return this.renderNoCards();
    }
    return list.map(item => {
      const { deviceDataList, status: devStatus } = item;
      // if (!deviceDataList.length) return null;
      const isMending = +devStatus === -1;
      const isNotIn = !deviceDataList.length;
      const { deviceId, deviceName } = item;
      const [
        {
          value,
          status,
          unit,
          deviceParamsInfo: { minValue, maxValue, normalUpper, normalLower },
        } = { deviceParamsInfo: {} },
      ] = deviceDataList;
      return (
        <Col span={12} key={deviceId}>
          <ChartGauge
            showName={false}
            showValue
            isLost={+status < 0}
            status={+status}
            isMending={isMending}
            isNotIn={isNotIn}
            name={deviceName}
            value={value || 0}
            range={isMending ? [0, 2] : [minValue || 0, maxValue || (value ? 2 * value : 5)]}
            normalRange={[normalLower, normalUpper]}
            unit={unit}
          />
          <div
            style={{
              padding: '0 8px',
              textAlign: 'center',
              lineHeight: '20px',
              marginTop: '-20px',
            }}
          >
            <Ellipsis lines={1} tooltip>
              {deviceName}
            </Ellipsis>
          </div>
        </Col>
      );
    });
  };

  renderPond = () => {
    const {
      data: { '103': list = [] },
    } = this.props;
    if (!list.filter(item => item.deviceDataList.length).length) {
      return this.renderNoCards();
    }
    return list.map(item => {
      const { deviceDataList, status: devStatus } = item;
      const isMending = +devStatus === -1;
      const isNotIn = !deviceDataList.length;
      const { deviceId, deviceName } = item;
      const [
        { value, status, deviceParamsInfo: { normalUpper, normalLower }, unit } = {
          deviceParamsInfo: {},
        },
      ] = deviceDataList;
      const isGray = isMending || isNotIn || (!isMending && +status < 0);
      const rangeStr =
        (!normalLower && normalLower !== 0) || (!normalUpper && normalUpper !== 0)
          ? '暂无'
          : `${normalLower}~${normalUpper}${unit}`;
      const isLost = +status < 0;
      return (
        <Col
          span={24}
          className={styles.pondWrapper}
          key={deviceId}
          style={{ color: isGray ? '#bbbbbc' : '#fff' }}
        >
          {isMending && <div className={styles.pondStatus}>检修</div>}
          {isNotIn && <div className={styles.pondStatus}>未接入</div>}
          {!isMending && !isNotIn && +status !== 0 && <div className={styles.pondStatus}>异常</div>}
          {/* {+status !== 0 && <div className={styles.pondStatus}>异常</div>} */}
          <img
            src={isGray ? pondLost : !isMending && +status === 0 ? pondNormal : pondAbnormal}
            alt="pond"
          />
          <div className={styles.infoWrapper}>
            <div className={styles.name}>{deviceName}</div>
            <Row>
              <Col span={12}>
                当前水位：
                <span
                  style={{
                    color: isGray ? '#bbbbbc' : !isMending && +status === 0 ? '#fff' : '#f83329',
                  }}
                >
                  {isGray || (!value && value !== 0) ? '---' : value + unit}
                </span>
              </Col>
              <Col span={12}>
                参考范围：
                {isNotIn ? '暂无' : rangeStr}
              </Col>
            </Row>
          </div>
        </Col>
      );
    });
  };

  render() {
    const { handleDrawerVisibleChange, data } = this.props;
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
              const list = data[type] || [];
              if (!list.filter(item => item.deviceDataList.length).length) {
                return null;
              }
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
