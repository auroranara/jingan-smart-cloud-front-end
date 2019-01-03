import React from 'react';

import styles from './SwitchHead.less';

export default function SwitchHead(props) {
  const { value=0, labels=[], onSwitch, ...restProps } = props;

  return (
    // <div className={value ? styles.containerLight : styles.container} {...restProps}>
    <div className={styles.container} {...restProps}>
      {labels.map((label, i) => {
        const isSelected = i === value;
        return (
          <p
            key={i}
            className={isSelected ? styles.selected : styles.label}
            onClick={e => onSwitch(i)}
          >
            <span className={isSelected ? styles.rect : styles.empty} />
            {label}
          </p>
        );
      })}
    </div>
  );
}
