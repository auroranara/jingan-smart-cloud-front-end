import React, { PureComponent } from 'react';

import styles from './WaterSystem.less';
import { Section } from './Components';
import { GasEmpty, Gauge, LossDevice, PolarBar, WaterTank } from '../components/Components';
import { isGauge, getStatusDesc } from '../utils';
import { pondIcon, sprayIcon, hydrantIcon } from '../imgs/links';

const CATEGORIES = ['消火栓系统', '喷淋系统', '水池/水箱'];
const TYPES = [101, 102, 103];
const ICONS = [hydrantIcon, sprayIcon, pondIcon];

export default class WaterSystem extends PureComponent {
  render() {
    const { onClick, data, showWaterItemDrawer } = this.props;
    const { pond, spray, hydrant } = data;
    const lists = [hydrant, spray, pond].map(lst => lst.filter(item => item.deviceDataList && item.deviceDataList.length));
    const waterLists = lists.map((lst, i) => ({ name: CATEGORIES[i], type: TYPES[i], index: i, list: lst })).filter(({ list }) => list.length);
    let title = null;
    let alarm = null;
    let child = <GasEmpty />;
    let containerClass = styles.container;
    if (waterLists.length === 1 && waterLists[0].list.length === 1) {
      const { list: [item], index } = waterLists[0];
      const { deviceName, deviceDataList } = item;
      const dataItem = deviceDataList[0];
      const { status, updateTime, value, deviceParamsInfo: { normalLower, normalUpper, minValue, maxValue } } = dataItem;
      const sts = +status;
      title = (
        <p className={styles.title}>
          <span className={styles.icon} style={{ backgroundImage: `url(${ICONS[index]})` }} />
          {deviceName}
        </p>
      )
      if (sts > 0) {
        alarm = (
          <div className={styles.lightContainer}>
            <div className={styles.alarm} />
            <p className={styles.desc}>
              {index === 2 ? `水位过${getStatusDesc(value, [[normalLower, normalUpper], [minValue, maxValue]], ['低', '高'])}` : '报警'}
            </p>
          </div>
        );
      }
      const handleClick = e => showWaterItemDrawer(item, index);
      if (sts === -1) {
        containerClass = styles.container1;
        child = <LossDevice time={updateTime} onClick={handleClick} />;
      }
      else {
        child = isGauge(index) ? (
          <Gauge data={dataItem} onClick={handleClick} />
        ) : (
          <WaterTank
            data={dataItem}
            onClick={handleClick}
            tankClassName={styles.tank}
          />
        );
      }
    } else if (waterLists.length)
      child = <PolarBar max={12} lists={waterLists} handleClick={onClick} />;

    return (
      <Section title="消防水系统">
        <div className={containerClass}>
          {child}
          {title}
          {alarm}
        </div>
      </Section>
    );
  }
}
