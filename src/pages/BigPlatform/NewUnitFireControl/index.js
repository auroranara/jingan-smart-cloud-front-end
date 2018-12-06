import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import VideoSurveillance from './VideoSurveillance';
import VideoPlay from '../FireControl/section/VideoPlay';
import PointInspectionCount from './PointInspectionCount';
import CompanyInfo from './CompanyInfo';
import Messages from './Messages';
import MaintenanceCount from './MaintenanceCount';
import FourColor from './FourColor';

import styles from './index.less';

import FireMonitoring from './Section/FireMonitoring';
import FireDevice from './Section/FireDevice';
import WorkOrderDrawer from './Section/WorkOrderDrawer';
import AlarmDynamicDrawer from './Section/AlarmDynamicDrawer';
import MaintenanceDrawer from './Section/MaintenanceDrawer';

const DELAY = 5 * 1000;
const CHART_DELAY = 10 * 60 * 1000;

/**
 * description: 新企业消防
 * author:
 * date: 2018年12月03日
 */
@connect(({ newUnitFireControl, monitor, loading }) => ({
  newUnitFireControl,
  monitor,
  loading: loading.models.newUnitFireControl,
}))
export default class App extends PureComponent {

  state = {
    videoVisible: false, // 重点部位监控视频弹窗
    showVideoList: false, // 是否展示视频弹窗右侧列表
    videoKeyId: undefined,
    // 1 已完成   2 待处理   7 已超期
    drawerType: 7,
    workOrderDrawerVisible: false,
    alarmDynamicDrawerVisible: false,
    maintenanceDrawerVisible: false,
    alarmMessageDrawerVisible: false,
  }

  componentDidMount() {
    const { dispatch, match: { params: { unitId: companyId } } } = this.props;

    // 获取企业信息
    dispatch({
      type: 'newUnitFireControl/fetchCompanyMessage',
      payload: {
        company_id: companyId,
        month: moment().format('YYYY-MM'),
      },
    });

    // 获取视频列表
    dispatch({
      type: 'newUnitFireControl/fetchVideoList',
      payload: { company_id: companyId },
    });

    // 获取点位信息
    dispatch({
      type: 'newUnitFireControl/fetchRiskPointInfo',
      payload: { company_id: companyId },
    });

    // 获取消防主机监测
    dispatch({
      type: 'newUnitFireControl/fetchFireAlarmSystem',
      payload: {
        companyId,
      },
    });
    // 获取消防设施评分
    dispatch({
      type: 'newUnitFireControl/fetchSystemScore',
      payload: {
        companyId,
      },
    });

    // 获取隐患详情
    dispatch({
      type: 'newUnitFireControl/fetchRiskDetail',
      payload: {
        company_id: companyId,
      },
    });

    // 获取警情动态详情
    this.handleFetchAlarmHandle();

    // 初始化维保工单
    [1, 2, 7].forEach(s => this.handleFetchWorkOrder(s));

    // 轮询
    // this.pollTimer = setInterval(this.polling, DELAY);
    // this.chartPollTimer = setInterval(this.chartPolling, CHART_DELAY);
    dispatch({ type: 'monitor/fetchAllCamera', payload: { company_id: companyId } });
  }

  componentWillUnmount() {
    clearInterval(this.pollTimer);
    clearInterval(this.chartPollTimer);
  }

  pollTimer = null;
  chartPollTimer = null;

  polling = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取消防主机监测
    dispatch({
      type: 'newUnitFireControl/fetchFireAlarmSystem',
      payload: {
        companyId,
      },
    });
    // 获取消防设施评分
    dispatch({
      type: 'newUnitFireControl/fetchSystemScore',
      payload: {
        companyId,
      },
    });
  };
  /**
   *  点击播放重点部位监控
   */
  handleShowVideo = (keyId, showList = true) => {
    this.setState({ videoVisible: true, videoKeyId: keyId, showVideoList: showList });
  };

  /**
   *  关闭重点部位监控
   */
  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: undefined });
  };

  /**
   * 7:已超期工单,2:未超期工单,1:已完成工单
   */
  handleDrawerVisibleChange = (name, type) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => type ? { [stateName]: !state[stateName], drawerType: type} : { [stateName]: !state[stateName] });
  };

  handleFetchAlarmHandle = (dataId=0) => {
    const { dispatch, match: { params: { unitId: companyId } } } = this.props;

    dispatch({
      type: 'newUnitFireControl/fetchAlarmHandle',
      payload: { companyId, dataId },
    });
  }

  // 获取维保工单或维保动态详情
  handleFetchWorkOrder = (status, id) => {
    const { dispatch, match: { params: { unitId: companyId } } } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchWorkOrder',
      payload: { companyId, id, status },
    });
  };

  handleWorkOrderLabelChange = type => {
    this.setState({ drawerType: type });
  };

  handleWorkOrderCardClick = id => {
    this.handleDrawerVisibleChange('maintenance');
    this.handleFetchWorkOrder(undefined, id);
  };

  handleClickMeassge = dataId => {
    this.fetchAlarmHandle(dataId);
    this.handleDrawerVisibleChange('alarmMessage');
  };

  render() {
    // 从props中获取数据
    const {
      fireAlarmSystem: {
        fire_state = 0,
        fault_state = 0,
        start_state = 0,
        supervise_state = 0,
        shield_state = 0,
        feedback_state = 0,
      },
      systemScore,
      alarmHandleMessage,
      alarmHandleList,
      workOrderList1,
      workOrderList2,
      workOrderList7,
      workOrderDetail, // 只有一个元素的数组
    } = this.props.newUnitFireControl;
    const {
      videoVisible,
      showVideoList,
      videoKeyId,
      drawerType,
      workOrderDrawerVisible,
      alarmDynamicDrawerVisible,
      maintenanceDrawerVisible,
      alarmMessageDrawerVisible,
    } = this.state
    const {
      monitor: { allCamera },
    } = this.props
    return (
      <div className={styles.main}>
        <BigPlatformLayout title="晶安智慧云消防展示系统">
          <div className={styles.container}>
            <div className={styles.top}>
              <div className={styles.item}>
                <div className={styles.inner}>
                  {/* 企业基本信息 */}
                  <CompanyInfo model={this.props.newUnitFireControl} />
                </div>
              </div>
              <div className={styles.item} style={{ flex: '3' }}>
                <div className={styles.inner}>
                  {/* 四色图 */}
                  <FourColor model={this.props.newUnitFireControl} dispatch />
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.inner}>
                  {/* 实时消息 */}
                  <Messages model={this.props.newUnitFireControl} />
                </div>
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.item}>
                <div className={styles.inner}>
                  {/* 消防主机监测 */}
                  <FireMonitoring
                    fire={fire_state}
                    fault={fault_state}
                    shield={shield_state}
                    linkage={start_state}
                    supervise={supervise_state}
                    feedback={feedback_state}
                    handleShowDrawer={e => this.handleDrawerVisibleChange('alarmDynamic')}
                  />
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.inner}>
                  {/* 重点部位监控 */}
                  <VideoSurveillance
                    handleShowVideo={this.handleShowVideo}
                    data={allCamera}
                  />
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.inner}>
                  {/* 消防设施情况 */}
                  <FireDevice systemScore={systemScore} />
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.inner}>
                  {/* 点位巡查统计 */}
                  <PointInspectionCount model={this.props.newUnitFireControl} />
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.inner}>
                  {/* 维保统计 */}
                  <MaintenanceCount model={this.props.newUnitFireControl} handleShowOrder={this.handleDrawerVisibleChange} />
                </div>
              </div>
            </div>
            <VideoPlay
              showList={showVideoList}
              videoList={allCamera}
              visible={videoVisible}
              keyId={videoKeyId} // keyId
              handleVideoClose={this.handleVideoClose}
            />
          </div>
          <AlarmDynamicDrawer
            data={alarmHandleMessage}
            visible={alarmMessageDrawerVisible}
            onClose={() => this.handleDrawerVisibleChange('alarmMessage')}
          />
          <AlarmDynamicDrawer
            data={alarmHandleList}
            visible={alarmDynamicDrawerVisible}
            onClose={() => this.handleDrawerVisibleChange('alarmDynamic')}
          />
          <WorkOrderDrawer
            data={{ workOrderList1, workOrderList2, workOrderList7 }}
            type={drawerType}
            visible={workOrderDrawerVisible}
            handleLabelChange={this.handleWorkOrderLabelChange}
            onClose={() => this.handleDrawerVisibleChange('workOrder')}
            handleCardClick={this.handleWorkOrderCardClick}
          />
          <MaintenanceDrawer
            type={drawerType}
            data={workOrderDetail}
            visible={maintenanceDrawerVisible}
            onClose={() => this.handleDrawerVisibleChange('maintenance')}
          />
        </BigPlatformLayout>
      </div>
    );
  }
}
