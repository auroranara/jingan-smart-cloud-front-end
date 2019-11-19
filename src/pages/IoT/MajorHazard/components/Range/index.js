import React, { Component } from 'react';
import { DatePicker } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

export const PERIODS = [
  {
    key: '0',
    value: '最近一周',
  },
  {
    key: '1',
    value: '最近一个月',
  },
  {
    key: '2',
    value: '最近三个月',
  },
  {
    key: '3',
    value: '最近一年',
  },
];
export const getRange = (key) => {
  switch(key) {
    case PERIODS[0].key:
      return [moment().startOf('day').subtract(1, 'weeks').add(1, 'days'), moment().endOf('day')];
    case PERIODS[1].key:
      return [moment().startOf('day').subtract(1, 'months').add(1, 'days'), moment().endOf('day')];
    case PERIODS[2].key:
      return [moment().startOf('day').subtract(1, 'quarters').add(1, 'days'), moment().endOf('day')];
    case PERIODS[3].key:
      return [moment().startOf('day').subtract(1, 'years').add(1, 'days'), moment().endOf('day')];
    default:
      return;
  }
};

export default class Range extends Component {
  state = {
    period: undefined,
  }

  componentDidMount() {
    this.handlePeriodChange(PERIODS[0].key);
  }

  handlePeriodChange = (period) => {
    const { onChange, onClick } = this.props;
    this.setState({
      period,
    });
    onChange && onChange(getRange(period));
    onClick && onClick(period);
  }

  handleRangeChange = (range) => {
    const { onChange } = this.props;
    this.setState({
      period: undefined,
    });
    onChange && onChange(range);
  }

  render() {
    const {
      className,
      style,
      value,
    } = this.props;
    const { period } = this.state;

    return (
      <div className={classNames(styles.container, className)} style={style}>
        <div className={styles.radioList}>
          {PERIODS.map(({ key, value }) => (
            <div
              className={classNames(styles.radioItem, period === key && styles.active)}
              key={key}
              onClick={() => this.handlePeriodChange(key)}
            >
              {value}
            </div>
          ))}
        </div>
        <DatePicker.RangePicker
          className={styles.rangePicker}
          value={value}
          onChange={this.handleRangeChange}
          allowClear={false}
        />
      </div>
    );
  }
}
