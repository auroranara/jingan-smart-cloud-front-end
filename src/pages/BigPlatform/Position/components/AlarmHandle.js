import React, { PureComponent } from 'react';
import { Button, Icon, Input } from 'antd';

import styles from './AlarmHandle.less';

const { TextArea } = Input;
const BTN_STYLE = { color: 'rgb(4, 253, 255)', borderColor: 'rgb(4, 253, 255)' };

// 1 sos 2 越界  3 长时间不动 4 超员 5 缺员
export default class AlarmHandle extends PureComponent {
  state = { value: '' };

  genHandleAlarm = (status) => e => {
    const { alarmId, cardId, handleAlarm, handleSOS } = this.props;
    if (cardId)
      status === 2 && handleSOS(cardId);
    else
      handleAlarm(alarmId, status, this.value);
    this.onClose();
  };

  onClose = () => {
    const { handleClose } = this.props;
    this.setState({ value: '' });
    handleClose();
  }

  handleTextChange = e => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { visible, cardId, positionList, alarmId, alarms, style, handleAlarm, handleSOS, handleClose, ...restProps } = this.props;
    const { value } = this.state;
    const newStyle = {
      ...style,
      display: visible ? 'block' : 'none',
    };

    const alarmItem = alarms.find(({ id }) => id === alarmId);
    const isSOS = alarmItem && +alarmItem.type === 1 ? true : false;
    const title = `${isSOS ? 'SOS' : ''}报警处理`;
    const prefix = isSOS ? <span className={styles.sos} /> : <span className={styles.alarmInfo} />;

    return (
      <div className={styles.container} style={newStyle} {...restProps}>
        <h3 className={styles.title}>
          {prefix}
          <span className={styles.titleText}>{title}</span>
        </h3>
        <Icon type="close" className={styles.close} onClick={this.onClose} />
        <TextArea rows={4} placeholder="填写处理信息（30字以内）" value={value} onChange={this.handleTextChange} />
        <div className={styles.btn}>
          <Button ghost style={BTN_STYLE} onClick={this.genHandleAlarm(1)}>忽略</Button>
          <Button ghost style={BTN_STYLE} onClick={this.genHandleAlarm(2)}>提交</Button>
        </div>
      </div>
    );
  }
}
