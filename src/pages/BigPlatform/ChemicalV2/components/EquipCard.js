import React, { PureComponent, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import moment from 'moment';
import { Tooltip } from 'antd';
import { MonitorBtns } from '../components/Components';
import styles from './EquipCard.less';
// 可燃气体图片
const iconFlamGas = 'http://data.jingan-china.cn/v2/chem/chemScreen/gas.png';
// 有毒气体图片
const iconToxicGas = 'http://data.jingan-china.cn/v2/chem/chemScreen/poison.png';

const NO_DATA = '暂无数据';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const STATUS = ['正常', '预警', '告警'];
const transformCondition = condition => {
  if (condition === '>=') return '≥';
  else if (condition === '<=') return '≤';
  return condition;
};
function toFixed(value, digit = 2) {
  return Number.parseFloat(value.toFixed(digit));
}
const formatTime = time => (time ? moment(time).format(DEFAULT_FORMAT) : NO_DATA);

export default class EquipCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
        id: monitorEquipmentId,
        warnStatus,
        equipmentType,
      },
      handleShowVideo,
      handleClickShowMonitorDetail,
      noborder,
    } = this.props;

    return (
      <div className={styles.container} style={{ border: noborder ? 'none' : undefined }}>
        <div className={styles.wrapper} style={{ paddingTop: noborder ? 0 : undefined }}>
          <div className={styles.name}>
            {/* <span className={styles.label}>监测设备名称：</span> */}
            {name}
            {/* {videoList &&
            videoList.length > 0 && (
              <span className={styles.video} onClick={() => handleShowVideo(videoList)} />
            )} */}
            <MonitorBtns
              videoList={videoList}
              noFinishWarningProcessId={noFinishWarningProcessId}
              monitorEquipmentId={monitorEquipmentId}
              onVideoClick={handleShowVideo}
              style={{ top: 0, right: 0 }}
            />
          </div>
          <div style={{ color: '#7c93b1' }}>
            <span className={styles.locIcon} style={{ marginRight: '5px' }}>
              <LegacyIcon type="environment" />
            </span>
            {areaLocation || '暂无数据'}
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
                linkStatus,
                fixType,
                linkStatusUpdateTime,
                limitValue,
              } = item;
              const value = linkStatus === -1 ? '--' : realValue;
              // 有毒，可燃
              let logo = logoWebUrl;
              if (equipmentType === '405') logo = iconFlamGas;
              else if (equipmentType === '406') logo = iconToxicGas;

              return (
                <div className={styles.paramsWrapper} key={index}>
                  <div
                    className={styles.icon}
                    style={{
                      background: `url(${logo}) center center / 100% auto no-repeat`,
                    }}
                  />
                  <div className={styles.params}>
                    <div className={styles.lineWrapper}>
                      <div className={styles.line}>
                        <div className={styles.label}>
                          {paramDesc}
                          {+fixType !== 5 && `(${paramUnit})`}
                        </div>
                        {/* {+fixType !== 5 && (
                        <div className={styles.value}>
                          {realValue || realValue === 0 ? realValue : NO_DATA}
                        </div>
                      )} */}
                      </div>
                      {/* <div className={styles.line}>
                      <div className={styles.label}>状态：</div>
                      <div
                        className={styles.value}
                        style={{ color: +status > 0 ? '#ff4848' : '#11B409' }}
                      >
                        {`${+fixType === 5 && +status !== 0 ? '火警' : STATUS[+status]}${
                          condition && limitValueStr && +fixType !== 5
                            ? `(${transformCondition(condition)}${limitValueStr})`
                            : ''
                        }`}
                      </div>
                    </div> */}
                    </div>
                    <div
                      className={styles.updateTime}
                      style={{ color: status > 0 ? '#ff1325' : '#fff' }}
                    >
                      {/* 更新时间：
                    {dataUpdateTime ? formatTime(dataUpdateTime) : NO_DATA} */}
                      {fixType === 5 && (
                        <Tooltip
                          title={
                            +linkStatus !== -1 ? (
                              status > 0 ? (
                                <div>
                                  <div>{`最近更新时间：${formatTime(dataUpdateTime)}`}</div>
                                </div>
                              ) : (
                                `最近更新时间：${formatTime(dataUpdateTime)}`
                              )
                            ) : (
                              `失联时间：${formatTime(linkStatusUpdateTime)}`
                            )
                          }
                          overlayStyle={{ zIndex: 9999 }}
                        >
                          <span>{status > 0 ? '有' : '无'}</span>
                        </Tooltip>
                      )}
                      {fixType !== 5 && (
                        <Tooltip
                          title={
                            +linkStatus !== -1 ? (
                              status > 0 ? (
                                <div>
                                  <div>
                                    {`${condition === '>=' ? '超过' : '低于'}${
                                      +status === 1 ? '预' : '告'
                                    }警阈值 `}
                                    <span style={{ color: '#ff1325' }}>
                                      {toFixed(Math.abs(realValue - limitValue))}
                                    </span>
                                    {` ${paramUnit || ''}`}
                                  </div>
                                  <div>{`最近更新时间：${formatTime(dataUpdateTime)}`}</div>
                                </div>
                              ) : (
                                `最近更新时间：${formatTime(dataUpdateTime)}`
                              )
                            ) : (
                              `失联时间：${formatTime(linkStatusUpdateTime)}`
                            )
                          }
                          overlayStyle={{ zIndex: 9999 }}
                        >
                          {value}
                        </Tooltip>
                      )}
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
