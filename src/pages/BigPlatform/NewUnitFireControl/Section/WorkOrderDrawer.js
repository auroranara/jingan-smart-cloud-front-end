import React, { PureComponent } from 'react';

import styles from './WorkOrderDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import handleIcon from '../imgs/handle.png';
import handlingIcon from '../imgs/handling.png';

const STATUS = ['已超期', '待完成', '已完成'];

const CARDS = [...Array(10).keys()].map(i => ({
  id: i,
  time: '2018-11-28',
  info: '一键报修',
  position: '5号楼5楼消防展示厅东侧',
  num: '001回路001号 点型光电烟感报警器',
  person: '张大龙 13212341234',
  company: '南京消防维保有限公司',
  status: Math.random() > 0.5 ? '正常' : '异常',
}));

function OrderCard(props) {
  const { time, info, position, num, person, company, status } = props;

  return (
    <div className={styles.outer}>
      <div className={styles.card}>
        <div className={styles.status}>
          <div style={{ backgroundImage: `url(${handlingIcon})` }} className={styles.stamp}></div>
          <p className={styles.day}>已超期3天</p>
        </div>
        <p className={styles.time}>
          {time}
          <span className={styles.info}>{info}</span>
        </p>
        <p>
          <span className={styles.position}>位置</span>
          {position}
        </p>
        <p>
          <span className={styles.num}>回路故障号</span>
          {num}
        </p>
        <p>
          <span className={styles.person}>指派人员</span>
          {person}
        </p>
        <p>
          <span className={styles.person}>维保公司</span>
          {company}
        </p>
      </div>
    </div>
  );
}

export default class WorkOrderDrawer extends PureComponent {
  render() {
    const left = (
      <div className={styles.container}>
        <div className={styles.spans}>
          {STATUS.map((s,index) => <span key={index} className={styles.span}>{s}-{Math.floor(Math.random() * 10)}</span>)}
        </div>
        <div className={styles.cards}>
          {CARDS.map(item => <OrderCard key={item.id} {...item} />)}
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title="待完成工单"
        width={535}
        left={left}
        {...this.props}
      />
    );
  }
}
