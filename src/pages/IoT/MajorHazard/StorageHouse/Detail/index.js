import React, { Component, Fragment } from 'react';
import { Spin, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import DataStatistics from './DataStatistics';
import MonitorDataTrend from './MonitorDataTrend';
import { connect } from 'dva';
import {
  MAJOR_HAZARD_URL,
  STORAGE_HOUSE_REAL_TIME_URL,
} from '../../URLS';
import iconStorageHouse from '../../imgs/icon-storage-house.png';
import iconIsMajorHazard from '../../imgs/icon-is-major-hazard.png';
import iconAddress from '../../imgs/icon-address.png';
import styles from './index.less';

const GET_STORAGE_HOUSE_DETAIL = 'majorHazardMonitor/getStorageHouseDetail';
const GET_STORAGE_HOUSE_DATA_STATISTICS = 'majorHazardMonitor/getStorageHouseDataStatistics';
const GET_STORAGE_HOUSE_MONITOR_DATA_TREND = 'majorHazardMonitor/getStorageHouseMonitorDataTrend';
const SAVE = 'majorHazardMonitor/save';
const TITLE = '库房详情';
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
    title: '库房实时监测',
    name: '库房实时监测',
    href: STORAGE_HOUSE_REAL_TIME_URL,
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
  loading: loading.effects[GET_STORAGE_HOUSE_DETAIL],
  loadingDataStatistics: loading.effects[GET_STORAGE_HOUSE_DATA_STATISTICS],
  loadingMonitorDataTrend: loading.effects[GET_STORAGE_HOUSE_MONITOR_DATA_TREND],
}), dispatch => ({
  getStorageHouseDetail(payload, callback) {
    dispatch({
      type: GET_STORAGE_HOUSE_DETAIL,
      payload,
      callback(success, data) {
        if (!success) {
          message.error('获取库房详情失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
  getStorageHouseDataStatistics(payload, callback) {
    dispatch({
      type: GET_STORAGE_HOUSE_DATA_STATISTICS,
      payload,
      callback(success, data) {
        if (!success) {
          message.error('获取数据统计失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
  getStorageHouseMonitorDataTrend(payload, callback) {
    dispatch({
      type: GET_STORAGE_HOUSE_MONITOR_DATA_TREND,
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
        storageHouseDetail: {},
        ...payload,
      },
      callback,
    });
  },
}))
export default class StorageHouseDetail extends Component {
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
      getStorageHouseDetail,
    } = this.props;
    getStorageHouseDetail({
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
      getStorageHouseDataStatistics,
    } = this.props;
    getStorageHouseDataStatistics({
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
      getStorageHouseMonitorDataTrend,
    } = this.props;
    getStorageHouseMonitorDataTrend({
      id,
      ...payload,
    }, callback);
  }

  render() {
    const {
      majorHazardMonitor: {
        storageHouseDetail: {
          name,
          status,
          isMajorHazard,
          address,
          tankCount,
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
        logo={<img className={styles.icon} src={iconStorageHouse} alt="" />}
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
