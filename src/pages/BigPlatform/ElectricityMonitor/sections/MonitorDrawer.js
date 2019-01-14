import React, { Fragment, PureComponent } from 'react';

import {
  DrawerContainer,
  DrawerSection,
  OvSelect,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import { DotItem, Gauge } from '../components/Components';
import styles from './MonitorDrawer.less';
import locationIcon from '../imgs/location.png';
import personIcon from '../imgs/person.png';

const TYPE = 'monitor';
const LABELS = ['正常', '告警', '预警', '失联'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];
const CHART_LABELS = ['A相温度', 'B相温度', 'C相温度', '零线温度', '漏电电流'];
const RANGES = {
  'A相温度': [0, 150],
  'B相温度': [0, 150],
  'C相温度': [0, 150],
  '零线温度': [0, 150],
  '漏电电流': [0, 1500],
};

export default class MonitorDrawer extends PureComponent {
  render() {
    const {
      visible,
      data: {
        unitDetail: {
          companyName,
          address,
          aqy1Name,
          aqy1Phone,
        }={},
        deviceStatusCount: {
          normal=0,
          earlyWarning=0,
          confirmWarning=0,
          unconnect=0,
        },
        devices=[],
        deviceRealTimeData: {
          deviceId=undefined,
          deviceDataForAppList=[],
        },
        deviceConfig=[],
        deviceHistoryData,
      },
      handleSelect,
      handleClose,
    } = this.props;
    // 实时数据列表
    const list = [];
    deviceDataForAppList.forEach(({ desc, code, value, unit, status }) => {
      const index = CHART_LABELS.indexOf(desc);
      if (index > -1) {
        const limit = [undefined, undefined];
        deviceConfig.forEach((item) => {
          const { code: code2, level } = item;
          if (code2 === code) {
            limit[level-1] = item;
          }
        });
        list[index] = {
          desc,
          value,
          unit,
          limit,
          status,
        };
      }
    });

    console.log(devices);


    const left = (
      <Fragment>
        <div className={styles.info}>
          <p className={styles.name}>{companyName}</p>
          <p><span className={styles.location} style={{ backgroundImage: `url(${locationIcon})` }} />{address}</p>
          <p><span className={styles.person} style={{ backgroundImage: `url(${personIcon})` }} />{`${aqy1Name} ${aqy1Phone}`}</p>
          <p className={styles.dots}>
            {[normal, earlyWarning, confirmWarning, unconnect].map((n, i) => (
              <DotItem key={i} title={LABELS[i]} color={`rgb(${COLORS[i]})`} quantity={n} />
            ))}
          </p>
        </div>
        <div className={styles.select}>
          <OvSelect cssType={2} options={devices.map(({ location, area, deviceId }) => ({ value: deviceId, desc: `${area}${location}` }))} value={deviceId} handleChange={handleSelect} />
        </div>
        <DrawerSection title="实时监测数据" >
          <div className={styles.gauges}>
            {list.map(({ desc, value, unit, limit, status }, i) => (
              <Gauge key={desc} title={desc} value={value} range={RANGES[desc]} limit={limit} unit={unit} status={status} />
            ))}
          </div>
        </DrawerSection>
        <DrawerSection title="监测趋势图" >
          charts
        </DrawerSection>
      </Fragment>
    );

    return (
      <DrawerContainer
        title="报警信息"
        width={700}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={handleClose}
      />
    );
  }
}
