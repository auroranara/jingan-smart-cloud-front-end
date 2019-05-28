import React from 'react';
import classnames from 'classnames';

import styles from './GaugeLabels.less';

export default function GaugeLabels(props) {
  const { labels=[], alerted=[], value, handleLabelClick, ...restProps } = props;
  const labelStyle = labels.length ? { width: `${100 / labels.length - 1}%` } : {};

  return (
    <div className={styles.container} {...restProps}>
      {labels.map((label, i) => (
        <div
          key={label}
          style={labelStyle}
          className={classnames(styles.normal, alerted.includes(i) ? styles.alerted : undefined, i === value ? styles.selected : undefined)}
          onClick={e => handleLabelClick(i)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
