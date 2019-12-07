import React, { Component, Fragment } from 'react';
import { Spin, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DataStatistics from './DataStatistics';
import MonitorDataTrend from './MonitorDataTrend';
import { connect } from 'dva';
import {
  MAJOR_HAZARD_URL,
  TANK_REAL_TIME_URL,
} from '../../URLS';
import iconTank from '../../imgs/icon-tank.png';
import iconIsMajorHazard from '../../imgs/icon-is-major-hazard.png';
import iconAddress from '../../imgs/icon-address.png';
import styles from './index.less';

const GET_TANK_DETAIL = 'majorHazardMonitor/getTankDetail';
const GET_TANK_DATA_STATISTICS = 'majorHazardMonitor/getTankDataStatistics';
const GET_TANK_MONITOR_DATA_TREND = 'majorHazardMonitor/getTankMonitorDataTrend';
const SAVE = 'majorHazardMonitor/save';
const TITLE = '储罐详情';
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '物联网监测',
    name: '物联网监测',
  },
  {
    title: '重大危险源监测',
    name: '重大危险源监测',
    href: MAJOR_HAZARD_URL,
  },
  {
    title: '储罐实时监测',
    name: '储罐实时监测',
    href: TANK_REAL_TIME_URL,
  },
  {
    title: TITLE,
    name: TITLE,
  },
];

@connect(({
  user,
  majorHazardMonitor,
  loading,
}) => ({
  user,
  majorHazardMonitor,
  loading: loading.effects[GET_TANK_DETAIL],
  loadingDataStatistics: loading.effects[GET_TANK_DATA_STATISTICS],
  loadingMonitorDataTrend: loading.effects[GET_TANK_MONITOR_DATA_TREND],
}), dispatch => ({
  getTankDetail(payload, callback) {
    dispatch({
      type: GET_TANK_DETAIL,
      payload,
      callback(success, data) {
        if (!success) {
          message.error('获取储罐详情失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
  getTankDataStatistics(payload, callback) {
    dispatch({
      type: GET_TANK_DATA_STATISTICS,
      payload,
      callback(success, data) {
        if (!success) {
          message.error('获取数据统计失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
  getTankMonitorDataTrend(payload, callback) {
    dispatch({
      type: GET_TANK_MONITOR_DATA_TREND,
      payload,
      callback(success, data) {
        if (!success) {
          message.error('获取监测数据趋势失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
  setDetail(payload, callback) {
    dispatch({
      type: SAVE,
      payload: {
        tankDetail: {},
        ...payload,
      },
      callback,
    });
  },
}))
export default class TankDetail extends Component {
  componentDidMount() {
    this.getDetail();
  }

  componentWillUnmount() {
    const { setDetail } = this.props;
    setDetail();
  }

  /**
   * 获取详情
   */
  getDetail = () => {
    const {
      match: {
        params: {
          id,
        },
      },
      getTankDetail,
    } = this.props;
    getTankDetail({
      id,
    });
  }

  /**
   * 获取数据统计
   */
  getDataStatistics = (payload) => {
    const {
      match: {
        params: {
          id,
        },
      },
      getTankDataStatistics,
    } = this.props;
    getTankDataStatistics({
      id,
      ...payload,
    });
  }

  /**
   * 获取监测数据趋势
   */
  getMonitorDataTrend = (payload, callback) => {
    const {
      match: {
        params: {
          id,
        },
      },
      getTankMonitorDataTrend,
    } = this.props;
    getTankMonitorDataTrend({
      id,
      ...payload,
    }, callback);
  }

  render() {
    const {
      majorHazardMonitor: {
        tankDetail: {
          name,
          status,
          isMajorHazard,
          address,
          number,
          tankArea,
          storage,
        }={},
      },
      loading,
      loadingDataStatistics,
      loadingMonitorDataTrend,
    } = this.props;

    return (
      <PageHeaderLayout
        className={styles.container}
        breadcrumbList={BREADCRUMB_LIST}
        logo={<img className={styles.icon} src={iconTank} alt="" />}
        title={(
          <div className={styles.nameWrapper}>
            <div className={styles.name}>{name}</div>
            {status > 0 && <div className={styles.alarmMarker}>报警</div>}
            {isMajorHazard > 0 && <div className={styles.majorHazard} style={{ backgroundImage: `url(${iconIsMajorHazard})` }}>构成重大危险源</div>}
          </div>
        )}
        content={(
          <Fragment>
            <div className={styles.address} style={{ backgroundImage: `url(${iconAddress})` }}>{address}</div>
            <div className={styles.number}><span className={styles.label}>位号：</span>{number}</div>
            <div className={styles.tankArea}><span className={styles.label}>所属罐区：</span>{tankArea}</div>
            <div className={styles.storage}><span className={styles.label}>存储物质：</span>{storage}</div>
          </Fragment>
        )}
      >
        <Spin spinning={!!loading}>
          <DataStatistics
            className={styles.card}
            majorHazardMonitor={this.props.majorHazardMonitor}
            loadingDataStatistics={loadingDataStatistics}
            getDataStatistics={this.getDataStatistics}
          />
          <MonitorDataTrend
            className={styles.card}
            majorHazardMonitor={this.props.majorHazardMonitor}
            loadingMonitorDataTrend={loadingMonitorDataTrend}
            getMonitorDataTrend={this.getMonitorDataTrend}
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
