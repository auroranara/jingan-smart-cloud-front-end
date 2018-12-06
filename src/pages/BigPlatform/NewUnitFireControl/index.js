import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { notification } from 'antd';
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
import RiskDrawer from './Section/RiskDrawer';
import WorkOrderDrawer from './Section/WorkOrderDrawer';
import AlarmDynamicDrawer from './Section/AlarmDynamicDrawer';
import CurrentHiddenDanger from './Section/CurrentHiddenDanger';
import DrawerHiddenDangerDetail from './Section/DrawerHiddenDangerDetail';
import PointPositionName from './Section/PointPositionName';
import PointInspectionDrawer from './PointInspectionDrawer';
import MaintenanceCheckDrawer from './Section/MaintenanceCheckDrawer';

import iconFire from '@/assets/icon-fire-msg.png';
import iconFault from '@/assets/icon-fault-msg.png';

const DELAY = 5 * 1000;
// const CHART_DELAY = 10 * 60 * 1000;

notification.config({
  placement: 'bottomLeft',
  duration: null,
  bottom: 8,
});

const msgInfo = {
  '5': {
    title: '火警提示',
    icon: iconFire,
    color: '#f83329',
    body: '发生报警，',
    bottom: '情况危急，请立即处理！',
    animation: styles.redShadow,
  },
  '6': {
    title: '故障提示',
    icon: iconFault,
    color: '#f4710f',
    body: '发生故障，',
    bottom: '请及时维修！',
    animation: styles.orangeShadow,
  },
};
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
    riskDrawerVisible: false, // 是否显示对应弹框
    pointDrawerVisible: false, // 点位名称弹框
    workOrderDrawerVisible: false,
    alarmDynamicDrawerVisible: false,
    currentDrawerVisible: false, // 当前隐患抽屉可见
    dangerDetailVisible: false, // 隐患详情抽屉可见
    // 点位巡查抽屉是否显示
    pointInspectionDrawerVisible: false,
    // 点位巡查抽屉的选中时间
    pointInspectionDrawerSelectedDate: moment().format('YYYY-MM-DD'),
    maintenanceCheckDrawerVisible: false,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;

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

    // // 获取点位信息
    // dispatch({
    //   type: 'newUnitFireControl/fetchRiskPointInfo',
    //   payload: { company_id: companyId },
    // });

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

    // 获取当前隐患图表统计数据
    dispatch({
      type: 'newUnitFireControl/fetchHiddenDangerNum',
      payload: { companyId },
    });

    // 获取当前隐患列表
    dispatch({
      type: 'newUnitFireControl/fetchCurrentHiddenDanger',
      payload: {
        company_id: companyId,
      },
    });
    // 获取点位巡查统计
    dispatch({
      type: 'newUnitFireControl/fetchPointInspectionCount',
      payload: {
        companyId,
      },
    });
    // 获取大屏消息
    dispatch({
      type: 'newUnitFireControl/fetchScreenMessage',
      payload: {
        companyId,
      },
      success: res => {
        this.msgSuccess(res);
      },
    });

    // 轮询
    this.pollTimer = setInterval(this.polling, DELAY);
    // this.chartPollTimer = setInterval(this.chartPolling, CHART_DELAY);
    dispatch({ type: 'monitor/fetchAllCamera', payload: { company_id: companyId } });
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return JSON.stringify(this.props.newUnitFireControl.screenMessage) !== JSON.stringify(prevProps.newUnitFireControl.screenMessage);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { newUnitFireControl: { screenMessage } } = this.props;
    if (snapshot) {
      this.msgSuccess({ list: [...screenMessage] });
    }
  }

  msgSuccess = res => {
    const first = res.list[0];
      if(!first) return;
      const { type, messageFlag } = first;
      if(type === 5 || type === 6) {
        const msgItem = msgInfo[type.toString()];
        const style = { boxShadow: `0px 0px 20px ${msgItem.color}`, animation: `${msgItem.animation} 2s linear 0s infinite alternate` };
        notification.open({
          className: styles.notification,
          message: this.renderNotificationTitle(first),
          description: this.renderNotificationMsg(first),
          style: this.fireNode ? { ...style, width: this.fireNode.clientWidth - 8 } : { ...style },
          onClick: () => { console.log(messageFlag); },
        });
      }
  }

  renderNotificationTitle = item => {
    const { type } = item;
    const msgItem = msgInfo[type.toString()];
    return (
      <div className={styles.notificationTitle} style={{ color: msgItem.color }}><span className={styles.iconFire}><img src={msgItem.icon} alt='fire'/></span>{msgItem.title}</div>
    );
  }

  renderNotificationMsg = item => {
    const { type, addTime, installAddress, componentType, messageFlag } = item;
    const msgItem = msgInfo[type.toString()];
    return (
      <div className={styles.notificationBody} onClick={() => { console.log(messageFlag); }}>
        <div><span className={styles.time}>{moment(addTime).format('YYYY-MM-DD HH:mm')}</span> <span className={styles.address}>{installAddress}</span></div>
        <div><span className={styles.device} style={{ color: msgItem.color }}>【{componentType}】</span>{msgItem.body}</div>
        <div>{msgItem.bottom}</div>
      </div>
    );
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
    // dispatch({
    //   type: 'newUnitFireControl/fetchSystemScore',
    //   payload: {
    //     companyId,
    //   },
    // });

    // 获取大屏消息
    dispatch({
      type: 'newUnitFireControl/fetchScreenMessage',
      payload: {
        companyId,
      },
    });
  };

  /**
   * 获取点位巡查列表
   */
  fetchPointInspectionList = type => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { pointInspectionDrawerSelectedDate } = this.state;
    dispatch({
      type: 'newUnitFireControl/fetchPointInspectionList',
      payload: {
        companyId,
        date: pointInspectionDrawerSelectedDate,
        type,
      },
    });
  };

  fetchMaintenanceCheck = id => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMaintenanceDetail',
      payload: {
        id,
      },
    });
  }

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
   * 0:已超期工单,1:未超期工单,2:已完成工单
   */
  handleDrawerVisibleChange = (name, rest) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
  };

  /**
   * 关闭当前隐患抽屉
   */
  handleCloseCurrentDrawer = () => {
    this.setState({ currentDrawerVisible: false });
  };

  /**
   * 关闭隐患详情
   */
  handleCloseDetailOfDanger = () => {
    this.setState({ dangerDetailVisible: false });
  };

  /**
   * 打开查看当前隐患抽屉
   */
  handleViewCurrentDanger = () => {
    this.setState({ currentDrawerVisible: true });
  };

  // 点击查看隐患详情
  handleViewDnagerDetail = data => {
    this.setState({
      dangerDetailVisible: true,
    });
  };
  /**
   * 修改点位巡查抽屉选中时间
   */
  handleChangePointInspectionDrawerSelectedDate = date => {
    this.setState({ pointInspectionDrawerSelectedDate: date });
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
      currentHiddenDanger,
      checkCount,
      checkList,
      pointRecordList,
    } = this.props.newUnitFireControl;
    const {
      videoVisible,
      showVideoList,
      videoKeyId,
      workOrderDrawerVisible,
      alarmDynamicDrawerVisible,
      pointInspectionDrawerVisible,
      pointInspectionDrawerSelectedDate,
      riskDrawerVisible,
      checkDrawerVisible,
      pointDrawerVisible,
      currentDrawerVisible,
      dangerDetailVisible,
      maintenanceCheckDrawerVisible,
    } = this.state;

    const {
      monitor: { allCamera },
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    return (
      <BigPlatformLayout
        title="智慧消防云平台"
        headerStyle={{ fontSize: 16 }}
        style={{
          backgroundImage:
            'url(http://data.jingan-china.cn/v2/big-platform/fire-control/com/new/bg2.png)',
        }}
      >
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.topItem} style={{ left: 0, zIndex: 100 }}>
              <div className={styles.inner}>
                {/* 企业基本信息 */}
                <CompanyInfo
                  handleViewCurrentDanger={this.handleViewCurrentDanger}
                  model={this.props.newUnitFireControl}
                  checkCount={checkCount}
                  checkList={checkList}
                  pointRecordList={pointRecordList}
                  companyId={companyId}
                />
              </div>
            </div>
            <div className={styles.topMain}>
              <div className={styles.inner}>
                {/* 四色图 */}
                <FourColor model={this.props.newUnitFireControl} />
              </div>
            </div>
            <div className={styles.topItem} style={{ right: 0, zIndex: 100 }}>
              <div className={styles.inner}>
                {/* 实时消息 */}
                <Messages
                  model={this.props.newUnitFireControl}
                  handleParentChange={newState => {
                    this.setState({ ...newState });
                  }}
                  fetchData={this.fetchMaintenanceCheck}
                />
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.item}>
              <div className={styles.inner} ref={node => (this.fireNode = node)}>
                {/* 消防主机监测 */}
                <FireMonitoring
                  fire={fire_state}
                  fault={fault_state}
                  shield={shield_state}
                  linkage={start_state}
                  supervise={supervise_state}
                  feedback={feedback_state}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 重点部位监控 */}
                <VideoSurveillance handleShowVideo={this.handleShowVideo} data={allCamera} />
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
                <PointInspectionCount
                  model={this.props.newUnitFireControl}
                  handleShowDrawer={this.handleDrawerVisibleChange}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 维保统计 */}
                <MaintenanceCount
                  model={this.props.newUnitFireControl}
                  handleShowOrder={this.handleDrawerVisibleChange}
                />
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
          <RiskDrawer
            visible={riskDrawerVisible}
            handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          />
          <WorkOrderDrawer
            visible={workOrderDrawerVisible}
            onClose={() => this.handleDrawerVisibleChange('workOrder')}
          />
          <AlarmDynamicDrawer
            visible={alarmDynamicDrawerVisible}
            onClose={() => this.handleDrawerVisibleChange('alarmDynamic')}
          />
          <PointPositionName
            visible={pointDrawerVisible}
            handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          />
        </div>
        <WorkOrderDrawer
          visible={workOrderDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('workOrder')}
        />
        <AlarmDynamicDrawer
          visible={alarmDynamicDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('alarmDynamic')}
        />
        <PointInspectionDrawer
          date={pointInspectionDrawerSelectedDate}
          handleChangeDate={this.handleChangePointInspectionDrawerSelectedDate}
          model={this.props.newUnitFireControl}
          loadData={this.fetchPointInspectionList}
          visible={pointInspectionDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('pointInspection')}
        />
        {/* 当前隐患抽屉 */}
        <CurrentHiddenDanger
          visible={currentDrawerVisible}
          onClose={this.handleCloseCurrentDrawer}
          onCardClick={this.handleViewDnagerDetail}
          {...currentHiddenDanger}
        />
        {/* <DrawerHiddenDangerDetail
            visible={dangerDetailVisible}
            onClose={this.handleCloseDetailOfDanger}
          /> */}
	      <MaintenanceCheckDrawer
          model={this.props.newUnitFireControl}
          visible={maintenanceCheckDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('maintenanceCheck')}
        />
      </BigPlatformLayout>
    );
  }
}
