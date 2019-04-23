import React, { PureComponent } from 'react';
import GasCard from '../../../../Monitor/Components/GasCard';
import EmptyBg from '../../../../Monitor/Components/EmptyBg';
import styles from './GasList.less';

import { ALL, NORMAL, ABNORMAL, LOSS } from '../../../../Monitor/Components/gasStatus';

const STATUS_CN = ['正常', '报警', '失联', '全部'];
const COLORS = [
  'rgb(0, 161, 129)',
  'rgb(232, 103, 103)',
  'rgb(198, 193, 129)',
  'rgb(255, 255, 255)',
];
// 将原始数据的状态修正， 0 失联 1 正常 2 异常 => 0 正常 1 异常 2 失联 (废弃)
// 将原始数据的状态修正， -1 失联 0 正常 1 预警 2 告警 => 0 正常 1 异常(预警 告警) 2 失联
// const STATUS_FIX = [2, 0, 1];
const STATUS_FIX = {
  '-1': 2,
  0: 0,
  1: 1,
  2: 1,
};

function handleGasList(list = [], status = ALL) {
  if (!list.length) return [];

  return list.map(item => {
    const {
      deviceId,
      area,
      location,
      realTimeData: { updateTime, status, realTimeData },
      deviceParams,
    } = item;
    const fixedStatus = STATUS_FIX[status];
    // 失联状态，realTimeData = null，对应参数的值设为'-'，原params数组中每个对象的code对应realTimedData中的键名
    const params = deviceParams.map(({ id, code, desc, unit }) => ({
      id,
      desc,
      unit,
      value: fixedStatus === LOSS || !realTimeData ? '-' : realTimeData[code],
    }));
    return {
      id: deviceId,
      status: fixedStatus,
      location: `${area} ${location}`,
      time: updateTime,
      params,
    };
  });
}

function filterSearch(list = [], value = '') {
  // 将字符串用空格符切割为字符串数组并过滤掉空字符
  const searchVals = value
    .trim()
    .split(/\s+/)
    .filter(s => s);
  return value.trim()
    ? searchVals.reduce((prev, next) => prev.filter(item => item.location.includes(next)), list)
    : list;
}

function filterStatus(list = [], status = ALL) {
  return status === ALL ? list : list.filter(item => item.status === status);
}

function getStatusLength(list = [], filteredStatus) {
  if (filteredStatus === ALL) return list.length;
  return list.filter(({ status }) => status === filteredStatus).length;
}

function GasStatusLabel(props) {
  const { status = 0, num = 0, selected = false, ...restProps } = props;

  return (
    <p className={selected ? styles.labelSelected : styles.label} {...restProps}>
      <span className={styles.status}>{STATUS_CN[status]}</span>
      <span className={styles.num} style={{ color: COLORS[status] }}>
        {' ' + num}
      </span>
    </p>
  );
}

export default class GasList extends PureComponent {
  state = {
    inputVal: '',
    status: ALL,
  };

  handleInputChange = e => {
    this.setState({ inputVal: e.target.value });
  };

  handleBack = () => {
    const { handleBack } = this.props;
    handleBack();
    this.setState({ inputVal: '' });
  };

  handleLabelClick = status => {
    this.setState({ status: status });
  };

  render() {
    const { data } = this.props;
    const { status } = this.state;
    const { gasList = [] } = data;
    const { inputVal } = this.state;
    const gList = handleGasList(gasList);
    const searchFilteredList = filterSearch(gList, inputVal);
    const nums = [ALL, NORMAL, ABNORMAL, LOSS].map(status => [
      status,
      getStatusLength(searchFilteredList, status),
    ]);

    const statusFilteredList = filterStatus(searchFilteredList, status);

    let cards = <EmptyBg title="暂无气体监测信息" />;
    if (statusFilteredList.length)
      cards = statusFilteredList.map(({ id, status, location, time, params }) => (
        <GasCard
          key={id}
          status={status}
          location={location}
          time={time}
          timeStyle={{ color: '#fff' }}
          params={params}
          style={{ backgroundColor: '#043b77', boxShadow: 'none' }}
        />
      ));

    return (
      <div className={styles.gasList}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>实时监测数据</div>
        </div>
        <div className={styles.inputContainer}>
          <input
            value={inputVal}
            onChange={this.handleInputChange}
            className={styles.input}
            placeholder="搜索区域和位置"
          />
        </div>
        <div className={styles.labelContainer}>
          {nums.map(([s, n]) => (
            <GasStatusLabel
              key={s}
              num={n}
              status={s}
              selected={status === s}
              onClick={() => this.handleLabelClick(s)}
            />
          ))}
        </div>
        <div className={styles.cardsContainer}>{cards}</div>
      </div>
    );
  }
}
