import React from 'react';

import styles from './SubjectCategory.less';

const INDEX = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

export default function SubjectCategory(props) {
  const { index=0, title, quantity=0, titleClassName, children=null, ...restProps } = props;

  return (
    <div className={styles.container} {...restProps}>
      <h3 className={titleClassName || styles.title}>{`${INDEX[index]}、${title}（共${quantity}题）`}</h3>
      {children}
    </div>
  );
}
