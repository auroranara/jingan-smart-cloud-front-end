import React from 'react';
import { Button, Input } from 'antd';

import styles from './AlarmHandle.less';
import bg from '../imgs/handleCard.png';

const { TextArea } = Input;
const BTN_STYLE = { color: 'rgb(4, 253, 255)', borderColor: 'rgb(4, 253, 255)' };

export default function AlarmHandle(props) {
  // type 0 sos 1 越界
  const { visible, prefix, title, type=0, style, handleSubmit, handleClose, ...restProps } = props;
  const newStyle = {
    backgroundImage: `url(${bg})`,
    ...style,
    display: visible ? 'block' : 'none',
  };

  return (
    <div className={type ? styles.container1 : styles.container} style={newStyle} {...restProps}>
      <h3 className={styles.title}>
        {prefix}
        <span className={styles.titleText}>{title}</span>
      </h3>
      <TextArea rows={4} placeholder="填写处理信息（30字以内）" />
      <div className={styles.btn}>
        <Button ghost style={BTN_STYLE} onClick={e => handleSubmit()}>提交</Button>
        <Button ghost style={BTN_STYLE} onClick={e => handleClose()}>取消</Button>
      </div>
    </div>
  );
}
