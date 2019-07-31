import React, { PureComponent } from 'react';

import styles from './InfoStatus.less';
import { BAR_COLORS as COLORS, COUNT_BASE_KEY, COUNT_KEYS, COUNT_LABELS as LABELS, TYPE_KEYS, TYPE_COUNTS, getStatuses, getStatusImg } from '../utils';
import { hostGreen, hostYellow, hostRed, smokeGreen, smokeYellow, smokeGrey, smokeRed } from '../imgs/links';

const WIDTH = 60;
const IMGS_LIST = [
  [hostRed, hostYellow, undefined, hostGreen],
  [smokeRed, smokeYellow, smokeGrey, smokeGreen],
  [],
  [],
  [],
];

function StatusBar(props) {
  const { data } = props;
  const width = data.filter(n => n).length * WIDTH;
  return (
    <div className={styles.bar} style={{ width }}>
      <span className={styles.inner}>
        {data.reduce((prev, next, i) => {
          const label = LABELS[i];
          if (next)
            prev.push(
              <span className={styles.item} key={label}>
                <span className={styles.dot} style={{ backgroundColor: COLORS[i] }} />
                <span className={styles.label}>{label}</span>
                {next}
              </span>
            );
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
          if (data[typeKey])
            return (
              <div key={k} className={styles[k]} style={{ backgroundImage: `url(${getStatusImg(statuses, IMGS_LIST[i])})` }}>
                <StatusBar data={statuses} />
              </div>
            );
          return null;
        })}
      </div>
    )
  }
}
