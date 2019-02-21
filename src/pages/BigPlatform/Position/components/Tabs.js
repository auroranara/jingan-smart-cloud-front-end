import React, { PureComponent } from 'react';

import styles from './Tabs.less';


const TABS = ['实时监控', '目标跟踪', '历史轨迹', '报警查看'];

export default class Tabs extends PureComponent {
  render() {
    const { value, handleLabelClick, ...restProps } = this.props;
    const leftPercent = 100 / TABS.length;

    return (
      <div className={styles.container} {...restProps}>
        {TABS.map((tab, i) => (
          <span
            key={tab}
            className={styles[i === value ? 'selected' : 'tab']}
            style={{ left: `${(leftPercent - 0.5) * i}%`, zIndex: i === value ? 9 : TABS.length - 1 - i }}
            onClick={e => handleLabelClick(i)}
          >
            {tab}
          </span>
        ))}
      </div>
    );
  }
}
