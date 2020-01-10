import React, { Component } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import classNames from 'classnames';
import moment from 'moment';
import styles from './TankMonitorDrawer/index.less';
import { MonitorConfig } from '../utils';

const NO_DATA = '暂无数据';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export default class MonitorDetailDrawer extends Component {
  setScrollReference = scroll => {
    this.scroll = (scroll && scroll.dom) || scroll;
  };

  handleWorkOrderIconClick = () => {
    const { tankDetail: { id = 1 } = {} } = this.props;
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/detail/${id}`);
  };

  handleMonitorTrendIconClick = () => {
    const { tankDetail: { id = 1 } = {} } = this.props;
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/monitor-trend/${id}`);
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
      monitorDetail: { emergencyMeasure, monitorParams = [], videoList = [] },
      onVideoClick,
    } = this.props;
    const { title = '', fields = [], icon } = MonitorConfig[monitorType] || {};

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
                <span onClick={this.handleWorkOrderIconClick} />
                <span onClick={this.handleMonitorTrendIconClick} />
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
                const { paramDesc, paramUnit, realValue, status, dataUpdateTime } = param;
                return (
                  <div className={styles.paramsWrapper} key={index}>
                    <div className={styles.lineWrapper}>
                      <div className={styles.line}>
                        <div className={styles.label}>
                          {paramDesc}（{paramUnit}
                          ）：
                        </div>
                        <div className={styles.value}>{realValue || NO_DATA}</div>
                      </div>
                      <div className={styles.line}>
                        <div className={styles.label}>状态：</div>
                        <div
                          className={styles.value}
                          style={{ color: +status > 0 ? '#ff4848' : '#0ff' }}
                        >
                          {+status > 0 ? '报警' : '正常'}
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
