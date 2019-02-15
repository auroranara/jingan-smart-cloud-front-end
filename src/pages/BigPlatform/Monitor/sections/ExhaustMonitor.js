import React, { PureComponent } from 'react';
import { Row, Col, Select } from 'antd';
import moment from 'moment';

import styles from './ExhaustMonitor.less';
import ExhaustCards from '../components/ExhaustCards';
import ExSection from './ExSection';

import timeIcon from '../imgs/timeIcon.png';
import waterBg from '../imgs/waterBg.png';

const Option = Select.Option;

const warningColor = 'rgb(200, 70, 70)';

function getDayTime(t) {
  return moment(t).format('YYYY-MM-DD');
}

function getTime(t) {
  return moment(t).format('HH:mm:ss');
}

export default class ExhaustMonitor extends PureComponent {
  // state = {
  //   day: moment().format('YYYY-MM-DD'),
  //   time: moment().format('HH:mm:ss'),
  // };
  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState({
  //       day: moment().format('YYYY-MM-DD'),
  //       time: moment().format('HH:mm:ss'),
  //     });
  //   }, 5 * 60 * 1000);
  // }

  render() {
    const {
      selectVal,
      handleSelect,
      data: {
        exhaustCompanyDevicesData: { list = [] },
        exhaustDeviceConfig: { list: params = [] },
        exhaustRealTimeData: { status, updateTime, realTimeData = {}, unnormalCodes = [] },
      },
    } = this.props;

    let rtData = realTimeData;
    if (status === '-1') rtData = {};

    const handledParams = params.map(({ id, code, desc, unit }) => ({
      id,
      desc,
      unit,
      value: rtData[code],
      isBeyond: unnormalCodes.includes(code),
    }));

    const sectionStyle = {
      boxShadow: `0 0 1.1em rgba(${
        status === '1' || status === '2' ? '200,70,70' : '9,103,211'
      }, 0.9) inset`,
    };

    return (
      <ExSection title="废气监测" style={sectionStyle}>
        {list && list.length ? (
          <section className={styles.container}>
            <span className={styles.selectIcon}>
              <Select
                value={selectVal}
                onSelect={handleSelect}
                dropdownClassName={styles.selectDropDown}
              >
                {list.map(({ deviceId, area, location }) => (
                  <Option key={deviceId}>{`${area}：${location}`}</Option>
                ))}
              </Select>
            </span>
            <Row span={24} style={{ height: '12%' }}>
              <Col span={24} style={{ height: '100%' }}>
                <div className={styles.timeSection}>
                  <span
                    className={styles.timeIcon}
                    style={{ backgroundImage: `url(${timeIcon})` }}
                  />
                  <span className={styles.day}>{getDayTime(updateTime)}</span>
                  <span className={styles.min}>{getTime(updateTime)}</span>
                </div>
              </Col>
            </Row>
            <div className={styles.oneCards}>
              <Row gutter={14} style={{ margin: 0, height: '100%' }}>
                {handledParams.map((item, index) => {
                  const { id, desc, unit, value, isBeyond } = item;
                  return (
                    <Col key={id} style={{ height: '100%' }} span={6}>
                      <ExhaustCards
                        num={value}
                        unit={unit}
                        title={desc}
                        color={isBeyond ? warningColor : null}
                      />
                    </Col>
                  );
                })}
              </Row>
            </div>
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
