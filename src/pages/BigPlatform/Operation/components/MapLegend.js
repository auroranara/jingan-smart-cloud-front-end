import React, { PureComponent } from 'react';

import styles from './MapLegend.less';
import { LegendDot } from './Components';

const PROPS = ['abnormal', 'alarm', 'fault', 'loss', 'normal'];
const LABELS = ['异常', '报警', '故障', '失联', '正常'];
const COLORS = ['#f83329', '#f83329', '#ffb400', '#9f9f9f', '#37a460'];

export default class MapLegend extends PureComponent{
  render() {
    const { data } = this.props;
    return (
      <div className={styles.mapLegend}>
        {PROPS.reduce((prev, next, i) => {
          const num = data[next];
          if (num !== undefined)
            prev.push(
              <div className={styles.legendItem}>
                <LegendDot color={COLORS[i]} />
                <span className={styles.label}>{LABELS[i]}</span>
                {num}
              </div>
            );
          return prev;
        }, [])}
      </div>
    );
  }
}
