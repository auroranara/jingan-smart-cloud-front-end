import React from 'react';

import styles from './EmptyChart.less';

const DEFAULT_URL = 'http://data.jingan-china.cn/v2/big-platform/fire-control/gov/noDanger.png';

export default function EmptyChart(props) {
  const { url, title, style, titleStyle, ...restProps } = props;
  const newStyle = { ...style, backgroundImage: `url(${url || DEFAULT_URL})` };

  return (
    <div className={styles.empty} style={newStyle} {...restProps}>
      <span className={styles.title} style={titleStyle}>{title}</span>
    </div>
  );
}
