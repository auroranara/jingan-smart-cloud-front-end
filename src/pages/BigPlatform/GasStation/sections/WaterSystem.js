import React, { PureComponent } from 'react';

import styles from './WaterSystem.less';
import { Section } from './Components';
import { PolarBar, WaterTank } from '../components/Components';

const CATEGORIES = ['消火栓系统', '喷淋系统', '水池/水箱'];
const TYPES = [101, 102, 103];

export default class WaterSystem extends PureComponent {
  // state = { deep: 0 };

  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState({ deep: Math.floor(Math.random() * 50) / 10 });
  //   }, 5000);
  // }

  render() {
    const { onClick, data } = this.props;
    // const { deep } = this.state;
    const { pond, spray, hydrant } = data;
    // const clicks = [101, 102, 103].map((type, i) => e => onClick(i, type));
    const lists = [hydrant, spray, pond].map(lst => lst.filter(item => item.deviceDataList && item.deviceDataList.length));
    const waterLists = lists.map((lst, i) => ({ name: CATEGORIES[i], type: TYPES[i], index: i, list: lst })).filter(({ list }) => list.length);
    let child = <PolarBar lists={waterLists} handleClick={onClick} />;
    if (waterLists.length === 1 && waterLists[0].list.length === 1) {
      const { deviceDataList: [{ value, status, unit, deviceParamsInfo: { normalLower, normalUpper, maxValue } }] } = waterLists[0].list[0];
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
        />
      );
    }

    return (
      <Section title="水系统">
        <div className={styles.container}>
          {child}
        </div>
      </Section>
    );
  }
}
