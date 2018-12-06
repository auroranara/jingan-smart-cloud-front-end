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
import MaintenanceDrawer from './Section/MaintenanceDrawer';
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
    // 1 已完成   2 待处理   7 已超期
    drawerType: 7,
    workOrderDrawerVisible: false,
    alarmDynamicDrawerVisible: false,
    maintenanceDrawerVisible: false,
    alarmMessageDrawerVisible: false,
    currentDrawerVisible: false, // 当前隐患抽屉可见
    dangerDetailVisible: false, // 隐患详情抽屉可见
    // 点位巡查抽屉是否显示
    pointInspectionDrawerVisible: false,
    // 点位巡查抽屉的选中时间
    pointInspectionDrawerSelectedDate: moment().format('YYYY-MM-DD'),
    // 四色图贴士
    fourColorTips: {},
    // 四色图贴士对应的已删除id
    deletedFourColorTips: [],
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

    // 获取警情动态详情
    this.handleFetchAlarmHandle();

    // 初始化维保工单
    [1, 2, 7].forEach(s => this.handleFetchWorkOrder(s));

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
        businessType: 2,
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
    this.fetchScreenMessage(dispatch, companyId);

    // 获取点位
    dispatch({
      type: 'newUnitFireControl/fetchPointList',
      payload: {
        companyId,
      },
      success: res => {
        this.msgSuccess(res);
      },
    });

    // 企业负责人和维保员信息
    dispatch({
      type: 'newUnitFireControl/fetchMaintenanceCompany',
      payload: {
        companyId,
      },
    });

    // 获取点位巡查列表
    this.fetchPointInspectionList();

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
    this.fetchScreenMessage(dispatch, companyId);
  };

  /**
   * 获取点位巡查列表
   */
  fetchPointInspectionList = (date = this.state.pointInspectionDrawerSelectedDate) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchPointInspectionList',
      payload: {
        companyId,
        date,
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
   * 获取大屏消息
   */
  fetchScreenMessage = (dispatch, companyId) => {
    dispatch({
      type: 'newUnitFireControl/fetchScreenMessage',
      payload: {
        companyId,
      },
      success: ({ list: [{ itemId, messageFlag, type } = {}] }) => {
        const { fourColorTips, deletedFourColorTips } = this.state;
        // 如果最新一条数据为隐患，并且为首次出现，则对应点位显示隐患提示
        if (type === 14 && deletedFourColorTips.indexOf(messageFlag) === -1) {
          // 如果前一条隐患还没消失，则移除前一条隐患
          if (fourColorTips[itemId] === messageFlag) {
            return;
          } else if (fourColorTips[itemId]) {
            this.setState({
              fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
              deletedFourColorTips: deletedFourColorTips.concat(fourColorTips[itemId]),
            });
          } else {
            this.setState({
              fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
            });
          }
        }
      },
    });
  };

  /**
   * 移除四色图隐患提示
   */
  removeFourColorTip = (id, hiddenDangerId) => {
    const { fourColorTips, deletedFourColorTips } = this.state;
    // 删除对应的tip，将隐患id存放到删除列表中
    this.setState({
      fourColorTips: { ...fourColorTips, [id]: undefined },
      deletedFourColorTips: deletedFourColorTips.concat(hiddenDangerId),
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
  handleViewDangerDetail = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchHiddenDangerDetail',
      payload: { id: data.id },
    });
    this.setState({
      dangerDetailVisible: true,
    });
  };
  /**
   * 修改点位巡查抽屉选中时间
   */
  handleChangePointInspectionDrawerSelectedDate = date => {
    this.setState({ pointInspectionDrawerSelectedDate: date });
    this.fetchPointInspectionList(date);
  };

  handleFetchAlarmHandle = (dataId = 0) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;

    dispatch({
      type: 'newUnitFireControl/fetchAlarmHandle',
      payload: { companyId, dataId },
    });
  };

  // 获取维保工单或维保动态详情
  handleFetchWorkOrder = (status, id) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
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
      currentHiddenDanger,
      currentHiddenDanger: { timestampList },
      checkCount,
      checkList,
      pointRecordList,
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
      workOrderDrawerVisible,
      alarmDynamicDrawerVisible,
      pointInspectionDrawerVisible,
      pointInspectionDrawerSelectedDate,
      riskDrawerVisible,
      // checkDrawerVisible,
      pointDrawerVisible,
      currentDrawerVisible,
      dangerDetailVisible,
      drawerType,
      maintenanceDrawerVisible,
      alarmMessageDrawerVisible,
      fourColorTips,
      deletedFourColorTips,
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
                <FourColor
                  model={this.props.newUnitFireControl}
                  handleShowPointDetail={id => {
                    this.handleDrawerVisibleChange('check', { checkId: id });
                  }}
                  handleShowHiddenDanger={(id, hiddenDangerId) => {
                    this.handleViewDangerDetail({ id: hiddenDangerId });
                    this.removeFourColorTip(id, hiddenDangerId);
                  }}
                  tips={fourColorTips}
                />
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
                  handleShowDrawer={e => this.handleDrawerVisibleChange('alarmDynamic')}
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
          {/* <PointPositionName
            visible={pointDrawerVisible}
            handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          />*/}
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
            onCardClick={this.handleViewDangerDetail}
            {...currentHiddenDanger}
          />
          {/* 隐患详情抽屉 */}
          <DrawerHiddenDangerDetail
            visible={dangerDetailVisible}
            onClose={this.handleCloseDetailOfDanger}
            data={timestampList}
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
        </div>
	      <MaintenanceCheckDrawer
          model={this.props.newUnitFireControl}
          visible={maintenanceCheckDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('maintenanceCheck')}
        />
      </BigPlatformLayout>
    );
  }
}
