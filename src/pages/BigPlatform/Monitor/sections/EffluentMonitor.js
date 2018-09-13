import React from 'react';
import { Row, Col, Select } from 'antd';
import moment from 'moment';

import styles from './EffluentMonitor.less';
import ExSection from './ExSection';
import WasteWaterWave from '../components/WasteWaterWave/index';

import timeIcon from '../imgs/timeIcon.png';
import waterBg from '../imgs/waterBg.png';

const Option = Select.Option;

const warningColor = 'rgb(200, 70, 70)';
const defaultColor = 'rgb(9,103,211)';

function getDayTime(t) {
  return moment(t).format('YYYY-MM-DD');
}

function getTime(t) {
  return moment(t).format('HH:mm:ss');
}

export default function EffluentMonitor(props) {
  const {
    selectVal,
    handleSelect,
    data: {
      waterCompanyDevicesData: { list = [] },
      waterDeviceConfig: { list: params = [] },
      waterRealTimeData: { status, updateTime, realTimeData = {}, unnormalCodes = [] },
    },
  } = props;

  let rtData = realTimeData;
  if (status === '0') rtData = {};

  const handledParams = params.map(({ id, code, desc, unit }) => ({
    id,
    desc,
    unit,
    value: rtData[code],
    isBeyond: unnormalCodes.includes(code),
  }));

  const sectionStyle = {
    boxShadow: `0 0 1.1em rgba(${status === '2' ? '200,70,70' : '9,103,211'}, 0.9) inset`,
  };

  return (
    <ExSection title="废水监测" style={sectionStyle}>
      {list && list.length ? (
        <section className={styles.container}>
          <div className={styles.selectIcon}>
            <Select
              value={selectVal}
              onSelect={handleSelect}
              dropdownClassName={styles.selectDropDown}
            >
              {list.map(({ deviceId, area, location }) => (
                <Option key={deviceId}>{`${area}：${location}`}</Option>
              ))}
            </Select>
          </div>
          <Row span={24} style={{ height: '12%' }}>
            <Col span={24} style={{ height: '100%' }}>
              <div className={styles.timeSection}>
                <span className={styles.timeIcon} style={{ backgroundImage: `url(${timeIcon})` }} />
                <span className={styles.day}>{getDayTime(updateTime)}</span>
                <span className={styles.min}>{getTime(updateTime)}</span>
              </div>
            </Col>
          </Row>
          {[0, 1].map(i => (
            <div key={i} className={styles.cards}>
              <Row gutter={24} style={{ margin: 0, height: '100%' }}>
                {[0, 1, 2].map(index => {
                  let item = handledParams[3 * i + index];
                  if (item) {
                    const { id, desc, unit, value, isBeyond } = item;
                    return (
                      <Col key={id} style={{ height: '100%' }} span={8}>
                        {value && (
                          <WasteWaterWave
                            height={110}
                            percent={34}
                            title={desc}
                            num={value}
                            unit={unit}
                            color={isBeyond ? warningColor : defaultColor}
                          />
                        )}
                      </Col>
                    );
                  } else return null;
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
