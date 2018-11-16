import React from 'react';
import { Icon } from 'antd';

import Rectangle from './Rectangle';
import styles from './SubSide.less';

export default function SubSide(props) {
  const {
    state=false,
    children='单项选择题',
    quantity=0,
    startIndex=0,
    colors=[],
    // clicks=[],
    handleClick, // 点击下面小方块的事件
    onClick, // 点击h标签的事件
    ...restProps
  } = props;

  const newStyle = { display: state ? 'flex' : 'none' };
  const arr = [];
  for (let i = 0; i < quantity; i++)
    arr.push(i + startIndex);

  return (
    <div className={styles.container} {...restProps}>
      <h3 onClick={onClick} className={styles.title}>
        <Icon type={state ? 'minus-square' : 'plus-square'} style={{ marginRight: 10 }} />
        {children}（共{quantity}题）
      </h3>
      <div className={styles.rectContainer} style={newStyle}>
        {arr.map(i => (
          <Rectangle
            key={i}
            gutter={6}
            color={colors[i]}
            handleClick={handleClick}>
            {i + 1}
          </Rectangle>
        ))}
      </div>
    </div>
  );
}
