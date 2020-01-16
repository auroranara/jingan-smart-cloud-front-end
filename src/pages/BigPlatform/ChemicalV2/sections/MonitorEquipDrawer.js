import React, { PureComponent, Fragment } from 'react';
import { Icon } from 'antd';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './MonitorEquipDrawer.less';
import iconAlarm from '@/assets/icon-alarm.png';

const NO_DATA = '暂无数据';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const STATUS = ['正常', '预警', '告警'];
const transformCondition = condition => {
  if (condition === '>=') return '≥';
  else if (condition === '<=') return '≤';
  return condition;
};

export default class MonitorEquipDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleWorkOrderIconClick = id => {
    // 工单id
    id && window.open(`${window.publicPath}#/company-iot/alarm-work-order/detail/${id}`);
  };

  handleMonitorTrendIconClick = id => {
    // 监测设备id
    id && window.open(`${window.publicPath}#/company-iot/alarm-work-order/monitor-trend/${id}`);
  };

  render() {
    const {
      visible,
      onClose,
      monitorMarker: {
        equipmentTypeName,
        name,
        areaLocation,
        beMonitorTargetName,
        type,
        allMonitorParam = [],
        videoList,
        targetId,
        noFinishWarningProcessId,
        id,
      },
      handleShowVideo,
      handleClickShowMonitorDetail,
    } = this.props;

    return (
      <DrawerContainer
        title={
          <div className={styles.titleWrapper}>
            {equipmentTypeName}
            <div className={styles.jumperWrapper}>
              <span
                onClick={() => this.handleWorkOrderIconClick(noFinishWarningProcessId)}
                style={{ display: noFinishWarningProcessId ? 'inline-block' : 'none' }}
              />
              <span
                onClick={() => this.handleMonitorTrendIconClick(id)}
                style={{ display: id ? 'inline-block' : 'none' }}
              />
            </div>
          </div>
        }
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <div className={styles.name}>
                <span className={styles.label}>监测设备名称：</span>
                {name}
                {videoList &&
                  videoList.length > 0 && (
                    <span className={styles.video} onClick={() => handleShowVideo(videoList)} />
                  )}
              </div>
              <div>
                <span className={styles.locIcon} style={{ marginRight: '5px' }}>
                  <Icon type="environment" />
                </span>
                {areaLocation || '暂无位置数据'}
              </div>
            </div>

            {type &&
              targetId && (
                <div className={styles.wrapper}>
                  <div className={styles.targetWrapper}>
                    <span className={styles.label}>监测对象：</span>
                    {beMonitorTargetName}
                    <div
                      className={styles.more}
                      onClick={() => handleClickShowMonitorDetail(type, targetId)}
                    >
                      详情>>
                    </div>
                  </div>
                </div>
              )}

            {allMonitorParam.length > 0 && (
              <div className={styles.wrapper}>
                {allMonitorParam.map((item, index) => {
                  const {
                    status,
                    paramDesc,
                    paramUnit,
                    logoWebUrl,
                    realValue,
                    dataUpdateTime,
                    condition,
                    limitValueStr,
                    fixType,
                  } = item;
                  return (
                    <div className={styles.paramsWrapper} key={index}>
                      <div
                        className={styles.icon}
                        style={{
                          background: `url(${logoWebUrl}) center center / 100% auto no-repeat`,
                        }}
                      />
                      <div className={styles.params}>
                        <div className={styles.lineWrapper}>
                          <div className={styles.line}>
                            <div className={styles.label}>
                              {paramDesc}
                              {+fixType !== 5 && `(${paramUnit})：`}
                            </div>
                            {+fixType !== 5 && (
                              <div className={styles.value}>{realValue || NO_DATA}</div>
                            )}
                          </div>
                          <div className={styles.line}>
                            <div className={styles.label}>状态：</div>
                            <div
                              className={styles.value}
                              style={{ color: +status > 0 ? '#ff4848' : '#11B409' }}
                            >
                              {`${STATUS[status]}${
                                condition && limitValueStr && +fixType !== 5
                                  ? `(${transformCondition(condition)}${limitValueStr})`
                                  : ''
                              }`}
                            </div>
                          </div>
                        </div>
                        <div className={styles.updateTime}>
                          更新时间：
                          {dataUpdateTime ? moment(dataUpdateTime).format(DEFAULT_FORMAT) : NO_DATA}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        }
      />
    );
  }
}
