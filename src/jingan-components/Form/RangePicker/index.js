import React, { Component } from 'react';
import { DatePicker } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import classNames from 'classnames';
import styles from './index.less';
const { RangePicker } = DatePicker;

const PLACEHOLDER = ['开始时间', '结束时间'];
const FORMAT = 'YYYY-MM-DD';

export default class FormRangePicker extends Component {
  empty = true;

  componentDidMount() {
    const { value } = this.props;
    this.empty = !(value && value[0] && value[1]);
  }

  componentDidUpdate() {
    const { value } = this.props;
    this.empty = !(value && value[0] && value[1]);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value || nextProps.mode !== this.props.mode;
  }

  handleChange = range => {
    const { onChange } = this.props;
    const empty = !(range && range.length);
    const result = this.empty && !empty ? [range[0].startOf('day'), range[1].endOf('day')] : range;
    onChange && onChange(result);
  };

  render() {
    const {
      className,
      value,
      onChange,
      mode = 'add',
      placeholder = PLACEHOLDER,
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
        <RangePicker
          className={classNames(styles.container, className)}
          placeholder={placeholder}
          value={value}
          onChange={this.handleChange}
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
      return value && value[0] && value[1] ? (
        ellipsis ? (
          <Ellipsis lines={1} tooltip {...ellipsis}>
            {value.map(time => time.format(format)).join(' 至 ')}
          </Ellipsis>
        ) : (
          <span>{value.map(time => time.format(format)).join(' 至 ')}</span>
        )
      ) : (
        emtpy
      );
    }
  }
}
