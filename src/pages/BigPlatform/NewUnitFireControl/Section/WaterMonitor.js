import React, { PureComponent } from 'react';
import { Radio, Row, Col } from 'antd';

import WaterCards from '../components/WaterCards';
import ChartGauge from '../components/ChartGauge';
import TabSection from './TabSection';
import styles from './WaterMonitor.less';
import waterBg from '../imgs/waterBg.png';
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

function TopNav(props) {
  const { list } = props;
  return (
    <div className={styles.topNav}>
      <div className={styles.bottomDiveder} />
      {list.map((item, index) => {
        const { name, value, color, onClick } = item;
        return (
          <div className={styles.topItem} key={index} onClick={onClick}>
            <Ellipsis lines={1} tooltip>
              {name}
              <span className={styles.number} style={{ color }}>
                {value || 0}
              </span>
            </Ellipsis>
          </div>
        );
      })}
    </div>
  );
}

export default class WaterMonitor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '101',
    };
  }

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
    if (!waterList.length) {
      return this.renderNoCards();
    }

    return waterList.map(item => {
      const { deviceDataList, status: devStatus } = item;
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
      let waterValue, color;
      if (isNotIn) {
        waterValue = '未接入';
        color = '#f83329';
      } else if (isMending) {
        waterValue = '检修中';
        color = '#f83329';
      } else if (+status < 0) {
        waterValue = '---';
        color = '#9f9f9f';
      } else {
        waterValue = value + unit || '';
        if (+status === 0) color = '#fff';
        else color = '#f83329';
      }

      return (
        <Col span={12} className={styles.gaugeCol} key={deviceId}>
          <ChartGauge
            showName={false}
            showValue={false}
            radius="90%"
            isLost={+status < 0}
            status={+status}
            isMending={isMending}
            isNotIn={isNotIn}
            name={deviceName}
            value={value || 0}
            range={isMending ? [0, 2] : [minValue || 0, maxValue || (value ? 2 * value : 5)]}
            normalRange={[normalLower, normalUpper]}
            unit={unit}
            style={{
              height: '80px',
              width: '90px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <div className={styles.infoWrapper}>
            <div className={styles.info}>
              <Ellipsis lines={1} tooltip>
                {deviceName}
              </Ellipsis>
            </div>
            <div className={styles.info} style={{ color, fontSize: '12px' }}>
              {waterValue}
            </div>
          </div>
        </Col>
      );
    });
  };

  renderPond = () => {
    const { waterList } = this.props;
    if (!waterList.length) {
      return this.renderNoCards();
    }
    return waterList.map(item => {
      const { deviceDataList, status: devStatus } = item;
      const isMending = +devStatus === -1;
      const isNotIn = !deviceDataList.length;
      const { deviceId, deviceName } = item;
      const [
        { value, status, unit, deviceParamsInfo: { normalUpper, normalLower } } = {
          deviceParamsInfo: {},
        },
      ] = deviceDataList;

      return (
        <WaterCards
          key={deviceId}
          name={deviceName}
          value={value}
          status={status}
          isMending={isMending}
          isNotIn={isNotIn}
          unit={unit}
          range={[normalLower, normalUpper]}
        />
      );
    });
  };

  render() {
    const { onClick, waterList, waterAlarm, fetchWaterSystem } = this.props;
    const { type } = this.state;

    const deviceList = waterList.filter(item => item.deviceDataList.length);
    const tabs = [
      {
        title: '消火栓系统',
        onClick: () => {
          this.setState({ type: '101' });
          fetchWaterSystem('101');
        },
      },
      {
        title: '喷淋系统',
        onClick: () => {
          this.setState({ type: '102' });
          fetchWaterSystem('102');
        },
      },
      {
        title: '水池/水箱',
        onClick: () => {
          this.setState({ type: '103' });
          fetchWaterSystem('103');
        },
      },
    ];
    const alarmNum = waterList.filter(item => {
      const { deviceDataList } = item;
      const [{ status } = { deviceParamsInfo: {} }] = deviceDataList;
      return +status > 0;
    }).length;
    const normalNum = waterList.filter(item => {
      const { deviceDataList } = item;
      const [{ status } = { deviceParamsInfo: {} }] = deviceDataList;
      return +status === 0;
    }).length;
    const lostNum = waterList.filter(item => {
      const { deviceDataList } = item;
      const [{ status } = { deviceParamsInfo: {} }] = deviceDataList;
      return +status < 0;
    }).length;
    const topData = [
      { name: '报警', value: alarmNum, color: '#f83329' },
      { name: '失联', value: lostNum, color: '#9f9f9f' },
      { name: '正常', value: normalNum, color: '#00ffff' },
    ].map((item, index) => {
      return {
        ...item,
        onClick: () => {
          onClick(index, ['101', '102', '103'].indexOf(type));
        },
      };
    });

    return (
      <TabSection tabs={tabs}>
        <div className={styles.container}>
          <TopNav list={topData} />
          <div className={styles.itemsWrapper}>
            <Row
              style={{ width: '100%' }}
              // onClick={() => {
              //   if (type === '101' && deviceList.length > 0) onClick(0, type);
              //   if (type === '102' && deviceList.length > 0) onClick(1, type);
              //   if (type === '103' && deviceList.length > 0) onClick(2, type);
              // }}
            >
              {type === '101' && this.renderHydrant()}
              {type === '102' && this.renderHydrant()}
              {type === '103' && this.renderPond()}
            </Row>
          </div>
        </div>
      </TabSection>
    );
  }
}
