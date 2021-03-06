import React, { PureComponent } from 'react';

import FcSection from '../../FireControl/section/FcSection';
import GasStatusLabel from '../components/GasStatusLabel';
import GasCard from '../components/GasCard';
import EmptyBg from '../components/EmptyBg';
import backIcon from '../../FireControl/img/back.png';
import styles from './GasBackSection.less';

import { ALL, NORMAL, ABNORMAL, LOSS } from '../components/gasStatus';

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
  if (!list.length)
    return [];

  return list.map(item => {
    const { deviceId, area, location, realTimeData: { updateTime, status, realTimeData }, deviceParams } = item;
    const fixedStatus = STATUS_FIX[status];
    // 失联状态，realTimeData = null，对应参数的值设为'-'，原params数组中每个对象的code对应realTimedData中的键名
    const params = deviceParams.map(({ id, code, desc, unit }) => ({ id, desc, unit, value: fixedStatus === LOSS || !realTimeData ? '-' : realTimeData[code], code }));
    return { id: deviceId, status: fixedStatus, location: `${area} ${location}`, time: updateTime, params, armStatus: realTimeData ? realTimeData._arm_status : null };
  });
}

function filterSearch(list = [], value = '') {
  // 将字符串用空格符切割为字符串数组并过滤掉空字符
  const searchVals = value.trim().split(/\s+/).filter(s => s);
  return value.trim() ? searchVals.reduce((prev, next) => prev.filter(item => item.location.includes(next)), list) : list;
}

function filterStatus(list = [], status = ALL) {
  return status === ALL ? list : list.filter(item => item.status === status);
}

function getStatusLength(list = [], filteredStatus) {
  if (filteredStatus === ALL)
    return list.length;
  return list.filter(({ status }) => status === filteredStatus).length;
}

export default class GasBackSection extends PureComponent {
  state = {
    inputVal: '',
  };

  handleInputChange = (e) => {
    this.setState({ inputVal: e.target.value });
  };

  handleBack = () => {
    const { handleBack } = this.props;
    handleBack();
    this.setState({ inputVal: '' });
  };

  render() {
    const { handleLabelClick, status, data } = this.props;
    // const { gasCount: { count: total=0, normal=0, unnormal: abnormal=0, outContact: loss=0 }, gasList=[] } = data;
    const { gasList = [] } = data;
    const { inputVal } = this.state;
    const gList = handleGasList(gasList);
    const searchFilteredList = filterSearch(gList, inputVal);
    // const nums = [normal, abnormal, loss, total];
    const nums = [ALL, NORMAL, ABNORMAL, LOSS].map(status => [status, getStatusLength(searchFilteredList, status)]);

    const statusFilteredList = filterStatus(searchFilteredList, status);

    let cards = <EmptyBg title="暂无气体监测信息" />;
    if (statusFilteredList.length)
      cards = statusFilteredList.map(({ id, status, location, time, params, armStatus }) => <GasCard key={id} {...{ status, location, time, params, armStatus }} />);

    return (
      <FcSection title="可燃/有毒气体监测" className={styles.gas} style={{ position: 'relative', padding: '0 15px 10px' }} isBack>
        {/* <div className={styles.inputContainer}>
          <input value={inputVal} onChange={this.handleInputChange} className={styles.input} placeholder="区域位置" />
          <button className={styles.check}>查询</button>
        </div> */}
        {/* 搜索框 */}
        <div className={styles.inputContainer}>
          <input value={inputVal} onChange={this.handleInputChange} className={styles.input} placeholder="可搜索区域和位置" />
        </div>
        {/* 筛选 */}
        <div className={styles.labelContainer}>
          {nums.map(([s, n]) => <GasStatusLabel key={s} num={n} status={s} selected={status === s} onClick={() => handleLabelClick(s)} />)}
        </div>
        <div className={styles.cardsContainer}>
          {cards}
        </div>
        {/* 返回 */}
        <span
          className={styles.back}
          onClick={this.handleBack}
          style={{ backgroundImage: `url(${backIcon})` }}
        />
      </FcSection>
    );
  }
}
