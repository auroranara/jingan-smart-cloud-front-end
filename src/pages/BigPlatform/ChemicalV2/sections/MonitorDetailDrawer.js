import React, { Component } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import classNames from 'classnames';
import moment from 'moment';
import styles from './TankMonitorDrawer/index.less';
import { MonitorConfig } from '../utils';

const NO_DATA = '暂无数据';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const STATUS = ['正常', '预警', '告警'];
const transformCondition = condition => {
  if (condition === '>=') return '≥';
  else if (condition === '<=') return '≤';
  return condition;
};

export default class MonitorDetailDrawer extends Component {
  setScrollReference = scroll => {
    this.scroll = (scroll && scroll.dom) || scroll;
  };

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
      className,
      style,
      visible,
      onClose,
      loading = false,
      monitorType,
      monitorDetail,
      monitorDetail: { emergencyMeasure, monitorParams = [], videoList = [], meList = [] },
      onVideoClick,
    } = this.props;
    const { title = '', fields = [], icon } = MonitorConfig[monitorType] || {};
    const { noFinishWarningProcessId, id } = meList[0] || {};

    return (
      <CustomDrawer
        className={classNames(styles.container, className)}
        style={style}
        title={title}
        visible={visible}
        onClose={onClose}
        sectionProps={{
          scrollProps: { ref: this.setScrollReference },
          spinProps: { loading },
        }}
        zIndex={1566}
        width={535}
      >
        <div className={styles.top}>
          <div className={styles.line}>
            <div className={styles.label}>
              {title.substr(0, title.length - 2)}
              名称：
            </div>
            <div className={styles.value}>
              {fields[0] ? monitorDetail[fields[0].value] : ''}
              {videoList &&
                videoList.length > 0 && (
                  <span className={styles.video} onClick={() => onVideoClick(videoList)} />
                )}
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
          </div>
          {fields.slice(1, fields.length).map((field, index) => {
            const { label, render, value } = field;
            return (
              <div className={styles.line} key={index}>
                <div className={styles.label}>{label}：</div>
                <div className={styles.value}>
                  {render
                    ? render(monitorDetail[value], monitorDetail)
                    : monitorDetail[value] || NO_DATA}
                </div>
              </div>
            );
          })}
          {/* <div className={styles.line}>
            <div className={styles.label}>区域位置：</div>
            <div className={styles.value}>{location || NO_DATA}</div>
          </div>
          <div className={styles.line}>
            <div className={styles.label}>是否关键装置：</div>
            <div className={styles.value}>{+keyDevice === 1 ? '是' : '否'}</div>
          </div>
          <div className={styles.line}>
            <div className={styles.label}>设计压力（KPa）：</div>
            <div className={styles.value}>{pressure || NO_DATA}</div>
          </div> */}
        </div>
        {monitorParams.length > 0 && (
          <div className={styles.middle}>
            <div className={styles.icon}>
              {typeof icon === 'function' ? icon(monitorDetail) : icon}
            </div>
            <div className={styles.infoWrapper}>
              {monitorParams.map((param, index) => {
                const {
                  paramDesc,
                  paramUnit,
                  realValue,
                  status,
                  dataUpdateTime,
                  condition,
                  limitValueStr,
                  fixType,
                } = param;
                return (
                  <div className={styles.paramsWrapper} key={index}>
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
                          {/* {`${STATUS[status]}${
                            condition && limitValueStr
                              ? `（${transformCondition(condition)}${limitValueStr}）`
                              : ''
                          }`} */}
                          {`${STATUS[status]}`}
                        </div>
                      </div>
                    </div>
                    <div className={styles.updateTime}>
                      更新时间：
                      {dataUpdateTime ? moment(dataUpdateTime).format(DEFAULT_FORMAT) : NO_DATA}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CustomDrawer>
    );
  }
}
