import React, { PureComponent } from 'react';

import styles from './WorkOrderDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import handleIcon from '../imgs/handle.png';
import handlingIcon from '../imgs/handling.png';
import handledIcon from '../imgs/handled.png';

const NO_DATA = '暂无信息';
const STATUS = ['已超期', '待处理', '已完成'];
const STATUS_N = [7, 2, 1];
const STATUS_MAP = { 7: '已超期', 2: '待处理', 1: '已完成' };
const ICONS = [handleIcon, handlingIcon, handledIcon];
const TYPES = ['主机报障', '一键报修'];
const ITEMS = [
  ['systemType', 'deviceName', 'position', 'desc', 'companyName' ],
  ['position', 'number', 'person', 'companyName'],
];
const ITEM_MAP = {
  'systemType': '系统类型',
  'deviceName': '设备名称',
  'position': '详细位置',
  'desc': '故障描述',
  'companyName': '维保公司',
  'number': '回路故障号',
  'person': '指派人员',
};
const STYLES = ['zero', 'one', 'two'];

const CARDS = [...Array(10).keys()].map(i => ({
  id: i,
  time: '2018-11-28',
  position: '5号楼5楼消防展示厅东侧',
  number: '001回路001号 点型光电烟感报警器',
  person: '张大龙 13212341234',
  companyName: '南京消防维保有限公司',
  type: Math.random() > 0.5 ? 0 : 1,
}));

function OrderCard(props) {
  const { type, time, status, ...restProps } = props;

  return (
    <div className={styles.outer}>
      <div className={styles.card} {...restProps}>
        <div className={styles.status}>
          <div style={{ backgroundImage: `url(${handlingIcon})` }} className={styles.stamp}></div>
          <p className={styles.day}>已超期3天</p>
        </div>
        <p className={styles.time}>
          {time}
          <span className={styles.info}>{TYPES[type]}</span>
        </p>
        {ITEMS[type].map(item => (
          <p key={item}>
            <span className={styles[STYLES[5 - ITEM_MAP[item].length]]}>{ITEM_MAP[item]}</span>
            {props[item] || NO_DATA}
          </p>
        ))}
      </div>
    </div>
  );
}

export default class WorkOrderDrawer extends PureComponent {
  render() {
    const { type, handleLabelChange, handleCardClick, data, ...restProps } = this.props;
    console.log(data, `workOrderList${type}`);
    const list = data[`workOrderList${type}`];

    const left = (
      <div className={styles.container}>
        <div className={styles.spans}>
          {STATUS.map((s, i) => {
            const t = STATUS_N[i];

            return (
              <span
                key={s}
                className={ t === type ? styles.selected : styles.span}
                onClick={e => handleLabelChange(t)}
              >
                {s}-{data[`workOrderList${t}`].length}
              </span>
            );
          }
          )}
        </div>
        <div className={styles.cards}>
          {list.map(item => <OrderCard key={item.id} {...item} onClick={e => handleCardClick(e)} />)}
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title={`${STATUS_MAP[type]}工单`}
        width={535}
        left={left}
        {...restProps}
      />
    );
  }
}
