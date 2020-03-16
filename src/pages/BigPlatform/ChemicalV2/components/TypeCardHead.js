import React, { PureComponent } from 'react';

import styles from './TypeCard.less';

export default class TypeCardHead extends PureComponent {
  handleWorkOrderIconClick = (workOrderId, id) => {
    if (workOrderId)
      window.open(`${window.publicPath}#/company-iot/alarm-work-order/detail/${workOrderId}`);
    else window.open(`${window.publicPath}#/company-iot/alarm-work-order/list?id=${id}`);
  };

  handleMonitorTrendIconClick = id => {
    // 监测设备id
    id && window.open(`${window.publicPath}#/company-iot/alarm-work-order/monitor-trend/${id}`);
  };

  handleClickDetail = () => {
    const {
      data: { id },
      type,
    } = this.props;
    let url;
    switch (type) {
      case 304:
        // 库房
        url = 'major-hazard-info/storehouse/edit';
        break;
      case 302:
        // 储罐
        url = 'major-hazard-info/storage-management/edit';
        break;
      case 311:
        // 生产装置
        url = 'major-hazard-info/production-equipments/edit';
        break;
      case 312:
        // 气柜
        url = 'major-hazard-info/gasometer/detail';
        break;
      case 314:
        // 管道
        url = 'major-hazard-info/pipeline/detail';
        break;
      default:
        url = 'major-hazard-info/storage-management/edit';
        break;
    }
    window.open(`${window.publicPath}#/${url}/${id}`);
  };

  render() {
    const { labelList, alarming, data } = this.props;
    const { meList } = data;
    const { noFinishWarningProcessId, id } = meList[0] || {};

    return (
      <div className={styles.head}>
        {labelList.map(([name, value], i) => (
          <p className={styles.p} key={i}>
            <span className={styles.label}>{name}：</span>
            {value}
            {!i && alarming && <span className={styles.alarm} />}
          </p>
        ))}
        {meList.length > 0 && (
          <div className={styles.icons}>
            {noFinishWarningProcessId && (
              <span
                className={styles.sheet}
                onClick={() => this.handleWorkOrderIconClick(noFinishWarningProcessId, id)}
              />
            )}
            {id && (
              <span className={styles.trend} onClick={() => this.handleMonitorTrendIconClick(id)} />
            )}
          </div>
        )}
        <span className={styles.detail} onClick={this.handleClickDetail}>
          详情信息>
        </span>
      </div>
    );
  }
}
