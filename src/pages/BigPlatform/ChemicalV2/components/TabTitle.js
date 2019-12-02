import React from 'react';

import styles from './TabTitle.less';

function getClassName(i, length) {
  const isFirst = !i;
  const isLast = i === length - 1;
  if (isFirst) return 'first';
  if (isLast) return 'last';
  return 'label';
}

const CHOSEN_STYLE = {
  color: '#0FF',
  borderLeft: '1px solid',
  borderColor: '#0FF',
  cursor: 'auto',
};
const PREV_STYLE = { borderRight: 'none' };

function getStyle(index, i) {
  if (i === index) return CHOSEN_STYLE;
  if (i === index - 1) return PREV_STYLE;
  return null;
}

export default function TabTitle(props) {
  const { index, labels = [], handleClickTab, ...restProps } = props;
  const length = labels.length;
  return (
    <div className={styles.container} {...restProps}>
      {labels.map((label, i) => (
        <div
          className={styles[getClassName(i, length)]}
          style={getStyle(index, i)}
          onClick={e => handleClickTab(i)}
          key={i}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
