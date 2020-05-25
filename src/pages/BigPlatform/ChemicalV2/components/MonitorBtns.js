import React, { PureComponent, Fragment } from 'react';
import { Tooltip } from 'antd';
import styles from './MonitorBtns.less';

export default class MonitorBtns extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleWorkOrderIconClick = id => {
    const { targetId, targetType, targetName } = this.props;
    if (targetId) {
      // 监测对象跳转到列表
      window.open(
        `${
          window.publicPath
        }#/company-iot/alarm-work-order/list?monitorObjectType=${targetType}&monitorObjectName=${targetName}&monitorObject=${targetId}&status=2`
      );
      return;
    }
    // 工单id
    id && window.open(`${window.publicPath}#/company-iot/alarm-work-order/detail/${id}`);
  };

  handleMonitorTrendIconClick = id => {
    // 监测设备id
    id && window.open(`${window.publicPath}#/company-iot/alarm-work-order/monitor-trend/${id}`);
  };

  render() {
    const {
      style = {},
      videoList = [],
      onVideoClick,
      noFinishWarningProcessId,
      monitorEquipmentId,
    } = this.props;

    return (
      <div className={styles.container} style={style}>
        {videoList &&
          videoList.length > 0 && (
            <Tooltip placement="bottom" title={'摄像头'} overlayStyle={{ zIndex: 9999 }}>
              <span
                className={styles.video}
                onClick={onVideoClick ? () => onVideoClick(videoList) : undefined}
              />
            </Tooltip>
          )}
        {noFinishWarningProcessId && (
          <Tooltip placement="bottom" title={'处理报警'} overlayStyle={{ zIndex: 9999 }}>
            <span
              className={styles.workOrder}
              onClick={() => this.handleWorkOrderIconClick(noFinishWarningProcessId)}
            />
          </Tooltip>
        )}
        {monitorEquipmentId && (
          <Tooltip placement="bottom" title={'趋势统计'} overlayStyle={{ zIndex: 9999 }}>
            <span
              className={styles.trend}
              onClick={() => this.handleMonitorTrendIconClick(monitorEquipmentId)}
            />
          </Tooltip>
        )}
      </div>
    );
  }
}
