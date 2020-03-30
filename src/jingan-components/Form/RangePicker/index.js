import React from 'react';
import { DatePicker } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import classNames from 'classnames';
import styles from './index.less';
const { RangePicker } = DatePicker;

const PLACEHOLDER = ['开始时间', '结束时间'];
const FORMAT = 'YYYY-MM-DD';

const FormRangePicker = ({
  className,
  value,
  onChange,
  mode,
  originalMode,
  placeholder = PLACEHOLDER,
  format = FORMAT,
  allowClear = false,
  inputReadOnly = true,
  separator = '~',
  emtpy = <EmptyText />,
  ellipsis = true,
  ...rest
}) => {
  if (mode !== 'detail') {
    return (
      <RangePicker
        className={classNames(styles.container, className)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        format={format}
        allowClear={allowClear}
        inputReadOnly={inputReadOnly}
        separator={<span className={styles.separator}>{separator}</span>}
        mode={originalMode}
        {...rest}
      />
    );
  } else {
    return value && value[0] && value[1] ? (
      ellipsis ? (
        <Ellipsis lines={1} tooltip {...ellipsis}>
          {value.map(time => time.format(format)).join(` ${separator} `)}
        </Ellipsis>
      ) : (
        <span>{value.map(time => time.format(format)).join(` ${separator} `)}</span>
      )
    ) : (
      emtpy
    );
  }
};

FormRangePicker.getRules = ({ label }) => [
  {
    type: 'array',
    len: 2,
    required: true,
    message: `${label || ''}不能为空`,
  },
];

export default FormRangePicker;
