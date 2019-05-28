import React, { PureComponent } from 'react';
import { Row, Col, Select } from 'antd';
import Ellipsis from 'components/Ellipsis';
import Section from '../Section';
import styles from './ElectricityMonitor.less';
import ampereAlarm from '../imgs/ampere-alarm.png';
import ampereLost from '../imgs/ampere-lost.png';
import ampereNormal from '../imgs/ampere-normal.png';
import voltAlarm from '../imgs/volt-alarm.png';
import voltLost from '../imgs/volt-lost.png';
import voltNormal from '../imgs/volt-normal.png';
import tempAlarm from '../imgs/temp-alarm.png';
import tempLost from '../imgs/temp-lost.png';
import tempNormal from '../imgs/temp-normal.png';

/**
 * description: 独立烟感监测
 */
const { Option } = Select;
const emptyIcon = 'http://data.jingan-china.cn/v2/big-platform/monitor/com/waterBg1.png';
const strs = ['电压', '电流', '温度'];
const imgs = [
  [voltAlarm, ampereAlarm, tempAlarm],
  [voltLost, ampereLost, tempLost],
  [voltNormal, ampereNormal, tempNormal],
];
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

export default class ElectricityMonitor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
    };
  }

  renderSelect = () => {
    const { devices } = this.props;
    const { active } = this.state;
    return devices.length > 0 ? (
      <Select
        value={devices[active].deviceId || ''}
        onSelect={this.handleSelect}
        className={styles.select}
        dropdownClassName={styles.dropDown}
      >
        {devices.map(item => {
          const { location, area, deviceId } = item;
          return (
            <Option
              key={deviceId}
              value={deviceId}
              data={item}
              style={{
                color:
                  devices[active].deviceId && devices[active].deviceId === deviceId && '#00ffff',
              }}
            >
              {area + location}
            </Option>
          );
        })}
      </Select>
    ) : null;
  };

  handleSelect = (id, { props: { data } }) => {
    const { handleFetchRealTimeData, devices } = this.props;
    this.setState({ active: devices.map(item => item.deviceId).indexOf(id) });
    handleFetchRealTimeData(id);
  };

  renderItems = () => {
    const {
      deviceRealTimeData: { deviceId = undefined, deviceDataForAppList = [] },
    } = this.props;

    return deviceDataForAppList.length > 0 ? (
      <Row>
        {deviceDataForAppList.map((item, index) => {
          const { desc, unit, status, value } = item;
          const imgIndex = strs.indexOf(desc.substr(-2));
          let img, color;
          switch (+status) {
            case 1:
            case 2:
              color = '#f83329';
              img = imgs[0][imgIndex];
              break;
            case -1:
              color = '#9f9f9f';
              img = imgs[1][imgIndex];
              break;
            case 0:
              color = '#00ffff';
              img = imgs[2][imgIndex];
              break;
            default:
          }
          return (
            <Col span={12} key={index}>
              <div className={styles.deviceWrapper}>
                <div className={styles.deviceImg}>
                  <img src={img} alt="smokeImg" />
                </div>
                <div className={styles.infoWrapper}>
                  <div className={styles.info}>
                    <Ellipsis lines={1} tooltip>
                      {desc || '暂无信息'}
                    </Ellipsis>
                  </div>
                  <div className={styles.info} style={{ color }}>
                    {value && status !== -1 ? value + unit : '失联'}
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `url(${emptyIcon}) center center / 40% auto no-repeat`,
        }}
      />
    );
  };

  render() {
    const {
      devices,
      deviceStatusCount: {
        normal = 0,
        earlyWarning = 0,
        confirmWarning = 0,
        unconnect = 0,
        list: deviceList,
      },
      onClick,
    } = this.props;
    const topData = [
      {
        name: '报警',
        value: confirmWarning + earlyWarning,
        color: '#f83329',
        deviceIds: deviceList.filter(item => +item.status > 0).map(item => item.deviceId),
      },
      {
        name: '失联',
        value: unconnect,
        color: '#9f9f9f',
        deviceIds: deviceList.filter(item => +item.status === -1).map(item => item.deviceId),
      },
      {
        name: '正常',
        value: normal,
        color: '#00ffff',
        deviceIds: deviceList.filter(item => +item.status === 0).map(item => item.deviceId),
      },
    ].map((item, index) => {
      return {
        ...item,
        onClick: () => {
          onClick(index, item.deviceIds[0]);
        },
      };
    });

    return (
      <Section title="电气火灾监测">
        <div className={styles.container}>
          <TopNav list={topData} />
          {this.renderSelect()}
          <div className={styles.scrollContainer}>{this.renderItems()}</div>
        </div>
      </Section>
    );
  }
}
