import React from 'react';
import classnames from 'classnames';

import styles from './GaugeLabels.less';

export default function GaugeLabels(props) {
  const { labels=[], labelObjs, alerted=[], value, handleLabelClick, ...restProps } = props;
  const lbls = labelObjs || labels.map((label, index) => ({ label, index }));
  const labelStyle = lbls.length ? { width: `${100 / lbls.length - 1}%` } : {};

  return (
    <div className={styles.container} {...restProps}>
      {lbls.map(({ label, index: i }) => (
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
