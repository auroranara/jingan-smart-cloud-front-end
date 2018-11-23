import React from 'react';

import styles from './Flag.less';

const COLOR_MAP = {
  red: 'rgb(205, 63, 63)',
  green: 'rgb(51, 186, 105)',
  blue: 'rgb(42, 139, 213)',
  white: 'rgb(0, 0, 0)',
};

const COLOR_CN = { red: '红色', green: '绿色', blue: '蓝色', white: '白色' };

export default function Flag(props) {
  const { children='暂无描述', color='white' } = props;
  return <p className={styles.container}>{children}，用<span className={styles.flag} style={{ color: COLOR_MAP[color] }}>{COLOR_CN[color]}</span>标识</p>;
}
