import React from 'react';

import styles from './Rectangle.less';

const COLOR_MAP = {
  red: 'rgb(205, 63, 63)',
  green: 'rgb(51, 186, 105)',
  blue: 'rgb(42, 139, 213)',
  white: 'transparent',
};

export default function Rectangle(props) {
  const { width=50, children, color='white', gutter=0, style, handleClick, ...restProps } = props;
  const isWhite = color === 'white';
  const newStyle = {
    width,
    height: width,
    padding: gutter,
    ...style,
  };

  const innerStyle = {
    cursor: 'pointer',
    lineHeight: `${width - 2 * gutter}px`,
    color: isWhite ? '#000' : '#FFF',
    backgroundColor: COLOR_MAP[color],
    border: `1px solid ${isWhite ? 'grey' : COLOR_MAP[color]}`,
  }

  return (
    <div className={styles.container} style={newStyle} {...restProps}>
      <div className={styles.rect} style={innerStyle} onClick={e => handleClick(children - 1)}>
        {children}
      </div>
    </div>
  );
}
