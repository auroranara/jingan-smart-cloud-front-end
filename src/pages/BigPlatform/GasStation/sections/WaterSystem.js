import React, { PureComponent } from 'react';

import styles from './WaterSystem.less';
import { Section } from './Components';
import { Gauge, LossDevice, PolarBar, WaterTank } from '../components/Components';
import { isGauge } from '../utils';

const CATEGORIES = ['消火栓系统', '喷淋系统', '水池/水箱'];
const TYPES = [101, 102, 103];

export default class WaterSystem extends PureComponent {
  render() {
    const { onClick, data, showWaterItemDrawer } = this.props;
    const { pond, spray, hydrant } = data;
    const lists = [hydrant, spray, pond].map(lst => lst.filter(item => item.deviceDataList && item.deviceDataList.length));
    const waterLists = lists.map((lst, i) => ({ name: CATEGORIES[i], type: TYPES[i], index: i, list: lst })).filter(({ list }) => list.length);
    let title = null;
    let child = <PolarBar lists={waterLists} handleClick={onClick} />;
    const isSingle = waterLists.length === 1 && waterLists[0].list.length === 1;
    if (isSingle) {
      const item = waterLists[0].list[0];
      const { area, location, deviceName, deviceDataList } = item;
      const dataItem = deviceDataList[0];
      const { status, updateTime } = dataItem;
      title = (
        <p className={styles.title}>
          <span className={styles.icon} />
          {deviceName}({area}{location})
        </p>
      )
      if (+status === -1)
        child = <LossDevice time={updateTime} />;
      else {
        const handleClick = e => showWaterItemDrawer(item);
        child = isGauge(waterLists[0].index) ? (
          <Gauge data={dataItem} onClick={handleClick} />
        ) : (
          <WaterTank
            data={dataItem}
            onClick={handleClick}
            tankClassName={styles.tank}
          />
        );
      }
    }

    return (
      <Section title="消防水系统">
        <div className={styles.container}>
          {child}
          {title}
        </div>
      </Section>
    );
  }
}
