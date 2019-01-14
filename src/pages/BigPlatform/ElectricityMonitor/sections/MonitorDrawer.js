import React, { Fragment, PureComponent } from 'react';

import {
  DrawerContainer,
  DrawerSection,
  OvSelect,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import { DotItem, Gauge } from '../components/Components';
import styles from './MonitorDrawer.less';

const TYPE = 'monitor';
const LABELS = ['正常', '告警', '预警', '失联'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];
const CHART_LABELS = ['A线温度', 'B相温度', 'C相温度', '零线温度', '漏电电流'];
const RANGES = ['0 ~ 150', '0 ~ 150', '0 ~ 150', '0 ~ 150', '0 ~ 1500'];
const UNITS = ['℃', '℃', '℃', '℃', 'mA'];

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
        },
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
        deviceConfig,
        deviceHistoryData,
      },
      handleSelect,
      handleClose,
    } = this.props;

    const left = (
      <Fragment>
        <div>
          <p>{companyName}</p>
          <p>{address}</p>
          <p>{`${aqy1Name} ${aqy1Phone}`}</p>
          <p>
            {[normal, earlyWarning, confirmWarning, unconnect].map((n, i) => (
              <DotItem key={i} title={LABELS[i]} color={`rgb(${COLORS[i]})`} quantity={n} />
            ))}
          </p>
        </div>
        <OvSelect cssType={2} options={devices} value={deviceId} handleChange={handleSelect} />
        <DrawerSection title="实时监测数据" >
          <div className={styles.gauges}>
            {CHART_LABELS.map((label, i) => (
              <Gauge key={label} title={label} value={0} range={RANGES[i]} unit={UNITS[i]} />
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
