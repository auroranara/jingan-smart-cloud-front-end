import React, { Component } from 'react';
import { message, Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import {
  RealTime,
  History,
} from './sections';
import { connect } from 'dva';
import styles from './index.less';

 const TITLE = '重大危险源监测';
const TABS = [
  {
    key: '0',
    tab: '实时监测',
  },
  {
    key: '1',
    tab: '历史统计',
  },
];
const GET_REAL_TIME = 'majorHazardMonitor/getRealTime';
const GET_HISTORY = 'majorHazardMonitor/getHistory';
const GET_LIST = 'majorHazardMonitor/getList';
const GET_MONITOR_OBJECT_TYPE_LIST = 'majorHazardMonitor/getMonitorObjectTypeList';
const GET_MONITOR_OBJECT_LIST = 'majorHazardMonitor/getMonitorObjectList';
const GET_MONITOR_POINT_LIST = 'majorHazardMonitor/getMonitorPointList';
const EXPORT_DATA = 'majorHazardMonitor/exportData';
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
  loadingList: loading.effects[GET_LIST],
}), dispatch => ({
  getRealTime(payload, callback) { // 获取实时数据
    dispatch({
      type: GET_REAL_TIME,
      payload,
      callback,
    });
  },
  getHistory(payload, callback) { // 获取历史数据
    dispatch({
      type: GET_HISTORY,
      payload,
      callback,
    });
  },
  getList(payload, callback) { // 获取列表
    dispatch({
      type: GET_LIST,
      payload,
      callback(success, data) {
        if (!success) {
          message.error('获取列表失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
  getMonitorObjectTypeList(payload, callback) { // 获取监测对象类型列表
    dispatch({
      type: GET_MONITOR_OBJECT_TYPE_LIST,
      payload,
      callback(success, data) {
        if (!success) {
          message.error('获取监测对象类型列表失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
  getMonitorObjectList(payload, callback) { // 获取监测对象列表
    dispatch({
      type: GET_MONITOR_OBJECT_LIST,
      payload,
      callback(success, data) {
        if (!success) {
          message.error('获取获取监测对象列表失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
  getMonitorPointList(payload, callback) { // 获取监测点位列表
    dispatch({
      type: GET_MONITOR_POINT_LIST,
      payload,
      callback(success, data) {
        if (!success) {
          message.error('获取监测点位列表失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
  exportData(payload, callback) { // 导出
    dispatch({
      type: EXPORT_DATA,
      payload,
    });
  },
}))
export default class MajorHazard extends Component {
  state = {
    tabActiveKey: undefined,
    loading: false,
  }

  componentDidMount() {
    this.handleTabChange(TABS[0].key);
  }

  /**
   * 获取实时数据
   */
  getRealTime = () => {
    const { getRealTime } = this.props;
    getRealTime({}, (success) => {
      if (!success) {
        message.error('获取实时监测数据失败，请稍后重试或联系管理人员！');
      }
      this.hideLoading();
    });
  }

  /**
   * 获取历史数据
   */
  getHistory = (payload) => {
    const { getHistory } = this.props;
    getHistory(payload, (success) => {
      if (!success) {
        message.error('获取历史统计数据失败，请稍后重试或联系管理人员！');
      }
      this.hideLoading();
    });
  }

  /**
   * 隐藏加载动画
   */
  hideLoading = () => {
    this.setState({
      loading: false,
    });
  }

  /**
   * tabActiveKey的change事件
   */
  handleTabChange = (tabActiveKey) => {
    this.setState({
      tabActiveKey,
      loading: true, // 每次切换tab显示加载动画
    });
  }

  render() {
    const {
      majorHazardMonitor: {
        realTime,
        history,
        list,
        monitorObjectTypeList,
        monitorObjectList,
        monitorPointList,
      },
      getList,
      getMonitorObjectTypeList,
      getMonitorObjectList,
      getMonitorPointList,
      exportData,
      loadingList,
    } = this.props;
    const { tabActiveKey, loading } = this.state;
    const { Component, props } = ({
      [TABS[0].key]: {
        Component: RealTime,
        props: {
          data: realTime,
          getData: this.getRealTime,
        },
      },
      [TABS[1].key]: {
        Component: History,
        props: {
          data: history,
          getData: this.getHistory,
          list,
          getList,
          monitorObjectTypeList,
          getMonitorObjectTypeList,
          monitorObjectList,
          getMonitorObjectList,
          monitorPointList,
          getMonitorPointList,
          exportData,
        },
      },
    })[tabActiveKey] || {};

    return (
      <PageHeaderLayout
        className={styles.container}
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        tabList={TABS}
        tabActiveKey={tabActiveKey}
        onTabChange={this.handleTabChange}
      >
        <Spin spinning={loading || loadingList || false}>
          {Component && <Component {...props} />}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
