import React, { PureComponent } from 'react';

import styles from './InfoStatus.less';
import { getStatusImg } from '../utils';
import { hostGreen, hostYellow, hostRed, smokeGreen, smokeYellow, smokeGrey, smokeRed } from '../imgs/links';

const WIDTH = 60;
const COLORS = ['#f83329', '#ffb400', '#9f9f9f'];
const LABELS = ['报警', '故障', '失联']

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
    const { data, devices } = this.props;
    data[0].push(0); // 为主机的失联补0，反正0对最后结果无影响
    return(
      <div className={styles.container}>
        {!!devices[0] && (
          <div className={styles.host} style={{ backgroundImage: `url(${getStatusImg(data[0], [hostRed, hostYellow, undefined, hostGreen])})` }}>
            <StatusBar data={data[0]} />
          </div>
        )}
        {!!devices[1] && (
          <div className={styles.smoke} style={{ backgroundImage: `url(${getStatusImg(data[1], [smokeRed, smokeYellow, smokeGrey, smokeGreen])})` }}>
          <StatusBar data={data[1]} />
        </div>
        )}
      </div>
    )
  }
}
