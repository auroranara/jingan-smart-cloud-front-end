import React from 'react';
import { DatePicker } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import EmptyText from '@/jingan-components/View/EmptyText';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';
const { RangePicker } = DatePicker;

const PLACEHOLDER = ['开始时间', '结束时间'];
const FORMAT = 'YYYY-MM-DD';
const GET_RANGES = (ranges = ['今天', '最近一周', '最近一个月']) => {
  return ranges.reduce((result, item) => {
    if (item === '今天') {
      result[item] = [moment().startOf('day'), moment().endOf('day')];
    } else if (item === '最近一周') {
      result[item] = [
        moment()
          .startOf('day')
          .subtract(1, 'weeks')
          .add(1, 'days'),
        moment().endOf('day'),
      ];
    } else if (item === '最近一个月') {
      result[item] = [
        moment()
          .startOf('day')
          .subtract(1, 'months')
          .add(1, 'days'),
        moment().endOf('day'),
      ];
    } else if (item === '最近三个月') {
      result[item] = [
        moment()
          .startOf('day')
          .subtract(1, 'quarters')
          .add(1, 'days'),
        moment().endOf('day'),
      ];
    } else if (item === '最近半年') {
      result[item] = [
        moment()
          .startOf('day')
          .subtract(6, 'months')
          .add(1, 'days'),
        moment().endOf('day'),
      ];
    } else if (item === '最近一年') {
      result[item] = [
        moment()
          .startOf('day')
          .subtract(1, 'years')
          .add(1, 'days'),
        moment().endOf('day'),
      ];
    } else if (item === '未来一周') {
      result[item] = [
        moment().startOf('day'),
        moment()
          .endOf('day')
          .add(1, 'weeks')
          .subtract(1, 'days'),
      ];
    } else if (item === '未来一个月') {
      result[item] = [
        moment().startOf('day'),
        moment()
          .endOf('day')
          .add(1, 'months')
          .subtract(1, 'days'),
      ];
    } else if (item === '未来三个月') {
      result[item] = [
        moment().startOf('day'),
        moment()
          .endOf('day')
          .add(1, 'quarters')
          .subtract(1, 'days'),
      ];
    } else if (item === '未来半年') {
      result[item] = [
        moment().startOf('day'),
        moment()
          .endOf('day')
          .add(6, 'months')
          .subtract(1, 'days'),
      ];
    } else if (item === '未来一年') {
      result[item] = [
        moment().startOf('day'),
        moment()
          .endOf('day')
          .add(1, 'years')
          .subtract(1, 'days'),
      ];
    }
    return result;
  }, {});
};

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
  ranges,
  empty = <EmptyText />,
  ellipsis = true,
  ...rest
}) => {
  if (mode !== 'detail') {
    const rangeList =
      Array.isArray(ranges) || ranges === undefined ? GET_RANGES(ranges) : ranges || undefined;
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
        ranges={rangeList}
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
    return value && value[0] && value[1] ? (
      ellipsis ? (
        <Ellipsis lines={1} tooltip {...ellipsis}>
          {value.map(time => time.format(format)).join(` ${separator} `)}
        </Ellipsis>
      ) : (
        <span>{value.map(time => time.format(format)).join(` ${separator} `)}</span>
      )
    ) : (
      empty
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
