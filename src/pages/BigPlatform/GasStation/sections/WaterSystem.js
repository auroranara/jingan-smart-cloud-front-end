import React, { PureComponent } from 'react';

import styles from './WaterSystem.less';
import { Section } from './Components';
import { WaterTank } from '../components/Components';

export default class WaterSystem extends PureComponent {
  render() {
    const { onClick, waterList, waterAlarm } = this.props;
    const clicks = [101, 102, 103].map((type, i) => e => onClick(i, type));
    const deviceList = waterList.filter(item => item.deviceDataList.length);

    return (
      <Section title="水系统">
        <div className={styles.container} onClick={clicks[2]}>
          <WaterTank />
        </div>
      </Section>
    );
  }
}
