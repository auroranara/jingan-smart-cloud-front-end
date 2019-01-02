import React from 'react';
import { Button, Icon } from 'antd';
import router from 'umi/router';

import styles from './PersonInfo.less';
import bg from '../imgs/personCard.png';
import Zhang from '../imgs/zhang.png';
import sosIcon from '../imgs/sos.png';

const PHONE = '13270801232';

const ICON_STYLE = { color: '#FFF', fontSize: 16, position: 'absolute', top: 10, right: 15, cursor: 'pointer' };
const BTN_STYLE = { color: 'rgb(4, 253, 255)', borderColor: 'rgb(4, 253, 255)', position: 'absolute', left: '50%', bottom: 25, transform: 'translateX(-50%)' };

export default function PersonInfo(props) {
  const {
    visible,
    data: { sos: isSOS, cardId, userName: name, phone=PHONE, cardCode: code, department, areaName: section }={},
    style,
    handleClose,
    handleSOS,
    ...restProps
  } = props;

  const newStyle = {
    backgroundImage: `url(${bg})`,
    // paddingBottom: isSOS ? 70 : 15,
    ...style,
    display: visible ? 'block' : 'none',
  };

  return (
    <div className={styles.container} style={newStyle} {...restProps}>
      <Icon type="close" style={ICON_STYLE} onClick={e => handleClose()} />
      <div className={styles.img} style={{ backgroundImage: `url(${Zhang})` }} />
      {isSOS
        ? <Button ghost style={BTN_STYLE} onClick={e => handleSOS(cardId)}>处理</Button>
        : <Button ghost style={BTN_STYLE} onClick={e => router.push(`/big-platform/position/history/${cardId}`)}>历史轨迹</Button>
      }
      <h3 className={styles.name}>
        {name || '暂无名字'}
        {isSOS && <span className={styles.sos} style={{ backgroundImage: `url(${sosIcon})` }} />}
      </h3>
      <p>电话：{phone}</p>
      <p>编号：{code}</p>
      <p>部门：{department}</p>
      <p>区域：{section}</p>
    </div>
  );
}
