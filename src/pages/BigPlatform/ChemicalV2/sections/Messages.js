import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Icon, Divider } from 'antd';
// 引入样式文件
import styles from './Messages.less';
import iconAlarm from '../imgs/icon-msgAlarm.png';
import { MonitorList } from '../utils';

export default class Messages extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    const { style = {}, setDrawerVisible, handleParentChange } = this.props;
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
          {/* {msgs.map((item, index)=>)} */}
          <div className={styles.msgItem}>
            <Divider className={styles.timeDivider}>
              <span className={styles.time}>9:13:21</span>
            </Divider>
            <div
              className={styles.msgContent}
              style={{
                background: `url(${iconAlarm}) 1px -8px / 30px 30px no-repeat`,
              }}
              onClick={() =>
                setDrawerVisible('monitorDetail', {
                  monitorType: 6,
                  monitorData: MonitorList[6][0],
                })
              }
            >
              <Icon type="right" className={styles.rightIcon} />
              <div className={styles.title}>【可燃有毒气体监测】</div>
              <div className={styles.alarm}>当前浓度为65%LEL，超过告警值12%LEL</div>
              <div className={styles.content}>
                <span className={styles.label}>监测设备：</span>
                可燃有毒气体监测设备
              </div>
              <div className={styles.content}>
                <span className={styles.label}>区域位置：</span>
                仓库-1号仓库
              </div>
            </div>
          </div>

          <div className={styles.msgItem}>
            <Divider className={styles.timeDivider}>
              <span className={styles.time}>10:31:11</span>
            </Divider>
            <div
              className={styles.msgContent}
              style={{
                background: `url(${iconAlarm}) 1px -8px / 30px 30px no-repeat`,
              }}
              onClick={() =>
                setDrawerVisible('monitorDetail', {
                  monitorType: 2,
                  monitorData: MonitorList[2][0],
                })
              }
            >
              <Icon type="right" className={styles.rightIcon} />
              <div className={styles.title}>【储罐监测】</div>
              <div className={styles.alarm}>温度为68℃，超过预警值8℃</div>
              <div className={styles.content}>
                <span className={styles.label}>监测设备：</span>
                储罐监测设备
              </div>
              <div className={styles.content}>
                <span className={styles.label}>区域位置：</span>
                储罐监测点A
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
