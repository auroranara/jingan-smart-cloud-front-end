import React, { Component } from 'react';
import { DatePicker } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

export const PERIODS = [
  {
    key: '0',
    value: '本周',
  },
  {
    key: '1',
    value: '本月',
  },
  {
    key: '2',
    value: '本季度',
  },
  {
    key: '3',
    value: '今年',
  },
];
export const getRange = (key) => {
  switch(key) {
    case PERIODS[0].key:
      return [moment().locale('zh-cn').startOf('week'), moment().locale('zh-cn').endOf('week')];
    case PERIODS[1].key:
      return [moment().locale('zh-cn').startOf('month'), moment().locale('zh-cn').endOf('month')];
    case PERIODS[2].key:
      return [moment().locale('zh-cn').startOf('quarter'), moment().locale('zh-cn').endOf('quarter')];
    case PERIODS[3].key:
      return [moment().locale('zh-cn').startOf('year'), moment().locale('zh-cn').endOf('year')];
    default:
      return;
  }
};

export default class Period extends Component {
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
      value,
    } = this.props;
    const { period } = this.state;

    return (
      <div className={classNames(styles.container, className)}>
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
