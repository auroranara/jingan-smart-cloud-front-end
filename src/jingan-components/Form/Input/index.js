import React from 'react';
import { Input } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import classNames from 'classnames';
import styles from './index.less';

const FormInput = ({
  className,
  value,
  mode,
  placeholder = '请输入',
  maxLength = 100,
  allowClear = false,
  emtpy = <EmptyText />,
  ellipsis = true,
  ...rest
}) => {
  if (mode !== 'detail') {
    return (
      <Input
        className={classNames(styles.container, className)}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        allowClear={allowClear}
        {...rest}
      />
    );
  } else {
    return value ? (
      ellipsis ? (
        <Ellipsis lines={1} tooltip {...ellipsis}>
          {value}
        </Ellipsis>
      ) : (
        <span>{value}</span>
      )
    ) : (
      emtpy
    );
  }
};

FormInput.getRules = ({ label }) => [
  {
    required: true,
    whitespace: true,
    message: `${label || ''}不能为空`,
  },
];

export default FormInput;
