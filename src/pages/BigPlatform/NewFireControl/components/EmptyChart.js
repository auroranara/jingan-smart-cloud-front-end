import React from 'react';

import styles from './EmptyChart.less';

export default function EmptyChart(props) {
  const { url, title, style, titleStyle, ...restProps } = props;
  const newStyle = { ...style, backgroundImage: `url(${url})` };

  return (
    <div className={styles.empty} style={newStyle} {...restProps}>
      <span className={styles.title} style={titleStyle}>{title}</span>
    </div>
  );
}
