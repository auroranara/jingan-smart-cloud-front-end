import React, { PureComponent } from 'react';
import { Button, Icon, message } from 'antd';

import styles from './PersonInfo.less';
import { getUserName } from '../utils';

const NO_DATA = '暂无信息';
const ICON_STYLE = { color: '#FFF', fontSize: 16, position: 'absolute', top: 10, right: 15, cursor: 'pointer' };
const BTN_STYLE = { color: 'rgb(4, 253, 255)', borderColor: 'rgb(4, 253, 255)', position: 'absolute', left: '50%', bottom: 25, transform: 'translateX(-50%)' };

export default class PersonInfo extends PureComponent {
  onClose = e => {
    const { handleClose } = this.props;
    handleClose('personInfo');
  };

  handleAlarmClick = e => {
    const {
      alarms,
      personItem: { cardId },
      handleShowAlarmHandle,
    } = this.props;

    const alarmItem = alarms.find(({ cardId: id }) => id === cardId);
    const alarmId = alarmItem ? alarmItem.id : undefined;

    // 若还报警，但在报警列表里没有该cardId对应的报警，则为已处理，但还显示报警
    if (!alarmId) {
      message.warn('该条报警信息已处理，请勿重复处理！');
      return;
    }

    handleShowAlarmHandle(alarmId);
    this.onClose();
  };

  render() {
    const {
      visible,
      companyId,
      alarms,
      personItem,
      style,
      handleShowAlarmHandle,
      handleClose,
      ...restProps
    } = this.props;

    const { sos: isSOS, cardId, cardType, phoneNumber, visitorPhone, cardCode, areaName, departmentName } = personItem;
    const name = getUserName(personItem);
    const phone = +cardType ? visitorPhone : phoneNumber;

    const newStyle = {
      // paddingBottom: isSOS ? 70 : 15,
      ...style,
      display: visible ? 'block' : 'none',
    };

    return (
      <div className={styles.container} style={newStyle} {...restProps}>
        <Icon type="close" style={ICON_STYLE} onClick={this.onClose} />
        <div
          className={styles.img}
          // style={{ backgroundImage: `url(${zhangIcon})`}}
        />
        {isSOS
          ? <Button ghost style={BTN_STYLE} onClick={this.handleAlarmClick}>处理</Button>
          : <Button ghost style={BTN_STYLE} onClick={e => console.log('target')}>目标跟踪</Button>
        }
        <h3 className={styles.name}>
          {name || '暂无名字'}
          {isSOS && <span className={styles.sos} />}
        </h3>
        <p>电话：{phone || NO_DATA}</p>
        <p>卡号：{cardCode || NO_DATA}</p>
        <p>部门：{departmentName || '产品部'}</p>
        <p>区域：{areaName || NO_DATA}</p>
      </div>
    );
  }
}
