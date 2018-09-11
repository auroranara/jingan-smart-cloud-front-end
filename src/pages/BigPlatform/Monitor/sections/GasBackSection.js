import React, { PureComponent } from 'react';

import FcSection from '../../FireControl/section/FcSection';
import GasStatusLabel from '../components/GasStatusLabel';
import GasCard from '../components/GasCard';
import backIcon from '../../FireControl/img/back.png';
import styles from './GasBackSection.less';

import { ALL } from '../components/gasStatus';

const tempList = [
  { id: 0, status: 0, desc: '厂区九车间：氯乙烷压缩机东', time: '2018-09-06 09:11:32' },
  { id: 0, status: 1, desc: '厂区九车间：氯乙烷压缩机东', time: '2018-09-06 09:11:32' },
  { id: 0, status: 2, desc: '厂区九车间：氯乙烷压缩机东', time: '2018-09-06 09:11:32' },
];

//将原始数据的状态修正， 0 失联 1 正常 2 异常 => 0 正常 1 异常 2 失联
const STATUS_FIX = [2, 0, 1];

function handleGasList(list=[], status=ALL, searchVal='') {
  if (!list.length)
    return [];

  const newList = list.map(item => {
    const { deviceId, area, location, realTimeData: { updateTime, status, realTimeData }} = item;
    const lel = realTimeData ? realTimeData.lel : '-';
    return { id: deviceId, status: STATUS_FIX[status], desc: `${area} ${location}`, time: updateTime, lel };
  });

  const statusFilteredList = status === ALL ? newList : newList.filter(item => item.status === status);
  return searchVal ? statusFilteredList.filter(({ desc }) => desc.includes(searchVal)) : statusFilteredList;
}

export default class GasSection extends PureComponent {
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

  render(props) {
    const { handleLabelClick, status, data } = this.props;
    const { gasCount: { normal=0, unnormal: abnormal=0, outContact: loss=0 }, gasList=[] } = data;
    const { inputVal } = this.state;
    const nums = [normal, abnormal, loss];
    const gList = handleGasList(gasList, status, inputVal);

    return (
      <FcSection title="可燃/有毒气体监测" className={styles.gas} style={{ position: 'relative', padding: '0 15px 10px' }} isBack>
        <div className={styles.inputContainer}>
          <input value={inputVal} onChange={this.handleInputChange} className={styles.input} placeholder="区域位置" />
          <button className={styles.check}>查询</button>
        </div>
        <div className={styles.labelContainer}>
          {nums.map((n, i) => <GasStatusLabel key={i} num={n} status={i} selected={status === i} onClick={() => handleLabelClick(i)} />)}
        </div>
        <div className={styles.cardsContainer}>
          {gList.map(({ id, status, desc, time }) => <GasCard key={id} status={status} desc={desc} time={time} />)}
        </div>
        <span
          className={styles.back}
          onClick={this.handleBack}
          style={{ backgroundImage: `url(${backIcon})` }}
        />
      </FcSection>
    );
  }
}
