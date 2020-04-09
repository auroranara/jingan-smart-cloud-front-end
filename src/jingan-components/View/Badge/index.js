import React from 'react';
import { Badge } from 'antd';
// import styles from './index.less';

const FIELDNAMES = {
  key: 'key',
  value: 'value',
  status: 'status',
};

const BadgeView = ({ list, value, fieldNames, ...rest }) => {
  const { key: k, value: v, status: s } = { ...FIELDNAMES, ...fieldNames };
  const item = (list || []).find(item => item[k] === value);
  return item ? <Badge text={item[v]} status={item[s]} {...rest} /> : null;
};

export default BadgeView;
