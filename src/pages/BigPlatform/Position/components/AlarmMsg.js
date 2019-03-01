import React from 'react';
import moment from 'moment';
import { Button, Icon } from 'antd';

import styles from './AlarmMsg.less';

const ICON_STYLE = { color: '#FFF', fontSize: 16, position: 'absolute', top: 10, right: 15, cursor: 'pointer' };
const BTN_STYLE = { color: 'rgb(4, 253, 255)', borderColor: 'rgb(4, 253, 255)', position: 'absolute', left: '50%', bottom: 25, transform: 'translateX(-50%)' };

export default function AlarmMsg(props) {
  const {
    visible,
    style,
    data={},
    handleShowAlarmHandle,
    handleClose,
    ...restProps
  } = props;
  const { id, typeName, areaName, warningTime } = data;

  const newStyle = {
    ...style,
    display: visible ? 'block' : 'none',
  };

  return (
    <div className={styles.container} style={newStyle} {...restProps}>
      <Icon type="close" style={ICON_STYLE} onClick={e => handleClose('alarmMsg')} />
      <Button ghost style={BTN_STYLE} onClick={e => handleShowAlarmHandle(id)}>处理</Button>
      <h5 className={styles.title}>
        <span className={styles.info} />
        报警信息
      </h5>
      <p>区域名称：{areaName}</p>
      <p>报警类型：{typeName}</p>
      <p>报警时间：{moment(warningTime).format('YYYY-MM-DD HH:mm:ss')}</p>
    </div>
  );
}
