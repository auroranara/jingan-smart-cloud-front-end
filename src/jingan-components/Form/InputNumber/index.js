import React from 'react';
import { InputNumber, Badge } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import classNames from 'classnames';
import { isNumber } from '@/utils/utils';
import styles from './index.less';

const FormInputNumber = ({
  className,
  value,
  mode,
  placeholder = '请输入',
  maxLength = 100,
  allowClear = false,
  empty = <EmptyText />,
  ellipsis = true,
  status,
  color,
  ...rest
}) => {
  if (mode !== 'detail') {
    return (
      <InputNumber
        className={classNames(styles.container, className)}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        allowClear={allowClear}
        {...rest}
      />
    );
  } else {
    return isNumber(value) ? (
      status || color ? (
        <Badge
          text={`${value}`}
          status={status ? status(value) : undefined}
          color={color ? color(value) : undefined}
        />
      ) : ellipsis ? (
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

FormInputNumber.getRules = ({ label }) => [
  {
    required: true,
    message: `${label || ''}不能为空`,
  },
];

export default FormInputNumber;
