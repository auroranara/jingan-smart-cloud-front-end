import React from 'react';
import { Icon } from 'antd';

import styles from './SwitchHead.less';
import leftLine from '../imgs/leftLine.png';
import rightLine from '../imgs/rightLine.png';

const INDEXES = ['一', '二', '三', '四', '五', '六', '七', '八', '九',
  '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
const ICON_STYLE = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'rgb(4, 253, 253)',
};
const OPACITY = 0.3;

export default function SwitchHead(props) {
  const { index=0, title, lastIndex=0, handleLeftClick, handleRightClick, ...restProps } = props;
  const isFirst = !index;
  const isLast = index === lastIndex;

  return (
    <div className={styles.container} {...restProps}>
      {`${title}${INDEXES[index]}`}
      <span className={styles.leftLine} style={{ backgroundImage: `url(${leftLine})` }} />
      <span className={styles.rightLine} style={{ backgroundImage: `url(${rightLine})` }} />
      <Icon
        type="left"
        style={{
          left: 0,
          opacity: isFirst ? OPACITY : 1,
          cursor: isFirst ? 'auto' : 'pointer',
          ...ICON_STYLE,
        }}
        onClick={isFirst ? null : handleLeftClick}
      />
      <Icon
        type="right"
        style={{
          right: 0,
          opacity: isLast ? OPACITY : 1,
          cursor: isLast ? 'auto' : 'pointer',
          ...ICON_STYLE,
        }}
        onClick={isLast ? null : handleRightClick}
      />
    </div>
  );
}
