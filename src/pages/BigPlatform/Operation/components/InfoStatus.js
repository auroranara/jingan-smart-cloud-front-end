import React, { PureComponent } from 'react';

import styles from './InfoStatus.less';
import { BAR_COLORS as COLORS, COUNT_BASE_KEY, COUNT_LABELS, GAS, TYPE_COUNTS, TYPE_KEYS, getStatuses, getStatusImg } from '../utils';
import {
  elecGreen,
  elecGrey,
  elecRed,
  gasGreen,
  gasGrey,
  gasRed,
  gasYellow,
  hostGreen,
  hostYellow,
  hostRed,
  smokeGreen,
  smokeYellow,
  smokeGrey,
  smokeRed,
  waterGreen,
  waterGrey,
  waterRed,
} from '../imgs/links';

const WIDTH = 60;
const IMGS_LIST = [
  [hostRed, hostYellow, undefined, hostGreen],
  [smokeRed, smokeYellow, smokeGrey, smokeGreen],
  [elecRed, undefined, elecGrey, elecGreen],
  [gasRed, gasYellow, gasGrey, gasGreen],
  [waterRed, undefined, waterGrey, waterGreen],
];

function StatusBar(props) {
  const { deviceType, data } = props;
  const typeCount = TYPE_COUNTS[deviceType].slice(1);
  const list = data.map((n, i) => typeCount[i] ? ({ label: COUNT_LABELS[i + 1], color: COLORS[i], value: n }) : null).filter(item => item && item.value);
  const width = list.length * WIDTH;
  return (
    <div className={styles.bar} style={{ width }}>
      <span className={styles.inner}>
        {list.reduce((prev, next) => {
          if (next) {
            const { label, color, value } = next;
            prev.push(
              <span className={styles.item} key={label}>
                <span className={styles.dot} style={{ backgroundColor: color }} />
                <span className={styles.label}>{label}</span>
                {value}
              </span>
            );
          }
          return prev;
        }, [])}
      </span>
    </div>
  )
}

export default class InfoStatus extends PureComponent {
  render() {
    const { data } = this.props;
    const statuses = getStatuses(data);
    return(
      <div className={styles.container}>
        {TYPE_KEYS.slice(1).map((k, i) => {
          const typeKey = `${k}${COUNT_BASE_KEY}`;
          const stses = statuses[i];
          if (data[typeKey] && i !== GAS - 1)
            return (
              <div key={k} className={styles[k]} style={{ backgroundImage: `url(${getStatusImg(stses, IMGS_LIST[i])})` }}>
                <StatusBar deviceType={i + 1} data={stses.slice(0, 3)} />
              </div>
            );
          return null;
        })}
      </div>
    )
  }
}
