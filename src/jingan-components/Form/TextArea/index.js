import React from 'react';
import { Input } from 'antd';
import EmptyText from '@/jingan-components/View/EmptyText';
import TextAreaEllipsis from '@/jingan-components/View/TextAreaEllipsis';
import classNames from 'classnames';
import styles from './index.less';
const { TextArea } = Input;

const AUTO_SIZE = {
  minRows: 3,
  maxRows: 10,
};

const FormTextArea = ({
  className,
  value,
  mode,
  placeholder = '请输入',
  maxLength = 500,
  autoSize = AUTO_SIZE,
  allowClear = false,
  emtpy = <EmptyText />,
  ellipsis = true,
  ...rest
}) => {
  if (mode !== 'detail') {
    return (
      <TextArea
        className={classNames(styles.container, className)}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        autoSize={autoSize}
        allowClear={allowClear}
        {...rest}
      />
    );
  } else {
    return value ? (
      ellipsis ? (
        <TextAreaEllipsis value={value} {...ellipsis} />
      ) : (
        <span>{value}</span>
      )
    ) : (
      emtpy
    );
  }
};

FormTextArea.getRules = ({ label }) => [
  {
    required: true,
    whitespace: true,
    message: `${label || ''}不能为空`,
  },
];

export default FormTextArea;
