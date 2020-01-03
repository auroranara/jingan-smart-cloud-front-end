import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Icon, Divider } from 'antd';
import Message from '../components/Message';
// 引入样式文件
import styles from './Messages.less';
import iconAlarm from '../imgs/icon-msgAlarm.png';
import { MsgShowTypes, TypeClickList } from '../utils';

export default class Messages extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    const { style = {}, setDrawerVisible, handleParentChange, handleGasOpen, model } = this.props;
    return (
      <div className={styles.container} style={{ ...style }}>
        <div className={styles.shrinkContainer}>
          <Icon
            type="shrink"
            className={styles.shrink}
            onClick={() => handleParentChange({ msgVisible: false })}
          />
        </div>
        <div className={styles.scroll}>
          <Message
            cssType="1"
            model={model}
            showTypes={MsgShowTypes}
            typeClickList={TypeClickList}
          />
        </div>
      </div>
    );
  }
}
