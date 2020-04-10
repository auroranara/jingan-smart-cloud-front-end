import React from 'react';
import { DatePicker } from '@/jingan-components/Form';
import { Badge, EmptyText } from '@/jingan-components/View';
import styles from './index.less';

const DueDate = ({ status, mode, value, empty = <EmptyText />, list, ...rest }) => {
  return mode !== 'detail' ? (
    <DatePicker mode={mode} value={value} {...rest} />
  ) : value ? (
    <div>
      <DatePicker mode={mode} value={value} ellipsis={false} {...rest} />
      <Badge className={styles.badge} list={list} value={`${status}`} />
    </div>
  ) : (
    empty
  );
};

export default DueDate;
