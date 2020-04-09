import React from 'react';
import { Input } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import classNames from 'classnames';
import styles from './index.less';
const { Password } = Input;

const FormPassword = ({
  className,
  value,
  mode,
  placeholder = '请输入',
  maxLength = 100,
  allowClear = false,
  empty = <EmptyText />,
  ellipsis = true,
  ...rest
}) => {
  if (mode !== 'detail') {
    return (
      <Password
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
      empty
    );
  }
};

FormPassword.getRules = ({ label }) => [
  {
    required: true,
    whitespace: true,
    message: `${label || ''}不能为空`,
  },
];

export default FormPassword;
