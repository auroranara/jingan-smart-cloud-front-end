import React from 'react';
import { Badge } from 'antd';
import EmptyText from '@/jingan-components/View/EmptyText';
// import styles from './index.less';

const FIELDNAMES = {
  key: 'key',
  value: 'value',
  status: 'status',
  color: 'color',
};

const BadgeView = ({ list, value, fieldNames, empty = <EmptyText />, ...rest }) => {
  const { key: k, value: v, status: s, color: c } = { ...FIELDNAMES, ...fieldNames };
  const item = (list || []).find(item => item[k] === value);
  return item ? <Badge text={item[v]} status={item[s]} color={item[c]} {...rest} /> : empty;
};

export default BadgeView;
