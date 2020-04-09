import React from 'react';
import { DatePicker } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import classNames from 'classnames';
import styles from './index.less';

const FORMAT = 'YYYY-MM-DD';

const FormDatePicker = ({
  className,
  value,
  mode,
  originalMode,
  placeholder = '请选择',
  format = FORMAT,
  allowClear = false,
  inputReadOnly = true,
  empty = <EmptyText />,
  ellipsis = true,
  ...rest
}) => {
  if (mode !== 'detail') {
    return (
      <DatePicker
        className={classNames(styles.container, className)}
        placeholder={placeholder}
        value={value}
        format={format}
        allowClear={allowClear}
        mode={originalMode}
        inputReadOnly={inputReadOnly}
        showTime={
          format.includes(' ')
            ? {
                format: format.split(' ').slice(-1)[0],
              }
            : undefined
        }
        {...rest}
      />
    );
  } else {
    return value ? (
      ellipsis ? (
        <Ellipsis lines={1} tooltip {...ellipsis}>
          {value.format(format)}
        </Ellipsis>
      ) : (
        <span>{value.format(format)}</span>
      )
    ) : (
      empty
    );
  }
};

FormDatePicker.getRules = ({ label }) => [
  {
    type: 'object',
    required: true,
    message: `${label || ''}不能为空`,
  },
];

export default FormDatePicker;
