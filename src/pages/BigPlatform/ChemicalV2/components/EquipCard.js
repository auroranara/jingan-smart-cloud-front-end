import React, { PureComponent, Fragment } from 'react';
import { Icon } from 'antd';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './EquipCard.less';
import iconAlarm from '@/assets/icon-alarm.png';
import iconVideo from '../imgs/icon-video.png';
import iconWorkOrder from '../imgs/icon-work-order.png';
import iconTrend from '../imgs/icon-trend.png';

const NO_DATA = '暂无数据';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const STATUS = ['正常', '预警', '告警'];
const transformCondition = condition => {
  if (condition === '>=') return '≥';
  else if (condition === '<=') return '≤';
  return condition;
};

export default class EquipCard extends PureComponent {
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
      data: {
        equipmentTypeName,
        name,
        areaLocation,
        beMonitorTargetName,
        beMonitorTargetType,
        allMonitorParam = [],
        videoList,
        targetId,
        noFinishWarningProcessId,
        id,
        warnStatus,
      },
      handleShowVideo,
      handleClickShowMonitorDetail,
    } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.name}>
            <span className={styles.label}>监测设备名称：</span>
            {name}
            <div className={styles.iconsWrapper}>
              {+warnStatus === -1 && (
                <span
                  className={styles.icon}
                  style={{
                    background: `url(${iconAlarm}) center center / auto 80% no-repeat`,
                    position: 'absolute',
                    right: '144px',
                    top: 0,
                  }}
                />
              )}
              {videoList &&
                videoList.length > 0 && (
                  <span
                    className={styles.icon}
                    style={{
                      background: `url(${iconVideo}) center center / 70% auto no-repeat`,
                    }}
                    onClick={() => handleShowVideo(videoList)}
                  />
                )}
              <span
                onClick={() => this.handleWorkOrderIconClick(noFinishWarningProcessId)}
                className={styles.icon}
                style={{
                  display: noFinishWarningProcessId ? 'inline-block' : 'none',
                  background: `url(${iconWorkOrder}) center center / auto 80% no-repeat`,
                }}
              />
              <span
                onClick={() => this.handleMonitorTrendIconClick(id)}
                className={styles.icon}
                style={{
                  display: id ? 'inline-block' : 'none',
                  background: `url(${iconTrend}) center center / auto 80% no-repeat`,
                }}
              />
            </div>
          </div>
          <div>
            <span className={styles.locIcon} style={{ marginRight: '5px' }}>
              <Icon type="environment" />
            </span>
            {areaLocation || '暂无位置数据'}
          </div>
        </div>

        {beMonitorTargetType &&
          targetId && (
            <div className={styles.wrapper}>
              <div className={styles.targetWrapper}>
                <span className={styles.label}>监测对象：</span>
                {beMonitorTargetName}
                <div
                  className={styles.more}
                  onClick={() => handleClickShowMonitorDetail(beMonitorTargetType, targetId)}
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
                linkStatusUpdateTime,
                linkStatus,
              } = item;
              const updateTime = +linkStatus === -1 ? linkStatusUpdateTime : dataUpdateTime;
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
                          <div className={styles.value}>
                            {realValue || realValue === 0 ? realValue : NO_DATA}
                          </div>
                        )}
                      </div>
                      <div className={styles.line}>
                        <div className={styles.label}>状态：</div>
                        <div
                          className={styles.value}
                          style={{ color: +status > 0 ? '#ff4848' : '#11B409' }}
                        >
                          {`${+fixType === 5 ? '火警' : STATUS[+status]}${
                            condition && limitValueStr && +fixType !== 5
                              ? `(${transformCondition(condition)}${limitValueStr})`
                              : ''
                          }`}
                        </div>
                      </div>
                    </div>
                    <div className={styles.updateTime}>
                      更新时间：
                      {updateTime ? moment(updateTime).format(DEFAULT_FORMAT) : NO_DATA}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
