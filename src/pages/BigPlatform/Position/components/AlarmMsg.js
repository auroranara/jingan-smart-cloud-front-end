import React from 'react';
import { Button, Icon } from 'antd';

import styles from './AlarmMsg.less';
import bg from '../imgs/alarmCard.png';
import infoIcon from '../imgs/alarmInfo.png';

const ICON_STYLE = { color: '#FFF', fontSize: 16, position: 'absolute', top: 10, right: 15, cursor: 'pointer' };
const BTN_STYLE = { color: 'rgb(4, 253, 255)', borderColor: 'rgb(4, 253, 255)', position: 'absolute', left: '50%', bottom: 25, transform: 'translateX(-50%)' };

export default function AlarmMsg(props) {
  const {
    visible,
    style,
    data={},
    handleAlarm,
    handleClose,
    ...restProps
  } = props;
  const { cardId, type, areaName: section, uptime: time } = data;

  const newStyle = {
    backgroundImage: `url(${bg})`,
    ...style,
    display: visible ? 'block' : 'none',
  };

  return (
    <div className={styles.container} style={newStyle} {...restProps}>
      <Icon type="close" style={ICON_STYLE} onClick={e => handleClose()} />
      <Button ghost style={BTN_STYLE} onClick={e => handleAlarm(cardId)}>处理</Button>
      <h5 className={styles.title}>
        <span className={styles.info} style={{ backgroundImage: `url(${infoIcon})` }} />
        报警信息
      </h5>
      <p>区域名称：{section}</p>
      <p>报警类型：越界</p>
      <p>报警时间：{time}</p>
    </div>
  );
}
