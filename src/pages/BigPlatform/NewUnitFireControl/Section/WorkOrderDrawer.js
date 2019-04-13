import React, { PureComponent } from 'react';
import moment from 'moment';
import { Icon } from 'antd';

import styles from './WorkOrderDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import handleIcon from '../imgs/handle.png';
import overIcon from '../imgs/over.png';
import handlingIcon from '../imgs/handling.png';
import handledIcon from '../imgs/handled.png';

const DAY_MS = 24 * 3600 * 1000;
const NO_DATA = '暂无信息';
const STATUS = ['已超期', '待完成', '已完成'];
const STATUS_N = [7, 2, 1];
const STATUS_MAP = { 7: '已超期', 2: '待完成', 1: '已完成' };
const ICONS_MAP = { 7: overIcon, '2.0': handlingIcon, '2.2': handleIcon, 1: handledIcon };
const TYPES = ['一键报修', '主机报障'];
const ITEMS = [
  ['systemTypeValue', 'device_name', 'device_address', 'report_desc', 'unit_name'], // 一键报修  report_type = 2
  ['install_address', 'number', 'assign', 'unit_name'], // 主机报障
];
const ITEM_MAP = {
  systemTypeValue: '系统类型',
  device_name: '设备名称',
  device_address: '详细位置',
  install_address: '详细位置',
  report_desc: '故障描述',
  unit_name: '维保公司',
  number: '回路故障号',
  assign: '维修人员',
};
const STYLES = ['zero', 'one', 'two'];
const ARROW_STYLE = { color: '#0FF', position: 'absolute', top: 20, right: 20 };

const { projectKey } = global.PROJECT_CONFIG;
const isVague = projectKey.indexOf('czey') >= 0 || projectKey.indexOf('test') >= 0;
function nameToVague(str) {
  let newStr = '';
  if (str && str.length === 1) return str;
  else if (str && str.length === 2) {
    newStr = str.substr(0, 1) + '*';
  } else if (str && str.length > 2) {
    newStr = str.substr(0, 1) + '*' + str.substr(-1);
  } else return str;
  return newStr;
}

function phoneToVague(str) {
  if (!str) return str;
  const newStr = str.substr(0, 3) + '****' + str.substr(-4);
  return newStr;
}

// const CARDS = [...Array(10).keys()].map(i => ({
//   id: i,
//   time: '2018-11-28',
//   position: '5号楼5楼消防展示厅东侧',
//   number: '001回路001号 点型光电烟感报警器',
//   person: '张大龙 13212341234',
//   companyName: '南京消防维保有限公司',
//   type: Math.random() > 0.5 ? 0 : 1,
// }));

function OrderCard(props) {
  const { type, data, maintenanceCompanys, ...restProps } = props;

  const {
    type: orderType, // 1,2火警, 3,4故障
    status = 0,
    report_type,
    create_date,
    // save_time,
    update_date,
    plan_finish_date,
    component_no,
    component_region,
    label,
    finishByName,
    finishByPhone,
  } = data;
  const isHandled = type === 1;
  const isOneKey = report_type === '2'; // 是否为一键报修
  const isFire = +orderType === 1 || +orderType === 2;
  data.assign = `${isVague ? nameToVague(finishByName) : finishByName} ${
    isVague ? phoneToVague(finishByPhone) : finishByPhone
  }`;
  data.number =
    component_region || component_region === 0
      ? label
        ? `${component_region}回路${component_no}号 ${label}`
        : `${component_region}回路${component_no}号`
      : label;
  data.unit_name = maintenanceCompanys;

  const days = Math.floor((Date.now() - plan_finish_date) / DAY_MS);

  return (
    <div className={styles.outer}>
      <div className={styles.card} {...restProps}>
        <Icon type="right" style={ARROW_STYLE} />
        <div className={styles.status}>
          <div
            style={{
              backgroundImage: `url(${ICONS_MAP[type === 2 ? `${type}.${status}` : type]})`,
            }}
            className={styles.stamp}
          />
          {type === 7 && (
            <p className={styles.day}>
              已超期
              <span className={styles.days}>{days}</span>天
            </p>
          )}
        </div>
        <p className={styles.time}>
          {/* {moment(isOneKey ? create_date : save_time).format('YYYY-MM-DD HH:mm:ss')} */}
          {moment(isHandled ? update_date : create_date).format('YYYY-MM-DD HH:mm:ss')}
          <span className={styles.info}>{isFire ? '主机报警' : TYPES[isOneKey ? 0 : 1]}</span>
        </p>
        {ITEMS[isOneKey ? 0 : 1].map(item => (
          <p key={item}>
            <span className={styles[STYLES[5 - ITEM_MAP[item].length]]}>{ITEM_MAP[item]}</span>
            {data[item] || NO_DATA}
          </p>
        ))}
      </div>
    </div>
  );
}

export default class WorkOrderDrawer extends PureComponent {
  state = { isWarned: false };

  render() {
    const {
      type,
      handleLabelChange,
      handleCardClick,
      data,
      maintenanceCompanys,
      ...restProps
    } = this.props;
    const { isWarned } = this.state;
    // console.log(data, `workOrderList${type}`);
    const list = data[`workOrderList${type}`];

    const left = (
      <div className={styles.container}>
        {/* {type === 7 && (
          <span
            className={isWarned ? styles.warned : styles.warn}
            onClick={e => this.setState({ isWarned: true })}
          >
            {isWarned ? '已提醒' : '提醒维修'}
          </span>
        )} */}
        <div className={styles.spans}>
          {STATUS.map((s, i) => {
            const t = STATUS_N[i];

            return (
              <span
                key={s}
                className={t === type ? styles.selected : styles.span}
                onClick={e => handleLabelChange(t)}
              >
                {s}-{data[`workOrderList${t}`].length}
              </span>
            );
          })}
        </div>
        <div className={styles.cards}>
          {list.map(item => (
            <OrderCard
              key={item.id}
              type={type}
              data={item}
              maintenanceCompanys={maintenanceCompanys}
              onClick={e => handleCardClick(item)}
            />
          ))}
        </div>
      </div>
    );

    return (
      <DrawerContainer title={`${STATUS_MAP[type]}工单`} width={535} left={left} {...restProps} />
    );
  }
}
