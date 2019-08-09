import React, { Fragment } from 'react';

import styles from './GasMonitor.less';
import { DrawerSection, Gauge, TrendChart } from './Components';

const GAS_CODE = 'value';
const ARM_CODE = '_arm_status';
const GAS_STATUS = {
  '-20': '关闭',
  '-21': '打开',
  '-22': '未连接',
  '-23': '正在打开',
  '-24': '正在关闭',
  '-25': '故障',
};

export default function GasMonitor(props) {
  const { data: { item, history } } = props;
  const { area, location, companyName, deviceName, deviceDataForAppList } = item;
  const list = Array.isArray(deviceDataForAppList) ? deviceDataForAppList : [];
  const dataItem = list.find(({ code }) => code === GAS_CODE) || {};
  const arm = list.find(({ code }) => code === ARM_CODE);

  return (
    <Fragment>
      <DrawerSection
        title="实时监测数据"
        style={{ padding: 0 }}
      >
        <div className={styles.gauge}>
          <Gauge data={dataItem} />
        </div>
        {arm && arm.value && <p className={styles.arm}>机械臂状态：{GAS_STATUS[arm.value]}</p>}
      </DrawerSection>
      <DrawerSection
        title="当天监测数据趋势"
        style={{ padding: '10px 0 0 0' }}
      >
        <TrendChart
          data={{ params: dataItem, history }}
        />
      </DrawerSection>
    </Fragment>
  );
}
