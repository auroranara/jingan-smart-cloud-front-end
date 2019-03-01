import React, { PureComponent } from 'react';
import { Button, Icon, Input } from 'antd';

import styles from './AlarmHandle.less';

const { TextArea } = Input;
const BTN_STYLE = { color: 'rgb(4, 253, 255)', borderColor: 'rgb(4, 253, 255)' };

// 1 sos 2 越界  3 长时间不动 4 超员 5 缺员
export default class AlarmHandle extends PureComponent {
  value = '';

  genHandleAlarm = status => e => {
    const { alarmId, handleAlarm } = this.props;
    handleAlarm(alarmId, status, this.value);
    this.onClose();
  };

  onClose = () => {
    const { handleClose } = this.props;
    this.value = '';
    handleClose('alarmHandle');
  }

  handleTextChange = e => {
    // console.log(e.target.value);
    this.value = e.target.value;
  };

  render() {
    const { visible, alarmId, alarms, style, handleAlarm, handleClose, ...restProps } = this.props;
    const newStyle = {
      ...style,
      display: visible ? 'block' : 'none',
    };

    const alarmItem = alarms.find(({ id }) => id === alarmId);
    const isSOS = alarmItem && +alarmItem.type === 1 ? true : false;
    const title = `${isSOS ? 'SOS' : ''}报警处理`;
    const prefix = isSOS ? <span className={styles.sos} /> : <span className={styles.alarmInfo} />;

    return (
      <div className={isSOS ? styles.container : styles.container1} style={newStyle} {...restProps}>
        <h3 className={styles.title}>
          {prefix}
          <span className={styles.titleText}>{title}</span>
        </h3>
        <Icon type="close" className={styles.close} onClick={this.onClose} />
        <TextArea rows={4} placeholder="填写处理信息（30字以内）" onChange={this.handleTextChange} />
        <div className={styles.btn}>
          <Button ghost style={BTN_STYLE} onClick={this.genHandleAlarm(1)}>忽略</Button>
          <Button ghost style={BTN_STYLE} onClick={this.genHandleAlarm(2)}>提交</Button>
        </div>
      </div>
    );
  }
}
