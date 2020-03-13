import React, { Component } from 'react';
import { DatePicker } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import classNames from 'classnames';
import styles from './index.less';

const FORMAT = 'YYYY-MM-DD';

export default class FormDatePicker extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value || nextProps.mode !== this.props.mode;
  }

  render() {
    const {
      className,
      value,
      mode = 'add',
      placeholder = '请选择',
      format = FORMAT,
      allowClear = false,
      showTime,
      emtpy = <EmptyText />,
      ellipsis = true,
      ...restProps
    } = this.props;

    if (mode !== 'detail') {
      const arr = format.split(' ');
      return (
        <DatePicker
          className={classNames(styles.container, className)}
          placeholder={placeholder}
          value={value}
          format={format}
          showTime={
            arr.length === 2
              ? {
                  format: arr[1],
                  ...showTime,
                }
              : false
          }
          allowClear={allowClear}
          {...restProps}
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
        emtpy
      );
    }
  }
}
