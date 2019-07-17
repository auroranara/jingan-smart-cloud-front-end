import React, { PureComponent } from 'react';

import styles from './WaterSystem.less';
import { Section } from './Components';
import { LossDevice, PolarBar, WaterTank } from '../components/Components';

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
      const { area, location, deviceName, deviceDataList: [{ value, status, updateTime, unit, deviceParamsInfo: { normalLower, normalUpper, maxValue } }] } = item;
      title = (
        <p className={styles.title}>
          <span className={styles.icon} />
          {deviceName}({area}{location})
        </p>
      )
      if (+status === -1)
        child = <LossDevice time={updateTime} />;
      else {
        child = (
          <WaterTank
            className={styles.tank}
            status={+status}
            dy={30}
            width={200}
            height={200}
            value={value}
            size={[100, 150]}
            limits={[normalLower, normalUpper]}
            range={maxValue}
            unit={unit}
            onClick={e => showWaterItemDrawer(item)}
          />
        );
      }
    }

    return (
      <Section title="水系统">
        <div className={styles.container}>
          {child}
          {title}
        </div>
      </Section>
    );
  }
}
