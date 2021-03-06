import React, { PureComponent } from 'react';
import { notification, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { stringify } from 'qs';

import styles from './index.less';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import { findFirstVideo } from '@/utils/utils';
import { WATER_TYPES, getWaterTotal } from './utils';
import {
  AlarmDynamicDrawer,
  AlarmDynamicMsgDrawer,
  CheckDrawer,
  // CheckingDrawer,
  CheckPointDrawer,
  CheckWorkOrder,
  CompanyInfo,
  CurrentHiddenDanger,
  DrawerHiddenDangerDetail,
  DrawerOfFireAlarm,
  ElectricityDrawer,
  // ElectricityMonitor,
  FaultMessageDrawer,
  // FireDevice,
  FireFlowDrawer,
  FireMonitorFlowDrawer,
  // FireMonitoring,
  FourColor,
  GasFlowDrawer,
  MaintenanceCheckDrawer,
  MaintenanceDrawer,
  MaintenanceMsgDrawer,
  Messages,
  NewVideoPlay,
  NewWorkOrderDrawer,
  OnekeyFlowDrawer,
  PointInspectionDrawer,
  PointPositionName,
  ResetHostsDrawer,
  RiskDrawer,
  SmokeDrawer,
  SmokeFlowDrawer,
  // SmokeMonitor,
  // StatisticsOfFireControl,
  SetDrawer,
  VideoSurveillance,
  WaterItemDrawer,
  // WaterMonitor,
  WaterSystem,
  WaterSystemDrawer,
  WorkOrderDrawer,
} from './sections/Components';
import {
  ElectricalFireMonitoring,
  ElectricalFireMonitoringDrawer,
  ElectricalFireMonitoringDetailDrawer,
} from './components/Components';
import {
  headerBg,
  redLight as iconFire,
  iconFault,
  // videoBtn,
} from './imgs/links';

notification.config({
  placement: 'bottomLeft',
  duration: 30,
  bottom: 8,
});

const WEB_SOCKET_TYPE = 8;

const WS_OPTIONS = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

const msgInfo = [
  {
    title: '报警提示',
    icon: iconFire,
    color: '#f83329',
    body: '发生报警，',
    bottom: '情况危急，请立即处理！',
    animation: styles.redShadow,
  },
  {
    title: '故障提示',
    icon: iconFault,
    color: '#f4710f',
    body: '发生故障，',
    bottom: '请及时维修！',
    animation: styles.orangeShadow,
  },
];

const switchMsgType = type => {
  const alarmTypes = [7, 38, 39, 32, 36];
  const faultTypes = [9, 40];
  if (alarmTypes.indexOf(type) >= 0) return msgInfo[0];
  else if (faultTypes.indexOf(type) >= 0) return msgInfo[1];
};

const popupVisible = {
  videoVisible: false, // 重点部位监控视频弹窗
  riskDrawerVisible: false, // 是否显示对应弹框
  workOrderDrawerVisible: false,
  alarmMessageDrawerVisible: false,
  faultMessageDrawerVisible: false,
  alarmDynamicDrawerVisible: false,
  alarmHistoryDrawerVisible: false,
  maintenanceDrawerVisible: false,
  checkDrawerVisible: false, // 检查点抽屉是否显示
  pointDrawerVisible: false, // 点位名称抽屉是否显示
  faultDrawerVisible: false,
  currentDrawerVisible: false, // 当前隐患抽屉可见
  dangerDetailVisible: false, // 隐患详情抽屉可见
  pointInspectionDrawerVisible: false, // 点位巡查抽屉是否显示
  maintenanceMsgDrawerVisible: false,
  alarmDynamicMsgDrawerVisible: false,
  fireAlarmVisible: false,
  maintenanceCheckDrawerVisible: false,
  smokeDrawerVisible: false,
  electricityDrawerVisible: false,
  resetHostsDrawerVisible: false,
  checksDrawerVisible: false,
  newWorkOrderDrawerVisible: false,
  fireFlowDrawerVisible: false,
  smokeFlowDrawerVisible: false,
  onekeyFlowDrawerVisible: false,
  gasFlowDrawerVisible: false,
  setDrawerVisible: false,
  fireMonitorFlowDrawerVisible: false,
  waterItemDrawerVisible: false,
};

@connect(
  ({
    newUnitFireControl,
    monitor,
    loading,
    smoke,
    electricityMonitor,
    bigPlatform,
    unitFireControl,
    unitSafety,
    gasStation,
  }) => ({
    newUnitFireControl,
    monitor,
    loading: loading.models.newUnitFireControl,
    smoke,
    electricityMonitor,
    bigPlatform,
    unitFireControl,
    unitSafety,
    gasStation,
    warnDetailLoading: loading.effects['newUnitFireControl/fetchWarnDetail'],
    faultDetailLoading: loading.effects['newUnitFireControl/fetchFaultDetail'],
    allDetailLoading: loading.effects['newUnitFireControl/fetchAllDetail'],
    hiddenDangerLoading: loading.effects['bigPlatform/fetchHiddenDangerListForPage'],
  })
)
export default class GasStation extends PureComponent {
  state = {
    electricalFireMonitoringDrawerVisible: false, // 电气火灾监测抽屉是否显示
    electricalFireMonitoringDrawerValue: null, // 电气火灾监测抽屉参数
    electricalFireMonitoringDetailDrawerVisible: false, // 电气火灾监测详情抽屉是否显示
    electricalFireMonitoringDetailDrawerValue: null, // 电气火灾监测详情抽屉参数
    electricalFireMonitoringDetailDrawerActiveKey: '漏电电流', // 电气火灾监测详情抽屉选中参数
    videoVisible: false, // 重点部位监控视频弹窗
    showVideoList: false, // 是否展示视频弹窗右侧列表
    videoKeyId: undefined,
    riskDrawerVisible: false, // 是否显示对应弹框
    // 1 已完成   2 待处理   7 已超期
    drawerType: 7,
    workOrderDrawerVisible: false,
    alarmMessageDrawerVisible: false,
    faultMessage: {},
    faultMessageDrawerVisible: false,
    alarmDynamicDrawerVisible: false,
    alarmHistoryDrawerVisible: false,
    maintenanceDrawerVisible: false,
    checkDrawerVisible: false, // 检查点抽屉是否显示
    pointDrawerVisible: false, // 点位名称抽屉是否显示
    faultDrawerVisible: false,
    currentDrawerVisible: false, // 当前隐患抽屉可见
    dangerDetailVisible: false, // 隐患详情抽屉可见
    // 点位巡查抽屉是否显示
    pointInspectionDrawerVisible: false,
    maintenanceMsgDrawerVisible: false,
    alarmDynamicMsgDrawerVisible: false,
    // 点位巡查抽屉的选中时间
    pointInspectionDrawerSelectedDate: moment().format('YYYY-MM-DD'),
    // 四色图贴士
    fourColorTips: {},
    // 四色图贴士对应的已删除id
    deletedFourColorTips: [],
    fireAlarmVisible: false, // 火灾自动报警抽屉可见
    // 检查点Id
    checkItemId: '',
    // 检查点对应状态
    checkStatus: '',
    // 检查点对应名称
    checkPointName: '',
    maintenanceCheckDrawerVisible: false,
    fireAlarmTitle: '',
    maintenanceTitle: '维保处理动态',
    processIds: [],
    fireProcessIds: [],
    waterSystemDrawerVisible: false, // 水系统抽屉是否显示
    waterTabItem: 0,
    // 最新一条隐患id
    latestHiddenDangerId: undefined,
    videoList: [],
    fireVideoVisible: false,
    fireVideoKeyId: '',
    smokeDrawerVisible: false,
    filterIndex: 0,
    electricityDrawerVisible: false,
    resetHostsDrawerVisible: false,
    checksDrawerVisible: false,
    newWorkOrderDrawerVisible: false,
    workOrderType: 0,
    workOrderStatus: 0,
    fireMonitorIndex: 0,
    fireControlType: 1,
    occurData: [],
    fireFlowDrawerVisible: false,
    smokeFlowDrawerVisible: false,
    onekeyFlowDrawerVisible: false,
    gasFlowDrawerVisible: false,
    msgFlow: 0, // 0报警 1故障
    setDrawerVisible: false,
    flowRepeat: {
      times: 0,
      lastreportTime: 0,
    },
    fireMonitorFlowDrawerVisible: false,
    dynamicType: 0,
    workOrderSelectType: 'all',
    hiddenDangerIds: [],
    waterItem: {},
    waterItemDrawerVisible: false, // 水系统具体项目弹框
  };

  componentDidMount() {
    this.initScreen();
    this.connectWebsocket();
  }

  componentWillUnmount() {
    clearInterval(this.pollTimer);
    clearInterval(this.chartPollTimer);
    this.ws && this.ws.close();
  }

  pollTimer = null;
  chartPollTimer = null;

  initScreen = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;

    dispatch({
      type: 'gasStation/fetchUnitPhoto',
      payload: companyId,
    });

    // 获取企业信息
    dispatch({
      type: 'newUnitFireControl/fetchCompanyMessage',
      payload: {
        company_id: companyId,
        type: '2',
        month: moment().format('YYYY-MM'),
      },
    });

    // 获取视频列表
    dispatch({
      type: 'newUnitFireControl/fetchVideoList',
      payload: { company_id: companyId },
    });

    // 获取消防主机监测
    this.fetchFireAlarmSystem();

    // 获取警情动态详情及历史
    [0, 1].forEach(i => this.handleFetchAlarmHandle(0, i));

    // 获取故障
    dispatch({ type: 'newUnitFireControl/fetchFault', payload: { companyId } });

    // 获取当前隐患图表统计数据
    this.fetchHiddenDangerNum();

    // 获取当前隐患列表
    this.fetchCurrentHiddenDanger(companyId);

    // 获取点位巡查统计
    dispatch({
      type: 'newUnitFireControl/fetchPointInspectionCount',
      payload: {
        companyId,
      },
    });

    dispatch({
      type: 'gasStation/fetchScreenMessage',
      payload: {
        companyId,
      },
      success: res => {
        const {
          list: [{ itemId, messageFlag, type } = {}],
        } = res;
        const { fourColorTips, deletedFourColorTips } = this.state;
        // 如果最新一条数据为隐患，并且为首次出现，则对应点位显示隐患提示
        if (type === 14 && deletedFourColorTips.indexOf(messageFlag) === -1) {
          if (fourColorTips[itemId] === messageFlag) {
            return;
          }
          // 如果前一条隐患还没消失，则移除前一条隐患
          else if (fourColorTips[itemId]) {
            this.setState({
              fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
              latestHiddenDangerId: itemId,
              deletedFourColorTips: deletedFourColorTips.concat(fourColorTips[itemId]),
            });
          } else {
            this.setState({
              fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
              latestHiddenDangerId: itemId,
            });
          }
        }

        // 记录最新的一条消息id
        this.topId = res.list[0] ? res.list[0].messageId : undefined;
      },
    });

    // 获取点位
    this.fetchPointList();

    // 企业负责人和维保员信息
    dispatch({
      type: 'newUnitFireControl/fetchMaintenanceCompany',
      payload: {
        companyId,
      },
    });
    // 获取点位巡查列表
    this.fetchPointInspectionList();

    dispatch({ type: 'monitor/fetchAllCamera', payload: { company_id: companyId } });
    dispatch({ type: 'monitor/fetchCameraTree', payload: { company_id: companyId } });

    // this.fetchWaterSystem('101');
    this.fetchAllWaterSystem();

    // 烟感列表
    dispatch({
      type: 'smoke/fetchCompanySmokeInfo',
      payload: {
        company_id: companyId,
      },
    });
    // 电气火灾监测
    dispatch({
      type: 'electricityMonitor/fetchDeviceStatusCount',
      payload: { companyId },
    });
    dispatch({
      type: 'electricityMonitor/fetchDevices',
      payload: {
        companyId,
        type: 1,
      },
      callback: ([data]) => {
        if (data) {
          const { deviceId } = data;
          this.handleFetchRealTimeData(deviceId);
        } else {
          dispatch({
            type: 'electricityMonitor/save',
            payload: {
              deviceRealTimeData: {},
              deviceConfig: [],
              deviceHistoryData: [],
            },
          });
        }
      },
    });
    [1, 2, 3, 4].forEach(item => {
      // 巡查数量 1 正常,2 异常,3 待检查，4 已超时
      dispatch({
        type: 'bigPlatform/fetchCoItemList',
        payload: {
          company_id: companyId,
          status: item,
        },
      });
    });
    // 烟感视频？
    dispatch({ type: 'smoke/fetchCameraTree', payload: { company_id: companyId } });
    // 获取主机列表
    dispatch({
      type: 'unitFireControl/fetchHosts',
      payload: {
        companyId,
      },
    });

    // 安全巡查
    dispatch({ type: 'unitSafety/fetchPoints', payload: { companyId } });

    // 处理工单统计
    dispatch({ type: 'newUnitFireControl/fetchCountAllFireAndFault', payload: { companyId } });

    // 获取消防数据统计
    dispatch({
      type: 'unitFireControl/fetchFireControlCount',
      payload: {
        companyId,
        t: 1,
      },
    });

    // 手机号是否可见
    dispatch({ type: 'unitSafety/savePhoneVisible' });
  };

  connectWebsocket = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;

    const params = {
      companyId,
      env,
      type: WEB_SOCKET_TYPE,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;

    const ws = (this.ws = new WebsocketHeartbeatJs({ url, ...WS_OPTIONS }));
    if (!ws) return;
    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data);
        dispatch({
          type: 'gasStation/saveScreenMessage',
          isMore: 1,
          payload: data.data,
        });
        this.handleWebsocketMsg(data.data);
      } catch (error) {
        console.log('error', error);
      }
    };
    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  };

  handleWebsocketMsg = result => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { checkItemId } = this.state;

    // 显示报警弹窗
    const { itemId, messageFlag, type, checkResult, pointId, isOver, enterSign } = result;

    if ([7, 9, 32, 36, 38, 40, 41].includes(+type)) {
      if (+isOver === 0) {
        if (type === 7 || type === 9) {
          if (enterSign === '1') this.showFireMsg(result);
        } else {
          this.showFireMsg(result);
        }
      }
      if (type === 32 || type === 36) this.showFireMsg(result);
      this.fetchScreenMessage(dispatch, companyId);
    }

    if (type === 38 || type === 40) {
      // 烟感列表
      dispatch({
        type: 'smoke/fetchCompanySmokeInfo',
        payload: {
          company_id: companyId,
        },
      });
    }

    if ([1, 2, 3, 4, 7, 9, 21, 52].includes(+type)) {
      // 获取消防主机监测
      this.fetchFireAlarmSystem();
    }

    if ([14, 15, 16, 17].includes(+type)) {
      // 更新当前隐患总数
      this.fetchHiddenDangerNum();
    }

    if ([32, 42, 43, 44].includes(+type)) {
      // 电气火灾监测
      dispatch({
        type: 'electricityMonitor/fetchDeviceStatusCount',
        payload: { companyId },
      });
      dispatch({
        type: 'gasStation/fetchDistributionBoxClassification',
        payload: {
          companyId,
          type: 1,
        },
      });
      this.getDeviceRealTimeData(this.elecDrawerDeviceId);
      this.handleFetchRealTimeData(this.elecMonitorDeviceId);
    }

    // 获取水系统---消火栓系统
    if ([36, 37, 48, 49, 53].includes(+type)) {
      // 36 水系统报警 37 水系统报警恢复 48水系统失联 49 水系统失联恢复 53 检修中
      this.fetchAllWaterSystem();
    }

    // 烟感列表
    if ([38, 40, 46, 47, 50, 51].includes(+type)) {
      dispatch({
        type: 'smoke/fetchCompanySmokeInfo',
        payload: {
          company_id: companyId,
        },
      });
    }

    // 四色图隐患
    const { fourColorTips, deletedFourColorTips } = this.state;
    // 如果最新一条数据为隐患，并且为首次出现，则对应点位显示隐患提示
    if (type === 14 && deletedFourColorTips.indexOf(messageFlag) === -1) {
      // 如果前一条隐患还没消失，则移除前一条隐患
      if (fourColorTips[itemId] === messageFlag) {
        return;
      } else if (fourColorTips[itemId]) {
        this.setState({
          fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
          latestHiddenDangerId: itemId,
          deletedFourColorTips: deletedFourColorTips.concat(fourColorTips[itemId]),
        });
      } else {
        this.setState({
          fourColorTips: { ...fourColorTips, [itemId]: messageFlag },
          latestHiddenDangerId: itemId,
        });
      }
    }

    if (type === 14) {
      // 获取点位
      this.fetchPointList();

      // 获取当前隐患列表
      this.fetchCurrentHiddenDanger(companyId);

      //获取巡查记录
      dispatch({
        type: 'newUnitFireControl/fetchPointRecord',
        payload: {
          itemId: checkItemId,
          item_type: 2,
        },
      });
    }
    if ([15, 16, 17].includes(+type)) {
      if (fourColorTips[pointId] === messageFlag) this.removeFourColorTip(pointId, messageFlag);
      // 获取点位
      this.fetchPointList();

      // 获取当前隐患列表
      this.fetchCurrentHiddenDanger(companyId);

      //获取巡查记录
      dispatch({
        type: 'newUnitFireControl/fetchPointRecord',
        payload: {
          itemId: checkItemId,
          item_type: 2,
        },
      });
    }
    if (type === 13) {
      // 获取点位
      this.fetchPointList();

      // 获取当前隐患列表
      this.fetchCurrentHiddenDanger(companyId);

      //获取巡查记录
      dispatch({
        type: 'newUnitFireControl/fetchPointRecord',
        payload: {
          itemId: checkItemId,
          item_type: 2,
        },
      });
      if (checkResult === '无隐患') this.removeFourColorTip2(pointId);
    }
  };

  handleFetchRealTimeData = deviceId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceRealTimeDataMonitor',
      payload: { deviceId },
    });
    this.elecMonitorDeviceId = deviceId;
  };

  showFireMsg = item => {
    const { type, messageId } = item;
    const msgItem = switchMsgType(+type);
    const style = {
      boxShadow: `0px 0px 20px ${msgItem.color}`,
    };
    const styleAnimation = {
      ...style,
      animation: `${msgItem.animation} 2s linear 0s infinite alternate`,
    };
    const options = {
      key: messageId,
      className: styles.notification,
      message: this.renderNotificationTitle(item),
      description: this.renderNotificationMsg(item),
      style: { ...style, width: (screen.availWidth - 40) / 5 - 8 },
    };
    notification.open({
      ...options,
    });

    setTimeout(() => {
      // 解决加入animation覆盖notification自身显示动效时长问题
      notification.open({
        ...options,
        style: { ...styleAnimation, width: (screen.availWidth - 40) / 5 - 8 },
        onClose: () => {
          notification.open({
            ...options,
          });
          setTimeout(() => {
            notification.close(messageId);
          }, 200);
        },
      });
    }, 800);
  };

  renderNotificationTitle = item => {
    const { type } = item;
    const msgItem = switchMsgType(+type);
    return (
      <div className={styles.notificationTitle} style={{ color: msgItem.color }}>
        <span className={styles.iconFire}>
          <img src={msgItem.icon} alt="fire" />
        </span>
        {msgItem.title}
      </div>
    );
  };

  renderNotificationMsg = item => {
    const {
      type,
      addTime,
      installAddress,
      unitTypeName,
      messageFlag,
      area,
      location,
      cameraMessage,
      componentType,
      workOrder,
      systemTypeValue,
      createBy,
      createByPhone,
      faultName,
      trueOver = null,
      deviceTypeName,
      paramName,
      deviceId,
      deviceType,
      loopNumber,
      partNumber,
    } = item;
    const msgItem = switchMsgType(+type);
    const occurData = [
      {
        create_time: addTime,
        create_date: addTime,
        firstTime: addTime,
        lastTime: addTime,
        area,
        location,
        install_address: installAddress,
        label: componentType,
        work_order: workOrder,
        systemTypeValue,
        createByName: createBy,
        createByPhone,
        faultName,
        realtime: addTime,
        component_region: loopNumber,
        component_no: partNumber,
      },
    ];
    const msgFlag =
      messageFlag && (messageFlag[0] === '[' ? JSON.parse(messageFlag)[0] : messageFlag);
    const restParams = [cameraMessage, occurData];
    const param = {
      dataId: +trueOver === 0 ? msgFlag : undefined,
      id: +trueOver !== 0 ? msgFlag : undefined,
    };
    return (
      <div
        className={styles.notificationBody}
        onClick={() => {
          switch (type) {
            case 7:
              this.handleClickMsgFlow(param, 0, 0, ...restParams);
              break;
            case 9:
              this.handleClickMsgFlow(param, 0, 1, ...restParams);
              break;
            case 32:
              this.handleClickElecMsg(deviceId, paramName);
              break;
            case 36:
              // this.handleClickWater(0, WATER_TYPES.indexOf(+deviceType));
              this.handleClickWater(0, WATER_TYPES.indexOf(+deviceType), deviceId);
              break;
            case 38:
              this.handleClickMsgFlow(param, 1, 0, ...restParams);
              break;
            case 39:
              this.handleClickMsgFlow(param, 2, 0, ...restParams);
              break;
            case 40:
              this.handleClickMsgFlow(param, 1, 1, ...restParams);
              break;
            default:
              console.log('default click');
          }
        }}
      >
        <div>
          <span className={styles.time}>刚刚</span>{' '}
          {/* <span className={styles.time}>{moment(addTime).format('YYYY-MM-DD HH:mm')}</span>{' '} */}
          {/* <span className={styles.time}>{addTimeStr}</span>{' '} */}
          <span className={styles.address}>{installAddress || area + location || ''}</span>
        </div>
        <div>
          {(type === 7 || type === 9) &&
            unitTypeName && (
              <span className={styles.device} style={{ color: msgItem.color }}>
                【{unitTypeName}】
              </span>
            )}
          {(type === 38 || type === 39 || type === 40) && (
            <span className={styles.device} style={{ color: msgItem.color }}>
              {type === 39 ? `【可燃气体探测器】` : `【独立烟感探测器】`}
            </span>
          )}
          {type === 36 && (
            <span className={styles.device} style={{ color: msgItem.color }}>
              {`【水系统探测器】${deviceTypeName}`}
            </span>
          )}
          {type === 32 && (
            <span className={styles.device} style={{ color: msgItem.color }}>
              {`【电气火灾探测器】${paramName}`}
            </span>
          )}
          {msgItem.body}
        </div>
        <div>{msgItem.bottom}</div>
      </div>
    );
  };

  polling = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { checkItemId } = this.state;
    // 获取消防主机监测
    this.fetchFireAlarmSystem();

    // 获取当前隐患列表
    this.fetchHiddenDangerNum();

    // 获取企业信息
    dispatch({
      type: 'newUnitFireControl/fetchCompanyMessage',
      payload: {
        company_id: companyId,
        type: '2',
        month: moment().format('YYYY-MM'),
      },
    });

    // 获取所有工单
    this.handleFetchAllWorkOrder();

    // 获取大屏消息
    this.fetchScreenMessage(dispatch, companyId);

    // 获取点位
    this.fetchPointList();

    // 获取当前隐患列表
    this.fetchCurrentHiddenDanger(companyId);

    //获取巡查记录
    dispatch({
      type: 'newUnitFireControl/fetchPointRecord',
      payload: {
        itemId: checkItemId,
        item_type: 2,
      },
    });

    // 获取水系统---消火栓系统
    // this.fetchWaterSystem('101');
    this.fetchAllWaterSystem();
  };

  fetchPointList = () => {
    const {
      dispatch,
      match: { params: { unitId: companyId } },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchPointList',
      payload: { companyId, screenType: 'gas' },
    });
  };

  fetchHiddenDangerNum = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取当前隐患图表统计数据
    dispatch({
      type: 'newUnitFireControl/fetchHiddenDangerNum',
      payload: { companyId, businessType: 'all' },
    });
  };

  fetchCurrentHiddenDanger = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCurrentHiddenDanger',
      payload: {
        company_id: companyId,
        // businessType: 2,
      },
    });
  };

  fetchAllWaterSystem = () => {
    WATER_TYPES.forEach(this.fetchWaterSystem);
  };

  // 获取水系统
  fetchWaterSystem = type => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'gasStation/fetchWaterSystem',
      payload: {
        companyId,
        type,
      },
    });
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
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMaintenanceDetail',
      payload: {
        id,
      },
    });
  };

  /**
   * 获取大屏消息
   */
  fetchScreenMessage = (dispatch, companyId) => {
    dispatch({
      type: 'gasStation/fetchScreenMessage',
      payload: {
        companyId,
      },
      success: res => {
        const {
          list: [{ itemId, messageFlag, type } = {}],
        } = res;
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

        this.topId = res.list[0] ? res.list[0].messageId : undefined;
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
   * 移除四色图隐患提示
   */
  removeFourColorTip2 = id => {
    const { fourColorTips, deletedFourColorTips } = this.state;
    // 删除对应的tip，将隐患id存放到删除列表中
    this.setState({
      deletedFourColorTips: deletedFourColorTips.concat(fourColorTips[id]),
      fourColorTips: { ...fourColorTips, [id]: undefined },
    });
  };

  /**
   *  点击播放重点部位监控
   */
  handleShowVideo = (keyId, showList = true) => {
    this.setState({ videoVisible: true, videoKeyId: keyId, showVideoList: showList });
  };

  /**
   *  点击播放重点部位监控
   */
  handleShowFireVideo = videoList => {
    if (!Array.isArray(videoList) || videoList.length === 0) return null;
    this.setState({ fireVideoVisible: true, videoList });
  };

  handleShowFlowVideo = videoList => {
    // if (!Array.isArray(videoList) || videoList.length === 0) return null;
    this.setState({ fireVideoVisible: true });
  };

  /**
   *  关闭重点部位监控
   */
  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: undefined });
  };

  /**
   *  关闭视频监控
   */
  handleFireVideoClose = () => {
    this.setState({ fireVideoVisible: false, fireVideoKeyId: undefined });
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
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取当前隐患图表统计数据
    this.fetchHiddenDangerNum();

    dispatch({
      type: 'bigPlatform/fetchHiddenDangerListForPage',
      payload: {
        company_id: companyId,
        // businessType: 2,
        pageNum: 1,
        pageSize: 10,
        status: 5,
      },
    });
    this.setState({ currentDrawerVisible: true });
  };

  /**
   * 打开检查点抽屉
   */
  handleCheckDrawer = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取检查点列表
    dispatch({
      type: 'newUnitFireControl/fetchCheckDetail',
      payload: {
        companyId,
        item_type: 2,
      },
    });
    // 获取当前隐患列表
    this.fetchCurrentHiddenDanger(companyId);

    this.setState({ checkDrawerVisible: true });
  };
  /**
   * 查看点位名称
   * */
  handlePointDrawer = pointData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchPointRecord',
      payload: {
        itemId: pointData.item_id,
        item_type: 2,
      },
    });
    this.setState({
      pointDrawerVisible: true,
      checkStatus: pointData.status,
      checkItemId: pointData.item_id,
      checkPointName: pointData.object_title,
    });
  };

  //获取巡查记录
  handlePointRecordList = checkItemId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchPointRecord',
      payload: {
        itemId: checkItemId,
        item_type: 2,
      },
    });
  };

  // 点击查看隐患详情
  handleViewDangerDetail = data => {
    this.fetchDangerDetail(data.id);
    this.setState({
      hiddenDangerIds: [data.id],
      dangerDetailVisible: true,
    });
  };

  // 巡查点击查看隐患详情
  handleCheckDangerDetail = (ids = []) => {
    this.fetchDangerDetail(ids[0]);
    this.setState({
      hiddenDangerIds: ids,
      dangerDetailVisible: true,
    });
  };

  // 点击查看隐患详情
  fetchDangerDetail = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchHiddenDangerDetail',
      payload: { id },
    });
  };

  /**
   * 修改点位巡查抽屉选中时间
   */
  handleChangePointInspectionDrawerSelectedDate = date => {
    this.setState({ pointInspectionDrawerSelectedDate: date });
    this.fetchPointInspectionList(date);
  };

  handleFetchAlarmHandle = (dataId, historyType, callback) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;

    dispatch({
      type: 'newUnitFireControl/fetchAlarmHandle',
      payload: { companyId, dataId, historyType },
      callback,
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
      payload: { companyId, id, status, except: 3 },
    });
  };

  handleFetchAllWorkOrder = () => {
    [1, 2, 7].forEach(s => this.handleFetchWorkOrder(s));
  };

  handleWorkOrderLabelChange = type => {
    this.setState({ drawerType: type });
  };

  handleWorkOrderCardClick = item => {
    const { id, type, data_id } = item;
    const isFire = +type === 1 || +type === 2;
    if (!isFire) {
      this.handleDrawerVisibleChange('maintenance');
      this.handleFetchWorkOrder(undefined, id);
    } else {
      this.handleDrawerVisibleChange('alarmMessage');
      this.handleFetchAlarmHandle(data_id);
    }
  };

  handleWorkOrderCardClickMsg = ids => {
    this.handleDrawerVisibleChange('maintenanceMsg');
    this.setState({ processIds: ids });
    this.fetchFaultDetail(ids[0]);
  };

  fetchFaultDetail = id => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMaintenanceMsg',
      payload: { companyId, id },
    });
  };

  handleShowAlarmHistory = e => {
    this.handleFetchAlarmHandle(0, 1);
    this.handleDrawerVisibleChange('alarmHistory');
  };

  handleShowFault = e => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;

    dispatch({
      type: 'newUnitFireControl/fetchFault',
      payload: { companyId },
      callback: res => {
        const {
          data: {
            list: [{ cameraMessage }],
          },
        } = res;
        this.handleShowFireVideo(cameraMessage);
      },
    });
    this.handleDrawerVisibleChange('fault');
  };

  handleClickMessage = (dataId, msg) => {
    const { cameraMessage } = msg;
    this.hiddeAllPopup();
    this.handleFetchAlarmHandle(dataId);
    this.setState({ alarmMessageDrawerVisible: true });
    this.handleShowFireVideo(cameraMessage);
  };

  handleFireMessage = processIds => {
    this.setState({ fireProcessIds: processIds });
    this.handleFetchDataId(processIds[0], res => {
      if (!res.data) return;
      const {
        data: { dataId },
      } = res;
      this.handleFetchAlarmHandle(dataId);
      this.setState({ alarmDynamicMsgDrawerVisible: true });
    });
  };

  handleFetchDataId = (processId, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchDataId',
      payload: { id: processId },
      success: callback,
    });
  };

  handleFaultClick = data => {
    const { cameraMessage, messageFlag } = data;
    this.hiddeAllPopup();
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMaintenanceMsg',
      payload: { dataId: messageFlag, companyId },
      callback: res => {
        if (!res.data.list.length) {
          this.setState({ faultMessage: data, faultMessageDrawerVisible: true });
          return;
        }
        this.setState({
          maintenanceTitle: '故障处理动态',
          processIds: res.data.list.map(item => item.id),
        });
        this.handleDrawerVisibleChange('maintenanceMsg');
        this.handleShowFireVideo(cameraMessage);
      },
    });
  };

  hiddeAllPopup = () => {
    this.setState({ ...popupVisible });
  };

  // 点击当前隐患图表进行筛选
  handleFilterCurrentDanger = ({ dataIndex }, callback = null) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const status =
      (dataIndex === 0 && '7') || (dataIndex === 1 && '2') || (dataIndex === 2 && '3') || 5;
    this.setState({ hdStatus: status });
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerListForPage',
      payload: {
        company_id: companyId,
        // businessType: 2,
        status,
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  fetchHiddenDangerList = pageNum => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { hdStatus = 5 } = this.state;
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerListForPage',
      payload: {
        company_id: companyId,
        // businessType: 2,
        status: hdStatus,
        pageNum,
        pageSize: 10,
      },
    });
  };

  // 关闭火灾自动报警抽屉
  handleCloseFireAlarm = () => {
    this.setState({
      fireAlarmVisible: false,
    });
  };

  // 查看火灾自动报警抽屉
  handleViewFireAlarm = ({ sysId, sysName }) => {
    this.fetchViewFireAlarm(sysId);
    this.setState({
      fireAlarmVisible: true,
      fireAlarmTitle: sysName,
      sysId,
    });
  };

  fetchViewFireAlarm = systemId => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { sysId } = this.state;
    dispatch({
      type: 'newUnitFireControl/fetchCheckRecord',
      payload: {
        pageNum: 1,
        pageSize: 10,
        sysId: systemId || sysId,
        companyId,
      },
    });
  };

  handleViewWater = (i, filterIndex) => {
    const state = {
      waterSystemDrawerVisible: true,
      waterTabItem: i,
    };
    if (filterIndex !== undefined) state.filterIndex = filterIndex;

    this.setState(state);
  };

  handleCloseWater = () => {
    this.setState({
      waterSystemDrawerVisible: false,
    });
  };

  handleParentChange = newState => {
    this.setState({ ...newState });
  };

  handlePlay = (list, callback) => {
    const MediaPlayUrls = list.map(({ rtsp_address, name }) => ({
      videoUrl: rtsp_address,
      videoName: name,
    }));
    const url = 'ws://localhost:10035/test';
    const ws = new WebSocket(url);
    ws.onopen = () => {
      ws.send(JSON.stringify({ MediaPlayUrls }));
    };

    ws.onmessage = e => {
      console.log(e.data);
      ws.close();
    };

    ws.onerror = () => {
      console.log('error');
      callback();
      ws.close();
    };

    ws.onclose = () => {
      console.log('close');
    };
  };

  handleClickSmoke = index => {
    this.setState({ smokeDrawerVisible: true, filterIndex: index });
  };

  // handleClickWater = (index, typeIndex) => {
  //   const { waterTabItem } = this.state;
  //   const {
  //     dispatch,
  //     match: {
  //       params: { unitId: companyId },
  //     },
  //   } = this.props;
  //   dispatch({
  //     type: 'gasStation/fetchWaterSystem',
  //     payload: {
  //       companyId,
  //       type: WATER_TYPES[typeIndex],
  //     },
  //     callback: () => {
  //       this.setState({
  //         waterSystemDrawerVisible: true,
  //         filterIndex: index,
  //         waterTabItem: typeIndex || typeIndex === 0 ? typeIndex : waterTabItem,
  //       });
  //     },
  //   });
  // };

  handleClickWater = (index, typeIndex, deviceId) => {
    // const { waterTabItem } = this.state;
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'gasStation/fetchWaterSystem',
      payload: {
        companyId,
        type: WATER_TYPES[typeIndex],
      },
      callback: list => {
        this.setState({ waterTabItem: typeIndex });
        const item = list.find(({ deviceDataList }) => {
          if (Array.isArray(deviceDataList) && deviceDataList[0])
            return deviceDataList[0].deviceId === deviceId;
          return false;
        });
        item && this.showWaterItemDrawer(item);
      },
    });
  };

  handleClickElectricity = (index, deviceId, paramName) => {
    this.setState({ electricityDrawerVisible: true, filterIndex: index });
    const selectDeviceCallback = () => (paramName ? this.setAlertedLabelIndex(paramName) : null);
    deviceId && this.handleSelectDevice(deviceId, selectDeviceCallback);
  };

  handleClickCheck = index => {
    this.setState({ checksDrawerVisible: true, filterIndex: index });
  };

  handleClickWorkOrder = index => {
    this.getAllDetail(index, 0, 1);
    this.setState({ newWorkOrderDrawerVisible: true, workOrderStatus: index, workOrderType: 0 });
    this.getWordOrderCount(index);
    if (document.getElementById(`workOrderScroll`))
      document.getElementById(`workOrderScroll`).scrollTop = 0;
  };

  getAllDetail = (status, type = 1, pageNum, params = {}) => {
    // status 0 待处理 1 处理中 2 已处理
    const {
      dispatch,
      match: {
        params: { unitId },
      },
    } = this.props;
    const reportTypes = [1, 4, 3, 2]; // 1:火灾报警  2:一键报修 3:可燃气体 4:烟感

    dispatch({
      type: 'newUnitFireControl/fetchAllDetail',
      payload: {
        unitId,
        status: status === 0 ? 2 : status === 1 ? 0 : 1,
        reportType: reportTypes[type],
        pageNum,
        pageSize: 10,
        ...params,
      },
    });
  };

  getWordOrderCount = status => {
    const {
      dispatch,
      match: {
        params: { unitId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCountFinishByUserId',
      payload: {
        companyId: unitId,
        isMyself: false,
        status: status === 0 ? 2 : status === 1 ? 0 : 1,
      },
    });
  };

  handleClickWorkOrderTab = index => {
    const { workOrderStatus, workOrderSelectType } = this.state;
    const fetchDetail =
      workOrderSelectType === 'all'
        ? this.getAllDetail
        : workOrderSelectType === 'warning'
          ? this.getWarnDetail
          : this.getFaultDetail;
    if (index === 3) this.getAllDetail(workOrderStatus, index, 1);
    // 一键报修
    else fetchDetail(workOrderStatus, index, 1);
    this.setState({ workOrderType: index });
  };

  handleSelectWorkOrderType = type => {
    // all, warning, fault
    const { workOrderStatus, workOrderType } = this.state;
    this.setState({ workOrderSelectType: type });
    const fetchDetail =
      type === 'all'
        ? this.getAllDetail
        : type === 'warning'
          ? this.getWarnDetail
          : this.getFaultDetail;
    fetchDetail(workOrderStatus, workOrderType, 1);
  };

  getWarnDetail = (status, type = 1, pageNum, params = {}) => {
    // status 0 待处理 1 处理中 2 已处理
    const {
      dispatch,
      match: {
        params: { unitId },
      },
    } = this.props;
    const reportTypes = [1, 4, 3, 2]; // 1:火灾报警  2:一键报修 3:可燃气体 4:烟感

    dispatch({
      type: 'newUnitFireControl/fetchWarnDetail',
      payload: {
        unitId,
        status: status === 0 ? 2 : status === 1 ? 0 : 1,
        reportType: reportTypes[type],
        pageNum,
        pageSize: 10,
        ...params,
      },
    });
  };

  getFaultDetail = (status, type = 1, pageNum, params = {}) => {
    // status 0 待处理 1 处理中 2 已处理
    const {
      dispatch,
      match: {
        params: { unitId },
      },
    } = this.props;
    const reportTypes = [1, 4, 3, 2];

    dispatch({
      type: 'newUnitFireControl/fetchFaultDetail',
      payload: {
        unitId,
        status: status === 0 ? 2 : status === 1 ? 0 : 1,
        reportType: reportTypes[type],
        pageNum,
        pageSize: 10,
        ...params,
      },
    });
  };

  setAlertedLabelIndexFn = f => {
    this.setAlertedLabelIndex = f;
  };

  handleSelectDevice = (deviceId, callback) => {
    this.getDeviceRealTimeData(deviceId, callback);
    this.getDeviceHistoryData(deviceId);
    this.getDeviceConfig(deviceId);
    this.getDeviceCamera(deviceId, 3);
  };

  getDeviceCamera = (deviceId, type, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceCamera',
      payload: { deviceId, type },
      callback,
    });
  };

  getDeviceRealTimeData = (deviceId, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceRealTimeData',
      payload: { deviceId },
      callback,
    });
    this.elecDrawerDeviceId = deviceId;
  };

  getDeviceHistoryData = deviceId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceHistoryData',
      payload: { deviceId, historyDataType: 1 },
    });
  };

  getDeviceConfig = deviceId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electricityMonitor/fetchDeviceConfig',
      payload: { deviceId },
    });
  };

  fetchFireAlarmSystem = () => {
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
  };

  // 复位单个主机
  handleResetSingleHost = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitFireControl/changeSingleHost',
      payload: {
        id,
      },
      success: () => {
        this.fetchFireAlarmSystem();
      },
    });
  };

  // 复位所有主机
  handleResetAllHosts = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取主机列表
    dispatch({
      type: 'unitFireControl/changeAllHosts',
      payload: {
        companyId,
      },
      success: () => {
        this.fetchFireAlarmSystem();
      },
    });
  };

  handleSwitchFireControlType = fireControlType => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.setState({
      fireControlType,
    });
    // 重新获取消防数据统计
    dispatch({
      type: 'unitFireControl/fetchFireControlCount',
      payload: {
        companyId,
        t: fireControlType,
      },
    });
  };

  handleShowFireMonitor = fireMonitorIndex => {
    this.setState({ fireMonitorIndex });
  };

  // 获取消息人员列表
  fetchMessageInformList = ids => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMessageInformList',
      payload: { ids },
    });
  };

  // 处理工单处理动态
  showWorkOrderDetail = (param, type, flow, occurData, cameraMessage = []) => {
    // type 0/1/2/3 主机/烟感/燃气/一键报修
    // flow 0/1 报警/故障
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const drawerVisibles = [
      'fireFlowDrawerVisible',
      'smokeFlowDrawerVisible',
      'gasFlowDrawerVisible',
      'onekeyFlowDrawerVisible',
    ];
    const reportTypes = [1, 4, 3, 2];
    if (occurData) {
      dispatch({
        type: 'newUnitFireControl/saveWorkOrderDetail',
        payload: occurData,
      });
    } else {
      dispatch({
        type: 'newUnitFireControl/fetchWorkOrder',
        payload: { companyId, reportType: reportTypes[type], ...param },
      });
    }
    this.setState({
      [drawerVisibles[type]]: true,
      msgFlow: flow,
      dynamicType: type,
      videoList: cameraMessage,
    });
  };

  handleShowAlarmFlows = flow => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchDangerChartId',
      payload: { companyId },
      callback: res => {
        const { fireId, faultId } = res;
        const ids = flow === 0 ? fireId : faultId;
        const { id, status } = ids[0];
        const fetchFlow = flow === 0 ? this.getWarnDetail : this.getFaultDetail;
        fetchFlow(status, 0, 1, { id, status });
        this.setState({ fireMonitorFlowDrawerVisible: true, msgFlow: flow });
      },
    });
  };

  handleClickMsgFlow = (
    param,
    type,
    flow,
    // repeat,
    cameraMessage = [],
    occurData,
    isHidePopups = true
  ) => {
    // type 0/1/2/3 主机/烟感/燃气/一键报修
    // flow 0/1 报警/故障
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const drawerVisibles = [
      'fireFlowDrawerVisible',
      'smokeFlowDrawerVisible',
      'gasFlowDrawerVisible',
      'onekeyFlowDrawerVisible',
    ];
    const reportTypes = [1, 4, 3, 2];
    isHidePopups && this.hiddeAllPopup();
    if (type !== 3) {
      // 待处理请求重复上报次数，第一次、最后一次上报时间
      // 返回null则状态已到处理中或已完成
      dispatch({
        type: 'newUnitFireControl/fetchCountNumAndTimeById',
        payload: {
          id: param.dataId || param.id,
          reportType: reportTypes[type],
          fireType: flow + 1,
        },
        callback: res => {
          if (res) {
            // 待处理自行拼
            const { num, lastTime, firstTime } = res;
            dispatch({
              type: 'newUnitFireControl/saveWorkOrderDetail',
              payload: [{ ...occurData[0], firstTime, num, lastTime }],
            });
          } else {
            // 处理中，已完成请求接口流程信息
            dispatch({
              type: 'newUnitFireControl/fetchWorkOrder',
              payload: { companyId, reportType: reportTypes[type], ...param },
            });
          }
        },
      });
    } else {
      // 一键报修没有重复上报
      dispatch({
        type: 'newUnitFireControl/fetchWorkOrder',
        payload: { companyId, reportType: reportTypes[type], ...param },
        callback: res => {
          if (!(res.data && Array.isArray(res.data.list))) return;
          if (res.data.list.length === 0) {
            dispatch({
              type: 'newUnitFireControl/saveWorkOrderDetail',
              payload: occurData,
            });
          }
        },
      });
    }
    this.setState({
      [drawerVisibles[type]]: true,
      msgFlow: flow,
      dynamicType: type,
      videoList: cameraMessage,
    });
  };

  handleClickElecMsg = (deviceId, paramName) => {
    const {
      gasStation: {
        distributionBoxClassification: { alarm = [], loss = [], normal = [] },
      },
    } = this.props;
    const data = [...alarm, ...loss, ...normal].filter(({ id }) => id === deviceId)[0];
    if (data) {
      this.showElectricalFireMonitoringDetailDrawer(data, paramName);
    } else {
      console.log('未找到设备对应的数据');
    }
  };

  handleShowResetSection = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'unitFireControl/fetchHosts',
      payload: {
        companyId,
      },
    });
    this.setState({ resetHostsDrawerVisible: true });
  };

  /* 显示电气火灾监测抽屉 */
  showElectricalFireMonitoringDrawer = electricalFireMonitoringDrawerValue => {
    this.setState({
      electricalFireMonitoringDrawerVisible: true,
      electricalFireMonitoringDrawerValue,
    });
  };

  /* 隐藏电气火灾监测抽屉 */
  hideElectricalFireMonitoringDrawer = () => {
    this.setState({
      electricalFireMonitoringDrawerVisible: false,
    });
  };

  /* 显示电气火灾监测详情抽屉 */
  showElectricalFireMonitoringDetailDrawer = (
    electricalFireMonitoringDetailDrawerValue,
    paramName = '漏电电流'
  ) => {
    this.setState({
      electricalFireMonitoringDetailDrawerVisible: true,
      electricalFireMonitoringDetailDrawerValue,
      electricalFireMonitoringDetailDrawerActiveKey:
        paramName === '漏电电流' ? '漏电电流' : paramName.slice(-2),
    });
  };

  /* 隐藏电气火灾监测详情抽屉 */
  hideElectricalFireMonitoringDetailDrawer = () => {
    this.setState({
      electricalFireMonitoringDetailDrawerVisible: false,
    });
  };

  showWaterItemDrawer = (item, tabIndex) => {
    const { dispatch } = this.props;
    const {
      deviceDataList: [{ deviceId }],
    } = item;
    const state = { waterItem: item, waterItemDrawerVisible: true };
    if (tabIndex !== undefined) state.waterTabItem = tabIndex;
    this.setState(state);
    dispatch({
      type: 'gasStation/fetchWaterHistory',
      payload: { deviceId, historyType: 1, queryDate: moment().format('YYYY/MM/DD HH:mm:ss') },
    });
    this.fetchAlarmCount(deviceId, 1);
  };

  fetchAlarmCount = (deviceId, type) => {
    const { dispatch } = this.props;
    dispatch({ type: 'gasStation/fetchWaterHistoryAlarm', payload: { deviceId, type } });
  };

  hdieWaterItemDrawer = () => {
    this.setState({ waterItemDrawerVisible: false });
  };

  render() {
    // 从props中获取数据
    const {
      match: {
        params: { unitId: companyId },
      },
      monitor: { allCamera, cameraTree },
      newUnitFireControl: {
        currentHiddenDanger,
        currentHiddenDanger: { timestampList },
        // checkCount,
        // checkList,
        pointRecordList: { pointRecordLists, abnormal: checkAbnormal, count },
        alarmHandleMessage,
        alarmHandleList,
        alarmHandleHistory,
        workOrderList1,
        workOrderList2,
        workOrderList7,
        workOrderDetail, // 只有一个元素的数组
        fireAlarm,
        faultList,
        maintenanceCompany: {
          name: maintenanceCompanys = [],
          PrincipalName = '', // 安全管理员
          PrincipalPhone = '', // 安全管理员电话
        },
        warnDetail,
        faultDetail,
        allDetail,
        countAllFireAndFault,
        countFinishByUserId,
        dangerChartId: { fireId = [], faultId = [] },
      },
      smoke: { companySmokeInfo },
      electricityMonitor: {
        deviceStatusCount,
        deviceRealTimeData,
        // deviceRealTimeDataMonitor,
        devices,
        deviceConfig,
        deviceHistoryData,
        videoByDevice,
      },
      bigPlatform: { coItemList, hiddenDangerList },
      unitFireControl: { hosts, fireControlCount },
      unitSafety: { points, phoneVisible },
      gasStation: { waterAlarmCount, waterHistory, pond, spray, hydrant, unitPhoto },
      warnDetailLoading,
      faultDetailLoading,
      allDetailLoading,
      hiddenDangerLoading,
    } = this.props;

    const {
      videoVisible,
      showVideoList,
      videoKeyId,
      workOrderDrawerVisible,
      alarmMessageDrawerVisible,
      faultMessageDrawerVisible,
      alarmDynamicDrawerVisible,
      alarmHistoryDrawerVisible,
      pointInspectionDrawerVisible,
      pointInspectionDrawerSelectedDate,
      riskDrawerVisible,
      checkDrawerVisible,
      pointDrawerVisible,
      currentDrawerVisible,
      dangerDetailVisible,
      drawerType,
      maintenanceDrawerVisible,
      fourColorTips,
      fireAlarmVisible,
      checkStatus,
      checkPointName,
      checkItemId,
      maintenanceCheckDrawerVisible,
      faultDrawerVisible,
      fireAlarmTitle,
      faultMessage,
      maintenanceTitle,
      maintenanceMsgDrawerVisible,
      processIds,
      fireProcessIds,
      alarmDynamicMsgDrawerVisible,
      latestHiddenDangerId,
      videoList,
      fireVideoVisible,
      // fireVideoKeyId,
      waterSystemDrawerVisible,
      waterTabItem,
      smokeDrawerVisible,
      filterIndex,
      electricityDrawerVisible,
      resetHostsDrawerVisible,
      checksDrawerVisible,
      newWorkOrderDrawerVisible,
      workOrderType,
      workOrderStatus,
      // fireMonitorIndex,
      // fireControlType,
      fireFlowDrawerVisible,
      // occurData,
      smokeFlowDrawerVisible,
      onekeyFlowDrawerVisible,
      gasFlowDrawerVisible,
      msgFlow,
      setDrawerVisible,
      flowRepeat,
      fireMonitorFlowDrawerVisible,
      dynamicType,
      workOrderSelectType,
      hiddenDangerIds,
      waterItem,
      waterItemDrawerVisible,
    } = this.state;
    const headProps = {
      ...workOrderDetail[0],
      dynamicType,
      videoList,
      onCameraClick: this.handleShowFlowVideo,
    };

    return (
      <BigPlatformLayout
        title="加油站驾驶舱"
        style={{
          backgroundImage: 'none',
          backgroundColor: 'rgb(0, 24, 52)',
        }}
        headerStyle={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          fontSize: 16,
          zIndex: 99,
          backgroundImage: `url(${headerBg})`,
          backgroundSize: '100% 100%',
        }}
        titleStyle={{ fontSize: document.body.offsetWidth < 1380 ? 36 : 46 }}
        contentStyle={{ position: 'relative', height: '100%', zIndex: 0 }}
        settable
        onSet={() => this.handleDrawerVisibleChange('set')}
      >
        {/* 四色图 */}
        <FourColor
          model={this.props.newUnitFireControl}
          handleShowPointDetail={(checkItemId, checkStatus, checkPointName) => {
            this.handlePointRecordList(checkItemId);
            this.handleDrawerVisibleChange('point', {
              checkItemId,
              checkStatus,
              checkPointName,
            });
          }}
          handleShowHiddenDanger={(id, hiddenDangerId) => {
            this.handleViewDangerDetail({ id: hiddenDangerId });
            this.removeFourColorTip(id, hiddenDangerId);
          }}
          handlePlay={this.handlePlay}
          tips={fourColorTips}
          latestHiddenDangerId={latestHiddenDangerId}
        />
        {/* <Tooltip placement="bottomLeft" overlayClassName={styles.tooltip} title="视频监控">
          <div
            className={styles.videoBtn}
            style={{
              backgroundImage: `url(${videoBtn})`,
              backgroundRepeat: 'no-repeat',
              groundPosition: 'center center',
              backgroundSize: '100% 100%',
              transform: 'none',
            }}
            onClick={() => this.handleShowVideo(findFirstVideo(cameraTree).id)}
          />
        </Tooltip> */}
        <div className={styles.companyInfo}>
          {/* 企业基本信息 */}
          <CompanyInfo
            handleViewCurrentDanger={this.handleViewCurrentDanger}
            handleCheckDrawer={this.handleCheckDrawer}
            model={this.props.newUnitFireControl}
            src={unitPhoto}
            data={points}
            phoneVisible={phoneVisible}
          />
        </div>
        {/* 实时消息 */}
        <Messages
          cssType="1"
          className={styles.realTimeMessage}
          model={this.props.gasStation}
          phoneVisible={phoneVisible}
          handleParentChange={this.handleParentChange}
          handleClickMsgFlow={this.handleClickMsgFlow}
          handleViewDangerDetail={this.handleViewDangerDetail}
          fetchData={this.fetchMaintenanceCheck}
          handleClickMessage={this.handleClickMessage}
          handleFaultClick={this.handleFaultClick}
          handleWorkOrderCardClickMsg={this.handleWorkOrderCardClickMsg}
          handleFireMessage={this.handleFireMessage}
          handleClickElecMsg={this.handleClickElecMsg}
          handleClickSmoke={this.handleClickSmoke}
          handleClickWater={this.handleClickWater}
        />
        <div className={styles.bottom}>
          <div className={styles.bottomInner}>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 电气火灾监测 */}
                <ElectricalFireMonitoring
                  companyId={this.props.match.params.unitId}
                  onSingleClick={this.showElectricalFireMonitoringDetailDrawer}
                  onMultipleClick={this.showElectricalFireMonitoringDrawer}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 水系统 */}
                <WaterSystem
                  companyId={companyId}
                  onClick={this.handleViewWater}
                  data={{ pond, spray, hydrant }}
                  fetchWaterSystem={this.fetchWaterSystem}
                  showWaterItemDrawer={this.showWaterItemDrawer}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.inner}>
                {/* 安全巡查/处理工单 */}
                <CheckWorkOrder
                  coItemList={coItemList}
                  checkClick={this.handleClickCheck}
                  workOrderClick={this.handleClickWorkOrder}
                  countAllFireAndFault={countAllFireAndFault}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.innerLast}>
                {/* 重点部位监控 */}
                <VideoSurveillance
                  handlePlay={this.handlePlay}
                  handleShowVideo={this.handleShowVideo}
                  data={cameraTree}
                />
              </div>
            </div>
          </div>
        </div>
        <NewVideoPlay
          showList={showVideoList}
          videoList={cameraTree}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
          isTree={true}
        />
        <NewVideoPlay
          showList={true}
          videoList={videoList}
          visible={fireVideoVisible}
          keyId={videoList.length > 0 ? findFirstVideo(videoList).id : undefined} // keyId
          handleVideoClose={this.handleFireVideoClose}
          isTree={false}
        />
        <RiskDrawer
          visible={riskDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        <CheckPointDrawer
          visible={checkDrawerVisible}
          data={points}
          currentHiddenDanger={currentHiddenDanger}
          handlePointDrawer={this.handlePointDrawer}
          onClose={() => {
            this.setState({
              checkDrawerVisible: false,
            });
          }}
        />
        {/**点位名称抽屉 */}
        <PointPositionName
          visible={pointDrawerVisible}
          points={points}
          pointRecordLists={pointRecordLists}
          checkAbnormal={checkAbnormal}
          currentHiddenDanger={currentHiddenDanger}
          checkStatus={checkStatus}
          checkPointName={checkPointName}
          checkItemId={checkItemId}
          count={count}
          handlePointDangerDetail={this.handleViewDangerDetail}
          handleCheckDangerDetail={this.handleCheckDangerDetail}
          onClose={() => {
            this.setState({
              pointDrawerVisible: false,
            });
          }}
        />
        <AlarmDynamicDrawer
          data={alarmHandleMessage}
          visible={alarmMessageDrawerVisible}
          onClose={() => this.setState({ alarmMessageDrawerVisible: false })}
          phoneVisible={phoneVisible}
          handleParentChange={this.handleParentChange}
        />
        <FaultMessageDrawer
          data={faultMessage}
          model={this.props.newUnitFireControl}
          visible={faultMessageDrawerVisible}
          onClose={() => this.setState({ faultMessageDrawerVisible: false })}
        />
        <AlarmDynamicDrawer
          data={alarmHandleList}
          visible={alarmDynamicDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('alarmDynamic')}
          phoneVisible={phoneVisible}
        />
        <AlarmDynamicDrawer
          data={
            alarmHandleHistory.length > 20 ? alarmHandleHistory.slice(0, 20) : alarmHandleHistory
          }
          visible={alarmHistoryDrawerVisible}
          phoneVisible={phoneVisible}
          onClose={() => this.handleDrawerVisibleChange('alarmHistory')}
        />
        {/* 点位巡查详情 */}
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
          onClickChat={this.handleFilterCurrentDanger}
          loading={hiddenDangerLoading}
          hiddenDangerList={hiddenDangerList}
          fetchHiddenDangerList={this.fetchHiddenDangerList}
          {...currentHiddenDanger}
        />
        {/* 隐患详情抽屉 */}
        <DrawerHiddenDangerDetail
          visible={dangerDetailVisible}
          handleParentChange={this.handleParentChange}
          onClose={this.handleCloseDetailOfDanger}
          data={timestampList}
          hiddenDangerIds={hiddenDangerIds}
          fetchDangerDetail={this.fetchDangerDetail}
        />
        <WorkOrderDrawer
          data={{ workOrderList1, workOrderList2, workOrderList7 }}
          maintenanceCompanys={maintenanceCompanys.map(data => data.name).join(',')}
          type={drawerType}
          visible={workOrderDrawerVisible}
          handleLabelChange={this.handleWorkOrderLabelChange}
          onClose={() => this.handleDrawerVisibleChange('workOrder')}
          handleCardClick={this.handleWorkOrderCardClick}
        />
        <MaintenanceDrawer
          title="维保处理动态"
          type={drawerType}
          data={workOrderDetail}
          visible={maintenanceDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('maintenance')}
        />
        <MaintenanceMsgDrawer
          title={maintenanceTitle}
          type={drawerType}
          data={workOrderDetail}
          processIds={processIds}
          visible={maintenanceMsgDrawerVisible}
          fetchFaultDetail={this.fetchFaultDetail}
          onClose={() => {
            this.handleDrawerVisibleChange('maintenanceMsg');
            setTimeout(() => {
              this.setState({ maintenanceTitle: '维保处理动态' });
            }, 200);
          }}
        />
        <AlarmDynamicMsgDrawer
          data={alarmHandleMessage}
          visible={alarmDynamicMsgDrawerVisible}
          processIds={fireProcessIds}
          handleFetchDataId={this.handleFetchDataId}
          handleFetchAlarmHandle={this.handleFetchAlarmHandle}
          onClose={() => this.handleDrawerVisibleChange('alarmDynamicMsg')}
        />
        <DrawerOfFireAlarm
          visible={fireAlarmVisible}
          onClose={this.handleCloseFireAlarm}
          title={fireAlarmTitle}
          {...fireAlarm}
        />
        <MaintenanceDrawer
          title="故障处理动态"
          type={drawerType}
          data={faultList}
          visible={faultDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('fault')}
          phoneVisible={phoneVisible}
        />
        {/* 维保巡检抽屉 */}
        <MaintenanceCheckDrawer
          model={this.props.newUnitFireControl}
          visible={maintenanceCheckDrawerVisible}
          phoneVisible={phoneVisible}
          onClose={() => this.handleDrawerVisibleChange('maintenanceCheck')}
        />
        {/* 水系统抽屉 */}
        <WaterSystemDrawer
          visible={waterSystemDrawerVisible}
          waterTabItem={waterTabItem}
          onClose={this.handleCloseWater}
          waterLists={[hydrant, spray, pond]}
          showWaterItemDrawer={this.showWaterItemDrawer}
          filterIndex={filterIndex}
          handleParentChange={this.handleParentChange}
        />
        {/* 独立烟感监测抽屉 */}
        <SmokeDrawer
          visible={smokeDrawerVisible}
          companySmokeInfo={companySmokeInfo}
          onClick={this.handleClickSmoke}
          onClose={() => this.handleDrawerVisibleChange('smoke')}
          filterIndex={filterIndex}
          videoList={videoByDevice}
          getDeviceCamera={this.getDeviceCamera}
          handleClickMsgFlow={this.handleClickMsgFlow}
        />
        {/* 电气火灾监测抽屉 */}
        <ElectricityDrawer
          data={{
            deviceStatusCount,
            devices,
            deviceRealTimeData,
            deviceConfig,
            deviceHistoryData,
            cameraList: videoByDevice,
          }}
          visible={electricityDrawerVisible}
          handleClose={() => this.handleDrawerVisibleChange('electricity')}
          handleSelect={this.handleSelectDevice}
          setAlertedLabelIndexFn={this.setAlertedLabelIndexFn}
          filterIndex={filterIndex}
          onClick={this.handleClickElectricity}
        />
        {/* 一键复位抽屉 */}
        <ResetHostsDrawer
          visible={resetHostsDrawerVisible}
          hosts={hosts}
          onClose={() => {
            this.handleDrawerVisibleChange('resetHosts');
          }}
          handleResetSingleHost={this.handleResetSingleHost}
          handleResetAllHosts={this.handleResetAllHosts}
        />
        {/* 安全巡查抽屉 */}
        <CheckDrawer
          visible={checksDrawerVisible}
          coItemList={coItemList}
          data={points}
          onClose={() => this.handleDrawerVisibleChange('checks')}
          onClick={this.handleClickCheck}
          filterIndex={filterIndex}
        />
        {/* 工单抽屉 */}
        <NewWorkOrderDrawer
          handleClickTab={this.handleClickWorkOrderTab}
          workOrderType={workOrderType}
          workOrderStatus={workOrderStatus}
          warnDetailLoading={warnDetailLoading}
          faultDetailLoading={faultDetailLoading}
          handleParentChange={this.handleParentChange}
          visible={newWorkOrderDrawerVisible}
          warnDetail={warnDetail}
          faultDetail={faultDetail}
          onClose={() => this.handleDrawerVisibleChange('newWorkOrder')}
          getWarnDetail={this.getWarnDetail}
          getFaultDetail={this.getFaultDetail}
          countFinishByUserId={countFinishByUserId}
          showWorkOrderDetail={this.showWorkOrderDetail}
          phoneVisible={phoneVisible}
          allDetail={allDetail}
          allDetailLoading={allDetailLoading}
          getAllDetail={this.getAllDetail}
          handleSelectWorkOrderType={this.handleSelectWorkOrderType}
          workOrderSelectType={workOrderSelectType}
        />
        {/* 消防主机处理动态 */}
        <FireFlowDrawer
          data={workOrderDetail}
          flowRepeat={flowRepeat}
          visible={fireFlowDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('fireFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          msgFlow={msgFlow}
          phoneVisible={phoneVisible}
          headProps={headProps}
          head={true}
        />
        {/* 独立烟感处理动态 */}
        <SmokeFlowDrawer
          flowRepeat={flowRepeat}
          data={workOrderDetail}
          visible={smokeFlowDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('smokeFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          msgFlow={msgFlow}
          phoneVisible={phoneVisible}
          headProps={headProps}
          head={true}
        />
        {/* 一键报修处理动态 */}
        <OnekeyFlowDrawer
          data={workOrderDetail}
          visible={onekeyFlowDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('onekeyFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          phoneVisible={phoneVisible}
          headProps={headProps}
          head={true}
        />
        {/* 燃气处理动态 */}
        <GasFlowDrawer
          data={workOrderDetail}
          flowRepeat={flowRepeat}
          visible={gasFlowDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('gasFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          phoneVisible={phoneVisible}
          headProps={headProps}
          head={true}
        />
        {/* 设置抽屉 */}
        <SetDrawer
          visible={setDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('set')}
        />
        {/* 虚拟消控主机处理动态s */}
        <FireMonitorFlowDrawer
          visible={fireMonitorFlowDrawerVisible}
          handleParentChange={this.handleParentChange}
          onClose={() => this.handleDrawerVisibleChange('fireMonitorFlow')}
          PrincipalName={PrincipalName}
          PrincipalPhone={PrincipalPhone}
          msgFlow={msgFlow}
          phoneVisible={phoneVisible}
          fireId={fireId}
          faultId={faultId}
          warnDetail={warnDetail}
          faultDetail={faultDetail}
          warnDetailLoading={warnDetailLoading}
          faultDetailLoading={faultDetailLoading}
          getWarnDetail={this.getWarnDetail}
          getFaultDetail={this.getFaultDetail}
          handleShowFlowVideo={this.handleShowFlowVideo}
        />
        {/* 电气火灾监测抽屉 */}
        <ElectricalFireMonitoringDrawer
          visible={this.state.electricalFireMonitoringDrawerVisible}
          value={this.state.electricalFireMonitoringDrawerValue}
          onClose={this.hideElectricalFireMonitoringDrawer}
          onJump={this.showElectricalFireMonitoringDetailDrawer}
        />
        {/* 电气火灾监测详情抽屉 */}
        <ElectricalFireMonitoringDetailDrawer
          visible={this.state.electricalFireMonitoringDetailDrawerVisible}
          value={this.state.electricalFireMonitoringDetailDrawerValue}
          activeKey={this.state.electricalFireMonitoringDetailDrawerActiveKey}
          onClose={this.hideElectricalFireMonitoringDetailDrawer}
        />
        <WaterItemDrawer
          visible={waterItemDrawerVisible}
          tabItem={waterTabItem}
          fetchAlarmCount={this.fetchAlarmCount}
          handleClose={this.hdieWaterItemDrawer}
          data={{ item: waterItem, history: waterHistory, total: getWaterTotal(waterAlarmCount) }}
        />
      </BigPlatformLayout>
    );
  }
}
